// Permission levels - defines HOW MUCH access
export enum PermissionLevel {
  Restrictive = "restrictive", // Read-only operations
  Standard = "standard", // Dev workflow (read + write, no installs)
  Permissive = "permissive", // Few guardrails (most commands except banned)
}

// A single permission entry for Claude Code
export interface Permission {
  // The command/pattern to allow
  command: string;
  // Optional description for documentation
  description?: string;
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
  // If true, this template is always recommended (e.g., shell baseline)
  always?: boolean;
}

// Template definition - defines WHAT commands are relevant at each level
export interface TemplateDefinition {
  name: string;
  description: string;
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

// Analysis result from scanning a project
export interface AnalysisResult {
  detectedFiles: string[];
  recommendedTemplates: string[];
  suggestedLevel: PermissionLevel;
  suggestedCommand: string;
}

// Template registry entry
export interface TemplateRegistry {
  [name: string]: TemplateDefinition;
}
