import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { execSync } from "node:child_process";
import type { AnalysisResult, DetectionRules, TemplateRegistry } from "./types.js";
import { PermissionLevel } from "./types.js";
import { getTemplates } from "./templates/loader.js";

// Cache for active MCP servers (avoid running `claude mcp list` multiple times)
let cachedMcpServers: Set<string> | null = null;

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

/**
 * Detect if a template should be recommended based on its detection rules.
 * Returns the detected file/directory path if found, null otherwise.
 */
function detectTemplate(
  dir: string,
  detection: DetectionRules | undefined
): string | null {
  if (!detection) return null;

  // Check if always recommended
  if (detection.always) {
    return "always";
  }

  // Check simple file patterns
  if (detection.files) {
    for (const pattern of detection.files) {
      const found = fileExists(dir, pattern);
      if (found) return found;
    }
  }

  // Check directory patterns
  if (detection.directories) {
    for (const pattern of detection.directories) {
      const found = directoryExists(dir, pattern);
      if (found) return found;
    }
  }

  // Check content patterns
  if (detection.contentPatterns) {
    for (const { file, contains } of detection.contentPatterns) {
      if (fileContains(dir, file, contains)) {
        return join(dir, file);
      }
    }
  }

  // Check MCP servers
  if (detection.mcpServers) {
    const found = hasMcpServer(detection.mcpServers);
    if (found) return found;
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

  // Load templates to get detection rules
  let templates: TemplateRegistry;
  try {
    templates = getTemplates();
  } catch {
    // If templates can't be loaded, return minimal result with shell
    return {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions apply --level restrictive",
    };
  }

  // Check each template's detection rules
  for (const [name, template] of Object.entries(templates)) {
    const detected = detectTemplate(absoluteDir, template.detection);
    if (detected) {
      recommendedTemplates.add(name);
      // Track detected files/directories (but not "always" marker)
      if (detected !== "always") {
        const relativePath = relative(absoluteDir, detected) || detected;
        if (!detectedFiles.includes(relativePath)) {
          detectedFiles.push(relativePath);
        }
      }
    }
  }

  // Ensure shell is always included (even if template loading worked but shell wasn't auto-detected)
  recommendedTemplates.add("shell");

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
    suggestedLevel,
    suggestedCommand,
  };
}

/**
 * Format analysis result for display.
 */
export function formatAnalysisResult(result: AnalysisResult): string {
  const lines: string[] = [
    `Project Analysis`,
    `================`,
    ``,
  ];

  if (result.detectedFiles.length === 0) {
    lines.push(`No specific project files detected.`);
    lines.push(`Recommending shell template only.`);
  } else {
    lines.push(`Detected Files:`);
    for (const file of result.detectedFiles) {
      lines.push(`  - ${file}`);
    }
  }

  lines.push(``);
  lines.push(`Recommended Templates:`);
  for (const template of result.recommendedTemplates) {
    lines.push(`  - ${template}`);
  }

  lines.push(``);
  lines.push(`Suggested Level: ${result.suggestedLevel}`);
  lines.push(``);
  lines.push(`Suggested Command:`);
  lines.push(`  ${result.suggestedCommand}`);

  return lines.join("\n");
}
