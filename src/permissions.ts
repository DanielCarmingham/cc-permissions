import type {
  Permission,
  TemplateDefinition,
  ClaudeCodePermissions,
} from "./types.js";
import { PermissionLevel } from "./types.js";

// Always banned patterns - dangerous operations that should never be allowed
// These are stored as raw commands; formatting happens at output time
export const BANNED_PATTERNS: Permission[] = [
  { command: "rm -rf", description: "Recursive force delete" },
  { command: "sudo", description: "Privilege escalation" },
  { command: "chmod 777", description: "World-writable permissions" },
  { command: "curl * | bash", description: "Remote code execution" },
  { command: "curl *|bash", description: "Remote code execution (no spaces)" },
  { command: "wget * | sh", description: "Remote code execution" },
  { command: "wget *|sh", description: "Remote code execution (no spaces)" },
  { command: "curl * | sh", description: "Remote code execution" },
  { command: "curl *|sh", description: "Remote code execution (no spaces)" },
  { command: "wget * | bash", description: "Remote code execution" },
  { command: "wget *|bash", description: "Remote code execution (no spaces)" },
  { command: "dd", description: "Low-level disk operations" },
  { command: "mkfs", description: "Filesystem creation" },
  { command: "format", description: "Disk formatting" },
  { command: "* > /dev/*", description: "Writing to device files" },
];

/**
 * Get all permissions for a template at a given level.
 * Levels stack: standard includes restrictive, permissive includes standard.
 */
export function getPermissionsForLevel(
  template: TemplateDefinition,
  level: PermissionLevel
): Permission[] {
  const permissions: Permission[] = [];

  // Always include restrictive
  permissions.push(...template.levels.restrictive);

  // Include standard if level is standard or permissive
  if (level === PermissionLevel.Standard || level === PermissionLevel.Permissive) {
    permissions.push(...template.levels.standard);
  }

  // Include permissive only if level is permissive
  if (level === PermissionLevel.Permissive) {
    permissions.push(...template.levels.permissive);
  }

  return permissions;
}

/**
 * Combine permissions from multiple templates at a given level.
 * Deduplicates by command string.
 */
export function combineTemplatePermissions(
  templates: TemplateDefinition[],
  level: PermissionLevel
): Permission[] {
  const permissionMap = new Map<string, Permission>();

  for (const template of templates) {
    const perms = getPermissionsForLevel(template, level);
    for (const perm of perms) {
      // If we already have this command, keep the one with a description
      if (!permissionMap.has(perm.command) || perm.description) {
        permissionMap.set(perm.command, perm);
      }
    }
  }

  return Array.from(permissionMap.values());
}

/**
 * Format a command as a Claude Code Bash permission.
 * Claude Code requires format: "Bash(command:*)" for allow/deny patterns.
 */
export function formatBashPermission(command: string): string {
  return `Bash(${command}:*)`;
}

/**
 * Format an MCP tool as a Claude Code MCP permission.
 * Format: "mcp__server__tool" with optional wildcards.
 */
export function formatMcpPermission(tool: string): string {
  return tool;
}

/**
 * Format a permission based on its type.
 */
export function formatPermission(permission: Permission): string {
  if (permission.type === "mcp") {
    return formatMcpPermission(permission.command);
  }
  return formatBashPermission(permission.command);
}

/**
 * Generate Claude Code permissions format from template permissions.
 */
export function generateClaudeCodePermissions(
  permissions: Permission[]
): ClaudeCodePermissions {
  return {
    allow: permissions.map((p) => formatPermission(p)),
    deny: BANNED_PATTERNS.map((p) => formatBashPermission(p.command)),
  };
}

/**
 * Parse a permission level string to enum.
 * Supports prefix matching (e.g., "r" or "res" for "restrictive").
 */
export function parseLevel(levelStr: string): PermissionLevel | null {
  const normalized = levelStr.toLowerCase().trim();
  const levels: Array<[string, PermissionLevel]> = [
    ["restrictive", PermissionLevel.Restrictive],
    ["standard", PermissionLevel.Standard],
    ["permissive", PermissionLevel.Permissive],
  ];

  const matches = levels.filter(([name]) => name.startsWith(normalized));

  if (matches.length === 1) {
    return matches[0][1];
  }

  return null;
}

/**
 * Get a human-readable description of a permission level.
 */
export function describeLevels(): string {
  return `Permission Levels:
  restrictive  Read-only operations (git status, npm list, etc.)
  standard     Dev workflow (+ git commit/push, npm run/build/test)
  permissive   Few guardrails (+ npm install, most commands except banned)`;
}
