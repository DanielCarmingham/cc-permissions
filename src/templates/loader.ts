import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import stripJsonComments from "strip-json-comments";
import type { TemplateDefinition, TemplateRegistry, Permission, DetectionRules, ContentPattern, PermissionType } from "../types.js";

// Get the bundled templates directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "..", "templates");

// Module-level state
let _templates: TemplateRegistry | null = null;

/**
 * Validate a permission object.
 */
function validatePermission(
  perm: unknown,
  templateName: string,
  level: string,
  index: number
): Permission {
  if (typeof perm !== "object" || perm === null) {
    throw new Error(
      `Template "${templateName}": levels.${level}[${index}] must be an object`
    );
  }

  const p = perm as Record<string, unknown>;

  if (typeof p.command !== "string" || p.command.trim() === "") {
    throw new Error(
      `Template "${templateName}": levels.${level}[${index}].command must be a non-empty string`
    );
  }

  if (p.description !== undefined && typeof p.description !== "string") {
    throw new Error(
      `Template "${templateName}": levels.${level}[${index}].description must be a string`
    );
  }

  if (p.type !== undefined && p.type !== "bash" && p.type !== "mcp") {
    throw new Error(
      `Template "${templateName}": levels.${level}[${index}].type must be "bash" or "mcp"`
    );
  }

  const result: Permission = {
    command: p.command,
    description: p.description as string | undefined,
  };

  if (p.type) {
    result.type = p.type as PermissionType;
  }

  return result;
}

/**
 * Validate a content pattern object.
 */
function validateContentPattern(
  pattern: unknown,
  templateName: string,
  index: number
): ContentPattern {
  if (typeof pattern !== "object" || pattern === null) {
    throw new Error(
      `Template "${templateName}": detection.contentPatterns[${index}] must be an object`
    );
  }

  const p = pattern as Record<string, unknown>;

  if (typeof p.file !== "string" || p.file.trim() === "") {
    throw new Error(
      `Template "${templateName}": detection.contentPatterns[${index}].file must be a non-empty string`
    );
  }

  if (typeof p.contains !== "string" || p.contains.trim() === "") {
    throw new Error(
      `Template "${templateName}": detection.contentPatterns[${index}].contains must be a non-empty string`
    );
  }

  return {
    file: p.file,
    contains: p.contains,
  };
}

/**
 * Validate detection rules object.
 */
function validateDetection(
  detection: unknown,
  templateName: string
): DetectionRules | undefined {
  if (detection === undefined) {
    return undefined;
  }

  if (typeof detection !== "object" || detection === null) {
    throw new Error(
      `Template "${templateName}": detection must be an object`
    );
  }

  const d = detection as Record<string, unknown>;
  const result: DetectionRules = {};

  if (d.files !== undefined) {
    if (!Array.isArray(d.files)) {
      throw new Error(
        `Template "${templateName}": detection.files must be an array`
      );
    }
    for (let i = 0; i < d.files.length; i++) {
      if (typeof d.files[i] !== "string") {
        throw new Error(
          `Template "${templateName}": detection.files[${i}] must be a string`
        );
      }
    }
    result.files = d.files as string[];
  }

  if (d.directories !== undefined) {
    if (!Array.isArray(d.directories)) {
      throw new Error(
        `Template "${templateName}": detection.directories must be an array`
      );
    }
    for (let i = 0; i < d.directories.length; i++) {
      if (typeof d.directories[i] !== "string") {
        throw new Error(
          `Template "${templateName}": detection.directories[${i}] must be a string`
        );
      }
    }
    result.directories = d.directories as string[];
  }

  if (d.contentPatterns !== undefined) {
    if (!Array.isArray(d.contentPatterns)) {
      throw new Error(
        `Template "${templateName}": detection.contentPatterns must be an array`
      );
    }
    result.contentPatterns = d.contentPatterns.map((p, i) =>
      validateContentPattern(p, templateName, i)
    );
  }

  if (d.mcpServers !== undefined) {
    if (!Array.isArray(d.mcpServers)) {
      throw new Error(
        `Template "${templateName}": detection.mcpServers must be an array`
      );
    }
    for (let i = 0; i < d.mcpServers.length; i++) {
      if (typeof d.mcpServers[i] !== "string") {
        throw new Error(
          `Template "${templateName}": detection.mcpServers[${i}] must be a string`
        );
      }
    }
    result.mcpServers = d.mcpServers as string[];
  }

  if (d.commands !== undefined) {
    if (!Array.isArray(d.commands)) {
      throw new Error(
        `Template "${templateName}": detection.commands must be an array`
      );
    }
    for (let i = 0; i < d.commands.length; i++) {
      if (typeof d.commands[i] !== "string") {
        throw new Error(
          `Template "${templateName}": detection.commands[${i}] must be a string`
        );
      }
    }
    result.commands = d.commands as string[];
  }

  if (d.gitRemotes !== undefined) {
    if (!Array.isArray(d.gitRemotes)) {
      throw new Error(
        `Template "${templateName}": detection.gitRemotes must be an array`
      );
    }
    for (let i = 0; i < d.gitRemotes.length; i++) {
      if (typeof d.gitRemotes[i] !== "string") {
        throw new Error(
          `Template "${templateName}": detection.gitRemotes[${i}] must be a string`
        );
      }
    }
    result.gitRemotes = d.gitRemotes as string[];
  }

  if (d.always !== undefined) {
    if (typeof d.always !== "boolean") {
      throw new Error(
        `Template "${templateName}": detection.always must be a boolean`
      );
    }
    result.always = d.always;
  }

  if (d.requireAll !== undefined) {
    if (typeof d.requireAll !== "boolean") {
      throw new Error(
        `Template "${templateName}": detection.requireAll must be a boolean`
      );
    }
    result.requireAll = d.requireAll;
  }

  return result;
}

