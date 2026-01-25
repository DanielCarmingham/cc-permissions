import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import type {
  Permission,
  ClaudeCodePermissions,
  TemplateDefinition,
} from "./types.js";
import { PermissionLevel } from "./types.js";
import {
  BANNED_PATTERNS,
  combineTemplatePermissions,
  generateClaudeCodePermissions,
} from "./permissions.js";
import { fmt } from "./format.js";

/**
 * Format for Claude Code settings.json permissions section
 */
export interface ClaudeCodeSettings {
  permissions: {
    allow: string[];
    deny: string[];
  };
}

/**
 * Generate Claude Code settings format from templates and level.
 */
export function generateSettings(
  templates: TemplateDefinition[],
  level: PermissionLevel
): ClaudeCodeSettings {
  const permissions = combineTemplatePermissions(templates, level);
  const ccPermissions = generateClaudeCodePermissions(permissions);

  return {
    permissions: ccPermissions,
  };
}

/**
 * Format settings as JSON string for output.
 */
export function formatSettingsJson(settings: ClaudeCodeSettings): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * Format permissions as a human-readable summary.
 */
export function formatPermissionsSummary(
  templates: TemplateDefinition[],
  level: PermissionLevel
): string {
  const permissions = combineTemplatePermissions(templates, level);
  const templateNames = templates.map((t) => t.name).join(", ");

  const lines: string[] = [
    fmt.title(`Permission Summary`, "═"),
    `${fmt.dim("Templates:")} ${fmt.item(templateNames)}`,
    `${fmt.dim("Level:")} ${fmt.value(level)}`,
    ``,
    fmt.section(`Allowed Commands (${permissions.length}):`),
  ];

  // Group permissions by template for better readability
  for (const perm of permissions) {
    const desc = perm.description ? ` ${fmt.dim("-")} ${fmt.dim(perm.description)}` : "";
    lines.push(`  ${fmt.command(perm.command)}${desc}`);
  }

  lines.push(``);
  lines.push(fmt.section(`Denied Patterns (${BANNED_PATTERNS.length}):`));
  for (const banned of BANNED_PATTERNS) {
    const desc = banned.description ? ` ${fmt.dim("-")} ${fmt.dim(banned.description)}` : "";
    lines.push(`  ${fmt.error(banned.command)}${desc}`);
  }

  return lines.join("\n");
}

/**
 * Generate the command to use these permissions.
 */
export function formatCommand(
  templateNames: string[],
  level: PermissionLevel
): string {
  const templates = templateNames.join(",");
  return `cc-permissions template ${templates} --level ${level}`;
}

/**
 * Full output with both JSON and summary.
 */
export function formatFullOutput(
  templates: TemplateDefinition[],
  level: PermissionLevel,
  outputFormat: "json" | "summary" | "both" = "json"
): string {
  if (outputFormat === "json") {
    const settings = generateSettings(templates, level);
    return formatSettingsJson(settings);
  }

  if (outputFormat === "summary") {
    return formatPermissionsSummary(templates, level);
  }

  // Both
  const settings = generateSettings(templates, level);
  const summary = formatPermissionsSummary(templates, level);
  const json = formatSettingsJson(settings);

  return `${summary}\n\n---\n\nJSON Output:\n${json}`;
}

/**
 * Scope for where to apply permissions.
 */
export type ApplyScope = "project" | "user" | "global" | "local";

/**
 * Resolve scope to a settings file path.
 *
 * @param scope - The scope (project, user/global, local)
 * @param baseDir - Base directory for project/local scope (defaults to cwd)
 * @returns Absolute path to the settings file
 */
export function resolveSettingsPath(scope: ApplyScope, baseDir: string = process.cwd()): string {
  switch (scope) {
    case "user":
    case "global":
      return join(homedir(), ".claude", "settings.json");
    case "local":
      return join(baseDir, ".claude", "settings.local.json");
    case "project":
    default:
      return join(baseDir, ".claude", "settings.json");
  }
}

/**
 * Parse and validate scope string.
 * Supports prefix matching (e.g., "u" for "user", "l" for "local").
 */
export function parseScope(value: string): ApplyScope | null {
  const normalized = value.toLowerCase().trim();
  const scopes: ApplyScope[] = ["project", "user", "global", "local"];

  const matches = scopes.filter((s) => s.startsWith(normalized));

  if (matches.length === 1) {
    return matches[0];
  }

  // Special case: "g" is unambiguous (only "global" starts with g)
  // but "u" matches "user" only, "l" matches "local" only, "p" matches "project" only
  return null;
}

/**
 * Result of applying permissions to settings file.
 */
export interface ApplyResult {
  settingsPath: string;
  backupPath: string | null;
  created: boolean;
  merged: boolean;
}

/**
 * Options for applying permissions.
 */
export interface ApplyOptions {
  /** Base directory for relative scope paths (defaults to cwd) */
  baseDir?: string;
  /** Scope: project, user/global, local */
  scope?: ApplyScope;
  /** Custom output path (overrides scope) */
  outputPath?: string;
}

/**
 * Apply permissions to a settings file, merging with existing settings.
 * Creates a .bak backup if the file already exists.
 *
 * @param templates - Templates to apply
 * @param level - Permission level
 * @param options - Apply options (baseDir, scope, outputPath)
 * @returns Result with paths and status
 */
export function applyPermissions(
  templates: TemplateDefinition[],
  level: PermissionLevel,
  options: ApplyOptions = {}
): ApplyResult {
  const { baseDir = process.cwd(), scope = "project", outputPath } = options;

  // Determine settings path: custom path overrides scope
  const settingsPath = outputPath || resolveSettingsPath(scope, baseDir);
  const settingsDir = dirname(settingsPath);
  const backupPath = settingsPath + ".bak";

  // Generate new permissions
  const newSettings = generateSettings(templates, level);

  let existingSettings: Record<string, unknown> = {};
  let created = true;
  let merged = false;
  let backupCreated: string | null = null;

  // Ensure parent directory exists
  if (!existsSync(settingsDir)) {
    mkdirSync(settingsDir, { recursive: true });
  }

  // Read existing settings if they exist
  if (existsSync(settingsPath)) {
    created = false;

    // Create backup
    const existingContent = readFileSync(settingsPath, "utf-8");
    writeFileSync(backupPath, existingContent, "utf-8");
    backupCreated = backupPath;

    // Parse existing settings
    try {
      existingSettings = JSON.parse(existingContent);
      merged = true;
    } catch {
      // If existing file is invalid JSON, we'll overwrite it
      existingSettings = {};
    }
  }

  // Merge: new permissions replace existing, but preserve other settings
  const mergedSettings = {
    ...existingSettings,
    permissions: newSettings.permissions,
  };

  // Write merged settings
  writeFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2) + "\n", "utf-8");

  return {
    settingsPath,
    backupPath: backupCreated,
    created,
    merged,
  };
}

/**
 * Format the apply result for display.
 */
export function formatApplyResult(result: ApplyResult): string {
  const lines: string[] = [];

  if (result.created) {
    lines.push(`${fmt.success("Created:")} ${fmt.path(result.settingsPath)}`);
  } else if (result.merged) {
    lines.push(`${fmt.success("Updated:")} ${fmt.path(result.settingsPath)}`);
    if (result.backupPath) {
      lines.push(`${fmt.dim("Backup:")}  ${fmt.path(result.backupPath)}`);
    }
  }

  return lines.join("\n");
}
