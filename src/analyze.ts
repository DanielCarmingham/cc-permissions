import { readdirSync, existsSync, statSync, readFileSync, lstatSync } from "node:fs";
import { join, resolve, relative, dirname, basename } from "node:path";
import { execSync } from "node:child_process";
import type { AnalysisResult, DetectionRules, TemplateRegistry, TemplateDetection, DetectionType } from "./types.js";
import { PermissionLevel } from "./types.js";
import { getTemplates } from "./templates/loader.js";
import { fmt, formatSafetyWarning } from "./format.js";

// Cache for active MCP servers (avoid running `claude mcp list` multiple times)
let cachedMcpServers: Set<string> | null = null;

// Cache for available CLI commands (avoid running `which` multiple times)
const cachedCommands: Map<string, boolean> = new Map();

// Cache for git remote URLs (per directory)
const cachedGitRemotes: Map<string, string[]> = new Map();

// Cache for repo file listings (per analyzed directory)
const cachedRepoFiles: Map<string, string[]> = new Map();

// Directories to skip during filesystem walk fallback
const SKIP_DIRS = new Set([
  "node_modules", ".git", "vendor", "dist", "build", "target",
  "__pycache__", ".next", ".nuxt", ".output", ".venv", "venv",
  ".tox", "coverage", ".cache", ".parcel-cache", ".yarn", ".pnp",
  ".svn", ".hg",
]);

const MAX_WALK_DEPTH = 5;
const MAX_WALK_FILES = 10000;

/**
 * Get the list of active MCP servers by running `claude mcp list`.
 * Results are cached for the duration of the process.
 */
function getActiveMcpServers(): Set<string> {
  if (cachedMcpServers !== null) {
    return cachedMcpServers;
  }

  cachedMcpServers = new Set<string>();

  try {
    const output = execSync("claude mcp list", {
      encoding: "utf-8",
      timeout: 10000,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Parse output lines like:
    // plugin:context7:context7: npx -y @upstash/context7-mcp - ✓ Connected
    // MCP_DOCKER: docker mcp gateway run - ✓ Connected
    // playwright: npx @playwright/mcp@latest - ✓ Connected
    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("Checking")) continue;

      // Extract server name (everything before the first colon, or the full plugin path)
      const colonIndex = trimmed.indexOf(":");
      if (colonIndex > 0) {
        const serverName = trimmed.substring(0, colonIndex).trim();
        cachedMcpServers.add(serverName);

        // Also add the last part of plugin paths (e.g., "context7" from "plugin:context7:context7")
        if (serverName.includes(":")) {
          const parts = serverName.split(":");
          cachedMcpServers.add(parts[parts.length - 1]);
        }
      }
    }
  } catch {
    // If `claude` CLI is not available or fails, return empty set
    // This allows the tool to work even without Claude Code installed
  }

  return cachedMcpServers;
}

/**
 * Check if any of the specified MCP servers are active.
 */
function hasMcpServer(serverNames: string[]): string | null {
  const activeMcpServers = getActiveMcpServers();

  for (const name of serverNames) {
    // Case-insensitive match
    const lowerName = name.toLowerCase();
    for (const active of activeMcpServers) {
      if (active.toLowerCase() === lowerName || active.toLowerCase().includes(lowerName)) {
        return `MCP:${active}`;
      }
    }
  }

  return null;
}

/**
 * Check if a CLI command is available on the system.
 * Uses `which` on Unix-like systems or `where` on Windows.
 */