/**
 * Validate a template definition loaded from JSONC.
 */
function validateTemplate(data: unknown, filename: string): TemplateDefinition {
  if (typeof data !== "object" || data === null) {
    throw new Error(`Template "${filename}": must be an object`);
  }

  const obj = data as Record<string, unknown>;

  // Validate name
  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    throw new Error(`Template "${filename}": name must be a non-empty string`);
  }

  if (!/^[a-z][a-z0-9-]*$/.test(obj.name)) {
    throw new Error(
      `Template "${filename}": name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens`
    );
  }

  // Validate description
  if (typeof obj.description !== "string" || obj.description.trim() === "") {
    throw new Error(
      `Template "${filename}": description must be a non-empty string`
    );
  }

  // Validate levels
  if (typeof obj.levels !== "object" || obj.levels === null) {
    throw new Error(`Template "${filename}": levels must be an object`);
  }

  const levels = obj.levels as Record<string, unknown>;
  const requiredLevels = ["restrictive", "standard", "permissive"] as const;

  for (const level of requiredLevels) {
    if (!Array.isArray(levels[level])) {
      throw new Error(
        `Template "${filename}": levels.${level} must be an array`
      );
    }
  }

  const name = obj.name as string;
  const description = obj.description as string;
  const detection = validateDetection(obj.detection, name);

  // Validate category (optional)
  if (obj.category !== undefined && typeof obj.category !== "string") {
    throw new Error(
      `Template "${filename}": category must be a string`
    );
  }

  const template: TemplateDefinition = {
    name,
    description,
    levels: {
      restrictive: (levels.restrictive as unknown[]).map((p, i) =>
        validatePermission(p, name, "restrictive", i)
      ),
      standard: (levels.standard as unknown[]).map((p, i) =>
        validatePermission(p, name, "standard", i)
      ),
      permissive: (levels.permissive as unknown[]).map((p, i) =>
        validatePermission(p, name, "permissive", i)
      ),
    },
  };

  if (obj.category) {
    template.category = obj.category as string;
  }

  if (detection) {
    template.detection = detection;
  }

  return template;
}

/**
 * Load a single template from a JSONC file.
 */
function loadTemplateFile(filepath: string): TemplateDefinition {
  const filename = basename(filepath);

  try {
    const content = readFileSync(filepath, "utf-8");
    const stripped = stripJsonComments(content);
    const data = JSON.parse(stripped);
    return validateTemplate(data, filename);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Template "${filename}": Invalid JSON - ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Load all templates from the bundled templates directory.
 */
function loadTemplates(): TemplateRegistry {
  const registry: TemplateRegistry = {};

  let files: string[];
  try {
    files = readdirSync(TEMPLATES_DIR).filter((f) => f.endsWith(".jsonc"));
  } catch {
    throw new Error(`Failed to read templates directory: ${TEMPLATES_DIR}`);
  }

  if (files.length === 0) {
    throw new Error(`No template files found in ${TEMPLATES_DIR}`);
  }

  for (const file of files) {
    const filepath = join(TEMPLATES_DIR, file);
    const template = loadTemplateFile(filepath);

    if (registry[template.name]) {
      throw new Error(
        `Duplicate template name "${template.name}" found in ${file}`
      );
    }

    registry[template.name] = template;
  }

  return registry;
}

/**
 * Get the loaded templates registry.
 * Loads templates on first access (lazy initialization).
 */
export function getTemplates(): TemplateRegistry {
  if (!_templates) {
    _templates = loadTemplates();
  }
  return _templates;
}

/**
 * Check if templates have been loaded.
 */
export function isInitialized(): boolean {
  return _templates !== null;
}

/**
 * Reset the loader state (useful for testing).
 */
export function resetLoader(): void {
  _templates = null;
}

/**
 * Get the templates directory path.
 */
export function getTemplatesDir(): string {
  return TEMPLATES_DIR;
}
