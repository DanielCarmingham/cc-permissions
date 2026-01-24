import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { execSync } from "node:child_process";
import type { AnalysisResult, DetectionRules, TemplateRegistry, TemplateDetection, DetectionType } from "./types.js";
import { PermissionLevel } from "./types.js";
import { getTemplates } from "./templates/loader.js";

// Cache for active MCP servers (avoid running `claude mcp list` multiple times)
let cachedMcpServers: Set<string> | null = null;

// Cache for available CLI commands (avoid running `which` multiple times)
const cachedCommands: Map<string, boolean> = new Map();

// Cache for git remote URLs (per directory)
const cachedGitRemotes: Map<string, string[]> = new Map();

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

/**
 * Get git remote URLs for a directory.
 * Only returns remotes if the directory is itself a git repo root.
 * Returns an array of remote URLs.
 */
function getGitRemotes(dir: string): string[] {
  if (cachedGitRemotes.has(dir)) {
    return cachedGitRemotes.get(dir)!;
  }

  const remotes: string[] = [];

  // Only check git remotes if this directory is a git repo root
  // This prevents detecting parent repo's remotes for subdirectories
  if (!isGitRepoRoot(dir)) {
    cachedGitRemotes.set(dir, remotes);
    return remotes;
  }

  try {
    const output = execSync("git remote -v", {
      cwd: dir,
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

  cachedGitRemotes.set(dir, remotes);
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
 * Detect if a template should be recommended based on its detection rules.
 * Returns the detection type and reason if found, null otherwise.
 */
function detectTemplate(
  dir: string,
  detection: DetectionRules | undefined
): DetectionResult | null {
  if (!detection) return null;

  // Check if always recommended
  if (detection.always) {
    return { type: "always", reason: "always included" };
  }

  // Check simple file patterns
  if (detection.files) {
    for (const pattern of detection.files) {
      const found = fileExists(dir, pattern);
      if (found) {
        return { type: "file", reason: found };
      }
    }
  }

  // Check directory patterns
  if (detection.directories) {
    for (const pattern of detection.directories) {
      const found = directoryExists(dir, pattern);
      if (found) {
        return { type: "directory", reason: found };
      }
    }
  }

  // Check content patterns
  if (detection.contentPatterns) {
    for (const { file, contains } of detection.contentPatterns) {
      if (fileContains(dir, file, contains)) {
        return { type: "content", reason: `${file} contains "${contains}"` };
      }
    }
  }

  // Check MCP servers
  if (detection.mcpServers) {
    const found = hasMcpServer(detection.mcpServers);
    if (found) {
      // Extract server name from "MCP:servername"
      const serverName = found.replace("MCP:", "");
      return { type: "mcp", reason: serverName };
    }
  }

  // Check CLI commands
  if (detection.commands) {
    const found = hasCommand(detection.commands);
    if (found) {
      // Extract command name from "CLI:command"
      const cmdName = found.replace("CLI:", "");
      return { type: "file", reason: `${cmdName} installed` };
    }
  }

  // Check git remotes
  if (detection.gitRemotes) {
    const found = hasGitRemote(dir, detection.gitRemotes);
    if (found) {
      // Extract pattern from "remote:pattern"
      const pattern = found.replace("remote:", "");
      return { type: "remote", reason: pattern };
    }
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
      if (detected.type === "file" || detected.type === "directory") {
        const relativePath = relative(absoluteDir, detected.reason) || detected.reason;
        if (!detectedFiles.includes(relativePath)) {
          detectedFiles.push(relativePath);
        }
        reason = relativePath;
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

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

// Check if colors should be used (not piped, supports colors)
function useColors(): boolean {
  return process.stdout.isTTY ?? false;
}

// Apply color if terminal supports it
function color(text: string, ...codes: string[]): string {
  if (!useColors()) return text;
  return codes.join("") + text + colors.reset;
}

// Format detection for display with colored type prefix and emoji
function formatDetection(type: string, reason: string): string {
  const typeInfo: Record<string, { prefix: string; emoji: string; color: string }> = {
    file: { prefix: "file:", emoji: "📄", color: colors.green },
    directory: { prefix: "dir:", emoji: "📁", color: colors.green },
    content: { prefix: "content:", emoji: "📝", color: colors.yellow },
    mcp: { prefix: "mcp:", emoji: "🔌", color: colors.magenta },
    remote: { prefix: "remote:", emoji: "🌐", color: colors.blue },
    always: { prefix: "", emoji: "✓", color: colors.gray },
  };

  const info = typeInfo[type] || { prefix: `${type}:`, emoji: "•", color: colors.reset };

  if (type === "always") {
    return `${info.emoji} ` + color(reason, info.color);
  }

  return `${info.emoji} ` + color(info.prefix, info.color) + " " + reason;
}

// Get plain text length of detection (without color codes)
// Emoji is treated as 2 chars wide for terminal alignment
function getDetectionLength(type: string, reason: string): number {
  const prefixes: Record<string, string> = {
    file: "file:", directory: "dir:", content: "content:",
    mcp: "mcp:", remote: "remote:", always: "",
  };
  const prefix = prefixes[type] || `${type}:`;
  const emojiWidth = 2; // emoji + space
  if (type === "always") return emojiWidth + reason.length;
  return emojiWidth + prefix.length + 1 + reason.length; // emoji + prefix + space + reason
}

/**
 * Format analysis result for display.
 */
export function formatAnalysisResult(result: AnalysisResult): string {
  const lines: string[] = [
    ``,
    color(`🔍 Project Analysis`, colors.bold, colors.cyan),
    color(`═══════════════════`, colors.cyan),
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

    const header = `${color(box.vertical, colors.dim)} ${color("Template".padEnd(templateWidth), colors.bold)} ${color(box.vertical, colors.dim)} ${color("Detected By".padEnd(detectedByWidth), colors.bold)} ${color(box.vertical, colors.dim)}`;

    lines.push(color(topBorder, colors.dim));
    lines.push(header);
    lines.push(color(headerSep, colors.dim));

    for (const detection of result.detections) {
      const detectionText = formatDetection(detection.type, detection.reason);
      const detectionLen = getDetectionLength(detection.type, detection.reason);
      const padding = " ".repeat(detectedByWidth - detectionLen);

      const row = `${color(box.vertical, colors.dim)} ${detection.template.padEnd(templateWidth)} ${color(box.vertical, colors.dim)} ${detectionText}${padding} ${color(box.vertical, colors.dim)}`;
      lines.push(row);
    }

    lines.push(color(bottomBorder, colors.dim));
  }

  lines.push(``);
  lines.push(`🎚️  ${color("Suggested Level:", colors.bold)} ${result.suggestedLevel}`);
  lines.push(``);
  lines.push(`💻 ${color("Apply Permissions:", colors.bold)}`);
  lines.push(`   ${color(result.suggestedCommand, colors.green)}`);
  lines.push(``);

  // Show template details command with an example template
  const exampleTemplate = result.recommendedTemplates.find(t => t !== "shell") || result.recommendedTemplates[0];
  if (exampleTemplate) {
    lines.push(`📋 ${color("View Template Details:", colors.bold)}`);
    lines.push(`   ${color(`cc-permissions template ${exampleTemplate}`, colors.cyan)}`);
    lines.push(``);
  }

  lines.push(color(`─────────────────────────────────────────────────────────────────────────`, colors.dim));
  lines.push(`⚠️  ${color("Warning:", colors.bold, colors.yellow)} This approach is inherently less safe than a fully`);
  lines.push(`   isolated environment. You're trading sandbox protection for convenience.`);

  return lines.join("\n");
}
