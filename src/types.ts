// Permission levels - defines HOW MUCH access
export enum PermissionLevel {
  Restrictive = "restrictive", // Read-only operations
  Standard = "standard", // Dev workflow (read + write, no installs)
  Permissive = "permissive", // Few guardrails (most commands except banned)
}

// Permission type: bash command or MCP tool
export type PermissionType = "bash" | "mcp";

// A single permission entry for Claude Code
export interface Permission {
  // The command/pattern to allow
  command: string;
  // Optional description for documentation
  description?: string;
  // Permission type: defaults to "bash" for backward compatibility
  type?: PermissionType;
}

// Content pattern for detection (file + content check)
export interface ContentPattern {
  file: string;
  contains: string;
}

// Detection rules for auto-recommending templates
export interface DetectionRules {
  // File patterns that indicate this template (supports globs like *.csproj)
  files?: string[];
  // Directory patterns that indicate this template (e.g., .git/, .github/workflows/)
  directories?: string[];
  // File + content patterns for ambiguous detection
  contentPatterns?: ContentPattern[];
  // MCP server names that indicate this template (checks active MCP servers via `claude mcp list`)
  mcpServers?: string[];
  // CLI commands that must be available on the system (checked via `which` or `command -v`)
  commands?: string[];
  // File patterns to search for in the current and ancestor directories (up to 10 levels)
  ancestorFiles?: string[];
  // Directory patterns to search for in the current and ancestor directories (up to 10 levels)
  ancestorDirectories?: string[];
  // File patterns to search for in all tracked files under the analyzed directory (uses git ls-files, falls back to bounded directory walk)
  repoFiles?: string[];
  // Git remote URL patterns to match (e.g., "github.com", "gitea.", "gitlab.com")
  gitRemotes?: string[];
  // If true, this template is always recommended (e.g., shell baseline)
  always?: boolean;
  // If true, ALL specified criteria must match (AND logic). Default is false (OR logic).
  requireAll?: boolean;
}

// Template definition - defines WHAT commands are relevant at each level
export interface TemplateDefinition {
  name: string;
  description: string;
  // Optional category for grouping templates in list output
  category?: string;
  // Optional detection rules for auto-recommending this template
  detection?: DetectionRules;
  // Commands at each level (stacking - each level inherits from previous)
  levels: {
    restrictive: Permission[];
    standard: Permission[]; // Added on top of restrictive
    permissive: Permission[]; // Added on top of standard
  };
}

// Output format for Claude Code settings
export interface ClaudeCodePermissions {
  allow: string[];
  deny: string[];
}

// Detection type categories
export type DetectionType = "file" | "directory" | "ancestorFile" | "ancestorDirectory" | "repoFile" | "content" | "mcp" | "remote" | "always";

// Detection info for a single template
export interface TemplateDetection {
  template: string;
  type: DetectionType; // What kind of detection triggered this
  reason: string; // The specific value (file path, MCP server name, remote pattern, etc.)
}

// Analysis result from scanning a project
export interface AnalysisResult {
  detectedFiles: string[]; // Kept for backward compatibility
  recommendedTemplates: string[]; // Kept for backward compatibility
  detections: TemplateDetection[]; // New: template -> reason mapping
  suggestedLevel: PermissionLevel;
  suggestedCommand: string;
}

// Template registry entry
export interface TemplateRegistry {
  [name: string]: TemplateDefinition;
}