function isCommandAvailable(command: string): boolean {
  if (cachedCommands.has(command)) {
    return cachedCommands.get(command)!;
  }

  try {
    // Use `which` on Unix-like systems, `where` on Windows
    const checkCommand = process.platform === "win32" ? `where ${command}` : `which ${command}`;
    execSync(checkCommand, {
      encoding: "utf-8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    cachedCommands.set(command, true);
    return true;
  } catch {
    cachedCommands.set(command, false);
    return false;
  }
}

/**
 * Check if any of the specified CLI commands are available.
 */
function hasCommand(commands: string[]): string | null {
  for (const cmd of commands) {
    if (isCommandAvailable(cmd)) {
      return `CLI:${cmd}`;
    }
  }
  return null;
}

/**
 * Check if a directory is the root of a git repository.
 * Returns true if the directory contains a .git folder (regular repo)
 * or a .git file (worktree).
 */
function isGitRepoRoot(dir: string): boolean {
  const gitPath = join(dir, ".git");
  if (!existsSync(gitPath)) return false;
  // Both directory and file are valid (.git file is used in worktrees)
  const stat = statSync(gitPath);
  return stat.isDirectory() || stat.isFile();
}

// Cache for findGitRoot results
const cachedGitRoot: Map<string, string | null> = new Map();

// Maximum number of ancestor levels to search
const MAX_ANCESTOR_LEVELS = 10;

/**
 * Find the nearest git root by walking up from startDir.
 * Checks startDir itself first, then parent directories up to MAX_ANCESTOR_LEVELS.
 * Returns the git root path or null if not found.
 */
function findGitRoot(startDir: string): string | null {
  if (cachedGitRoot.has(startDir)) {
    return cachedGitRoot.get(startDir)!;
  }

  let dir = startDir;
  for (let i = 0; i <= MAX_ANCESTOR_LEVELS; i++) {
    if (isGitRepoRoot(dir)) {
      cachedGitRoot.set(startDir, dir);
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break; // filesystem root
    dir = parent;
  }

  cachedGitRoot.set(startDir, null);
  return null;
}

/**
 * Get git remote URLs for a directory.
 * Walks up to find the nearest git root and reads remotes from there.
 * Returns an array of remote URLs.
 */
function getGitRemotes(dir: string): string[] {
  // Find the nearest git root (may be an ancestor directory)
  const gitRoot = findGitRoot(dir);
  if (!gitRoot) {
    return [];
  }

  // Cache by git root path so all subdirs share the same result
  if (cachedGitRemotes.has(gitRoot)) {
    return cachedGitRemotes.get(gitRoot)!;
  }

  const remotes: string[] = [];

  try {
    const output = execSync("git remote -v", {
      cwd: gitRoot,
      encoding: "utf-8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Parse output lines like:
    // origin  git@github.com:user/repo.git (fetch)
    // origin  https://github.com/user/repo.git (push)
    for (const line of output.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const url = parts[1];
        if (url && !remotes.includes(url)) {
          remotes.push(url);
        }
      }
    }
  } catch {
    // Not a git repo or git not available
  }

  cachedGitRemotes.set(gitRoot, remotes);
  return remotes;
}

/**
 * Check if any git remote matches the specified patterns.
 */
function hasGitRemote(dir: string, patterns: string[]): string | null {
  const remotes = getGitRemotes(dir);

  for (const pattern of patterns) {
    const lowerPattern = pattern.toLowerCase();
    for (const remote of remotes) {
      if (remote.toLowerCase().includes(lowerPattern)) {
        return `remote:${pattern}`;
      }
    }
  }

  return null;
}

/**
 * Check if a file exists in the directory.
 * Supports glob patterns like "*.csproj"
 */
function fileExists(dir: string, pattern: string): string | null {
  try {
    if (pattern.includes("*")) {
      // Simple glob matching for extensions
      const ext = pattern.replace("*", "");
      const files = readdirSync(dir);
      const match = files.find((f) => f.endsWith(ext));
      return match ? join(dir, match) : null;
    } else {
      const filePath = join(dir, pattern);
      if (existsSync(filePath)) {
        return filePath;
      }
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Check if a directory exists in the given path.
 * Supports patterns like ".git/", ".github/workflows/", "*.xcodeproj/"
 */
function directoryExists(dir: string, pattern: string): string | null {
  try {
    // Remove trailing slash if present
    const dirPattern = pattern.endsWith("/") ? pattern.slice(0, -1) : pattern;

    if (dirPattern.includes("*")) {
      // Simple glob matching for directory names
      const suffix = dirPattern.replace("*", "");
      const entries = readdirSync(dir, { withFileTypes: true });
      const match = entries.find(
        (e) => e.isDirectory() && e.name.endsWith(suffix)
      );
      return match ? join(dir, match.name) : null;
    } else if (dirPattern.includes("/")) {
      // Nested directory path like ".github/workflows"
      const fullPath = join(dir, dirPattern);
      if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
        return fullPath;
      }
      return null;
    } else {
      // Simple directory name like ".git"
      const fullPath = join(dir, dirPattern);
      if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
        return fullPath;
      }
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Check if a file contains specific text.
 */
function fileContains(dir: string, filename: string, searchText: string): boolean {
  const filePath = join(dir, filename);
  if (!existsSync(filePath)) return false;

  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) return false;

    const content = readFileSync(filePath, "utf-8");
    return content.includes(searchText);
  } catch {
    return false;
  }
}

// Result from detectTemplate
interface DetectionResult {
  type: DetectionType;
  reason: string;
}

/**
 * Check file patterns and return first match.
 */
function checkFiles(dir: string, files: string[]): DetectionResult | null {
  for (const pattern of files) {
    const found = fileExists(dir, pattern);
    if (found) {
      return { type: "file", reason: found };
    }
  }
  return null;
}

/**
 * Check directory patterns and return first match.
 */
function checkDirectories(dir: string, directories: string[]): DetectionResult | null {
  for (const pattern of directories) {
    const found = directoryExists(dir, pattern);
    if (found) {
      return { type: "directory", reason: found };
    }
  }
  return null;
}

/**
 * Walk up from startDir checking for a file pattern at each level.
 * Returns the full path if found, null otherwise.
 */
function findAncestorWithFile(startDir: string, pattern: string): string | null {
  let dir = startDir;
  for (let i = 0; i <= MAX_ANCESTOR_LEVELS; i++) {
    const found = fileExists(dir, pattern);
    if (found) return found;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Walk up from startDir checking for a directory pattern at each level.
 * Returns the full path if found, null otherwise.
 */
function findAncestorWithDirectory(startDir: string, pattern: string): string | null {
  let dir = startDir;
  for (let i = 0; i <= MAX_ANCESTOR_LEVELS; i++) {
    const found = directoryExists(dir, pattern);
    if (found) return found;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Check ancestor file patterns and return first match.
 */
function checkAncestorFiles(dir: string, patterns: string[]): DetectionResult | null {
  for (const pattern of patterns) {
    const found = findAncestorWithFile(dir, pattern);
    if (found) {
      return { type: "ancestorFile", reason: found };
    }
  }
  return null;
}

/**
 * Check ancestor directory patterns and return first match.
 */
function checkAncestorDirectories(dir: string, patterns: string[]): DetectionResult | null {
  for (const pattern of patterns) {
    const found = findAncestorWithDirectory(dir, pattern);
    if (found) {
      return { type: "ancestorDirectory", reason: found };
    }
  }
  return null;
}

/**
 * Walk a directory tree collecting relative file paths.
 * Skips hidden directories, SKIP_DIRS entries, and symlinks.
 * Bounded by MAX_WALK_DEPTH and MAX_WALK_FILES.
 */
function walkDirectoryForFiles(startDir: string): string[] {
  const results: string[] = [];

  function walk(dir: string, depth: number): void {
    if (depth > MAX_WALK_DEPTH || results.length >= MAX_WALK_FILES) return;

    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (results.length >= MAX_WALK_FILES) return;

      const name = entry.name;

      if (entry.isDirectory()) {
        // Skip hidden directories and known noise directories
        if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;

        // Skip symlinks to prevent cycles
        try {
          const fullPath = join(dir, name);
          if (lstatSync(fullPath).isSymbolicLink()) continue;
        } catch {
          continue;
        }

        walk(join(dir, name), depth + 1);
      } else if (entry.isFile()) {
        // Skip symlinks
        try {
          const fullPath = join(dir, name);
          if (lstatSync(fullPath).isSymbolicLink()) continue;
        } catch {
          continue;
        }

        results.push(relative(startDir, join(dir, name)));
      }
    }
  }

  walk(startDir, 0);
  return results;
}

/**
 * Get list of all files under a directory.
 * Uses `git ls-files` for git repos (fast, excludes untracked noise),
 * falls back to bounded directory walk for non-git repos.
 * Results are cached per directory.
 */
function getRepoFiles(dir: string): string[] {
  if (cachedRepoFiles.has(dir)) {
    return cachedRepoFiles.get(dir)!;
  }

  let files: string[] = [];

  try {
    const output = execSync("git ls-files", {
      cwd: dir,
      encoding: "utf-8",
      timeout: 10000,
      stdio: ["pipe", "pipe", "pipe"],
    });

    files = output.split("\n").filter((f) => f.length > 0);
  } catch {
    // Not a git repo or git not available — use filesystem walk
    files = walkDirectoryForFiles(dir);
  }

  cachedRepoFiles.set(dir, files);
  return files;
}

/**
 * Check if a file pattern matches any file in the repo file list.
 * Supports glob patterns like "*.tf" (matches basename ending) and exact filenames.
 * Returns the relative path of the first match, or null.
 */
function repoFileExists(repoFiles: string[], pattern: string): string | null {
  if (pattern.includes("*")) {
    // Simple glob: "*.tf" → match files ending in ".tf"
    const suffix = pattern.replace("*", "");
    for (const file of repoFiles) {
      const name = basename(file);
      if (name.endsWith(suffix)) {
        return file;
      }
    }
  } else {
    // Exact filename match (anywhere in the tree)
    for (const file of repoFiles) {
      const name = basename(file);
      if (name === pattern) {
        return file;
      }
    }
  }
  return null;
}

/**
 * Check repo file patterns and return first match.
 */
function checkRepoFiles(dir: string, patterns: string[]): DetectionResult | null {
  const repoFiles = getRepoFiles(dir);
  for (const pattern of patterns) {
    const found = repoFileExists(repoFiles, pattern);
    if (found) {
      return { type: "repoFile", reason: found };
    }
  }
  return null;
}

/**
 * Check content patterns and return first match.
 */
function checkContentPatterns(
  dir: string,
  contentPatterns: Array<{ file: string; contains: string }>
): DetectionResult | null {
  for (const { file, contains } of contentPatterns) {
    if (fileContains(dir, file, contains)) {
      return { type: "content", reason: `${file} contains "${contains}"` };
    }
  }
  return null;
}

/**
 * Check MCP servers and return first match.
 */
function checkMcpServers(mcpServers: string[]): DetectionResult | null {
  const found = hasMcpServer(mcpServers);
  if (found) {
    const serverName = found.replace("MCP:", "");
    return { type: "mcp", reason: serverName };
  }
  return null;
}

/**
 * Check CLI commands and return first match.
 */
function checkCommands(commands: string[]): DetectionResult | null {
  const found = hasCommand(commands);
  if (found) {
    const cmdName = found.replace("CLI:", "");
    return { type: "file", reason: `${cmdName} installed` };
  }
  return null;
}

/**
 * Check git remotes and return first match.
 */
function checkGitRemotes(dir: string, gitRemotes: string[]): DetectionResult | null {
  const found = hasGitRemote(dir, gitRemotes);
  if (found) {
    const pattern = found.replace("remote:", "");
    return { type: "remote", reason: pattern };
  }
  return null;
}

/**
 * Detect if a template should be recommended based on its detection rules.
 * Returns the detection type and reason if found, null otherwise.
 *
 * Logic:
 * - If `requireAll` is true: AND mode - all specified criteria types must have at least one match
 * - If `requireAll` is false/undefined: OR mode - first match wins (current behavior)
 * - Within each criteria type (e.g., multiple files), still uses OR (any match works)
 */
function detectTemplate(
  dir: string,
  detection: DetectionRules | undefined
): DetectionResult | null {
  if (!detection) return null;

  // Check if always recommended (bypasses requireAll)
  if (detection.always) {
    return { type: "always", reason: "always included" };
  }

  // AND mode: all specified criteria types must match
  if (detection.requireAll) {
    const results: DetectionResult[] = [];

    // Check each criterion type - if specified but not matched, fail immediately
    if (detection.files) {
      const result = checkFiles(dir, detection.files);
      if (!result) return null;
      results.push(result);
    }

    if (detection.directories) {
      const result = checkDirectories(dir, detection.directories);
      if (!result) return null;
      results.push(result);
    }

    if (detection.ancestorFiles) {
      const result = checkAncestorFiles(dir, detection.ancestorFiles);
      if (!result) return null;
      results.push(result);
    }

    if (detection.ancestorDirectories) {
      const result = checkAncestorDirectories(dir, detection.ancestorDirectories);
      if (!result) return null;
      results.push(result);
    }

    if (detection.repoFiles) {
      const result = checkRepoFiles(dir, detection.repoFiles);
      if (!result) return null;
      results.push(result);
    }

    if (detection.contentPatterns) {
      const result = checkContentPatterns(dir, detection.contentPatterns);
      if (!result) return null;
      results.push(result);
    }

    if (detection.mcpServers) {
      const result = checkMcpServers(detection.mcpServers);
      if (!result) return null;
      results.push(result);
    }

    if (detection.commands) {
      const result = checkCommands(detection.commands);
      if (!result) return null;
      results.push(result);
    }

    if (detection.gitRemotes) {
      const result = checkGitRemotes(dir, detection.gitRemotes);
      if (!result) return null;
      results.push(result);
    }

    // All criteria matched - return the first result as the representative
    return results.length > 0 ? results[0] : null;
  }

  // OR mode (default): first match wins
  if (detection.files) {
    const result = checkFiles(dir, detection.files);
    if (result) return result;
  }

  if (detection.directories) {
    const result = checkDirectories(dir, detection.directories);
    if (result) return result;
  }

  if (detection.ancestorFiles) {
    const result = checkAncestorFiles(dir, detection.ancestorFiles);
    if (result) return result;
  }

  if (detection.ancestorDirectories) {
    const result = checkAncestorDirectories(dir, detection.ancestorDirectories);
    if (result) return result;
  }

  if (detection.repoFiles) {
    const result = checkRepoFiles(dir, detection.repoFiles);
    if (result) return result;
  }

  if (detection.contentPatterns) {
    const result = checkContentPatterns(dir, detection.contentPatterns);
    if (result) return result;
  }

  if (detection.mcpServers) {
    const result = checkMcpServers(detection.mcpServers);
    if (result) return result;
  }

  if (detection.commands) {
    const result = checkCommands(detection.commands);
    if (result) return result;
  }

  if (detection.gitRemotes) {
    const result = checkGitRemotes(dir, detection.gitRemotes);
    if (result) return result;
  }

  return null;
}

/**
 * Analyze a directory to recommend templates.
 */
export function analyzeDirectory(dir: string): AnalysisResult {
  const absoluteDir = resolve(dir);
  const detectedFiles: string[] = [];
  const recommendedTemplates: Set<string> = new Set();
  const detections: TemplateDetection[] = [];

  // Load templates to get detection rules
  let templates: TemplateRegistry;
  try {
    templates = getTemplates();
  } catch {
    // If templates can't be loaded, return minimal result with shell
    return {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      detections: [{ template: "shell", type: "always", reason: "always included" }],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions apply --level restrictive",
    };
  }

  // Check each template's detection rules
  for (const [name, template] of Object.entries(templates)) {
    const detected = detectTemplate(absoluteDir, template.detection);
    if (detected) {
      recommendedTemplates.add(name);

      // Format the reason for display
      let reason = detected.reason;
      if (detected.type === "file" || detected.type === "directory" ||
          detected.type === "ancestorFile" || detected.type === "ancestorDirectory") {
        const relativePath = relative(absoluteDir, detected.reason) || detected.reason;
        if (!detectedFiles.includes(relativePath)) {
          detectedFiles.push(relativePath);
        }
        reason = relativePath;
      } else if (detected.type === "repoFile") {
        // repoFile reasons are already relative paths
        if (!detectedFiles.includes(detected.reason)) {
          detectedFiles.push(detected.reason);
        }
      }

      detections.push({ template: name, type: detected.type, reason });
    }
  }

  // Ensure shell is always included (even if template loading worked but shell wasn't auto-detected)
  if (!recommendedTemplates.has("shell")) {
    recommendedTemplates.add("shell");
    detections.push({ template: "shell", type: "always", reason: "always included" });
  }

  // Sort detections alphabetically by template name
  detections.sort((a, b) => a.template.localeCompare(b.template));

  // Determine suggested level based on number of templates
  // More templates = more complex project = likely needs standard
  const templateCount = recommendedTemplates.size;
  let suggestedLevel: PermissionLevel;

  if (templateCount <= 1) {
    suggestedLevel = PermissionLevel.Restrictive;
  } else if (templateCount <= 3) {
    suggestedLevel = PermissionLevel.Standard;
  } else {
    suggestedLevel = PermissionLevel.Standard; // Stay at standard, don't auto-suggest permissive
  }

  const templateNames = Array.from(recommendedTemplates);
  const suggestedCommand =
    suggestedLevel === PermissionLevel.Standard
      ? `cc-permissions apply`
      : `cc-permissions apply --level ${suggestedLevel}`;

  return {
    detectedFiles,
    recommendedTemplates: templateNames,
    detections,
    suggestedLevel,
    suggestedCommand,
  };
}

// Format detection for display with colored type prefix (no emojis for consistent alignment)
function formatDetection(type: string, reason: string): string {
  switch (type) {
    case "file":
      return fmt.fileDetection("file:") + " " + reason;
    case "directory":
      return fmt.dirDetection("dir:") + " " + reason;
    case "ancestorFile":
      return fmt.ancestorFileDetection("ancestor-file:") + " " + reason;
    case "ancestorDirectory":
      return fmt.ancestorDirDetection("ancestor-dir:") + " " + reason;
    case "repoFile":
      return fmt.repoFileDetection("repo:") + " " + reason;
    case "content":
      return fmt.contentDetection("content:") + " " + reason;
    case "mcp":
      return fmt.mcpDetection("mcp:") + " " + reason;
    case "remote":
      return fmt.remoteDetection("remote:") + " " + reason;
    case "always":
      return fmt.alwaysDetection(reason);
    default:
      return `${type}: ${reason}`;
  }
}

// Get plain text length of detection (without color codes)
function getDetectionLength(type: string, reason: string): number {
  const prefixes: Record<string, string> = {
    file: "file:", directory: "dir:",
    ancestorFile: "ancestor-file:", ancestorDirectory: "ancestor-dir:",
    repoFile: "repo:",
    content: "content:", mcp: "mcp:", remote: "remote:", always: "",
  };
  const prefix = prefixes[type] || `${type}:`;
  if (type === "always") return reason.length;
  return prefix.length + 1 + reason.length; // prefix + space + reason
}

/**
 * Format analysis result for display.
 */
export function formatAnalysisResult(result: AnalysisResult, versionString?: string): string {
  const lines: string[] = [
    ``,
    fmt.title(`Project Analysis`, "═"),
    ``,
  ];

  if (result.detections.length === 0) {
    lines.push(`No templates detected.`);
  } else {
    // Calculate column widths
    const templateWidth = Math.max(
      8, // "Template" header
      ...result.detections.map((d) => d.template.length)
    );
    const detectedByWidth = Math.max(
      11, // "Detected By" header
      ...result.detections.map((d) => getDetectionLength(d.type, d.reason))
    );

    // Box drawing characters
    const box = {
      topLeft: "┌", topRight: "┐", bottomLeft: "└", bottomRight: "┘",
      horizontal: "─", vertical: "│",
      leftT: "├", rightT: "┤", topT: "┬", bottomT: "┴", cross: "┼",
    };

    // Build table
    const topBorder = `${box.topLeft}${box.horizontal.repeat(templateWidth + 2)}${box.topT}${box.horizontal.repeat(detectedByWidth + 2)}${box.topRight}`;
    const headerSep = `${box.leftT}${box.horizontal.repeat(templateWidth + 2)}${box.cross}${box.horizontal.repeat(detectedByWidth + 2)}${box.rightT}`;
    const bottomBorder = `${box.bottomLeft}${box.horizontal.repeat(templateWidth + 2)}${box.bottomT}${box.horizontal.repeat(detectedByWidth + 2)}${box.bottomRight}`;

    const header = `${fmt.dim(box.vertical)} ${fmt.section("Template".padEnd(templateWidth))} ${fmt.dim(box.vertical)} ${fmt.section("Detected By".padEnd(detectedByWidth))} ${fmt.dim(box.vertical)}`;

    lines.push(fmt.dim(topBorder));
    lines.push(header);
    lines.push(fmt.dim(headerSep));

    for (const detection of result.detections) {
      const detectionText = formatDetection(detection.type, detection.reason);
      const detectionLen = getDetectionLength(detection.type, detection.reason);
      const padding = " ".repeat(detectedByWidth - detectionLen);

      const row = `${fmt.dim(box.vertical)} ${fmt.item(detection.template.padEnd(templateWidth))} ${fmt.dim(box.vertical)} ${detectionText}${padding} ${fmt.dim(box.vertical)}`;
      lines.push(row);
    }

    lines.push(fmt.dim(bottomBorder));
  }

  lines.push(``);
  lines.push(`${fmt.section("Apply Permissions:")}`);
  lines.push(`   ${fmt.example(result.suggestedCommand)}`);
  lines.push(``);
  lines.push(`Run ${fmt.command("cc-permissions --help")} for usage information.`);
  lines.push(``);

  if (versionString) {
    lines.push(fmt.dim(`cc-permissions ${versionString}`));
    lines.push(``);
  }

  lines.push(formatSafetyWarning());

  return lines.join("\n");
}

// Export for testing (prefixed with _ to indicate internal use)
export const _testing = {
  detectTemplate,
};
