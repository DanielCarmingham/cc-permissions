import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import stripJsonComments from "strip-json-comments";
import { TemplateDefinition, TemplateRegistry, Permission } from "../types.js";
import {
  cacheExists,
  getCacheTemplatesDir,
  listCachedTemplateFiles,
  isCacheStale,
} from "./cache.js";
import { fetchAndCacheTemplates } from "./remote.js";

// Get the bundled templates directory (for fallback during migration)
const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLED_TEMPLATES_DIR = join(__dirname, "..", "..", "templates");

// Module-level state
let _templates: TemplateRegistry | null = null;
let _initialized = false;
let _offlineMode = false;

export interface LoadOptions {
  offline?: boolean;
  forceRefresh?: boolean;
  silent?: boolean;
}

export interface LoadResult {
  success: boolean;
  source: "cache" | "remote" | "bundled";
  templateCount: number;
  error?: string;
  warning?: string;
}

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

  return {
    command: p.command,
    description: p.description as string | undefined,
  };
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

  return {
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
 * Load templates from a directory.
 */
function loadTemplatesFromDirectory(dir: string): TemplateRegistry {
  const registry: TemplateRegistry = {};

  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".jsonc"));
  } catch {
    throw new Error(`Failed to read templates directory: ${dir}`);
  }

  if (files.length === 0) {
    throw new Error(`No template files found in ${dir}`);
  }

  for (const file of files) {
    const filepath = join(dir, file);
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
 * Load templates from cache directory.
 */
function loadFromCache(): TemplateRegistry {
  const cacheDir = getCacheTemplatesDir();
  return loadTemplatesFromDirectory(cacheDir);
}

/**
 * Load templates from bundled directory (fallback for migration).
 */
function loadFromBundled(): TemplateRegistry {
  return loadTemplatesFromDirectory(BUNDLED_TEMPLATES_DIR);
}

/**
 * Check if bundled templates exist.
 */
function bundledTemplatesExist(): boolean {
  if (!existsSync(BUNDLED_TEMPLATES_DIR)) {
    return false;
  }
  const files = readdirSync(BUNDLED_TEMPLATES_DIR).filter((f) =>
    f.endsWith(".jsonc")
  );
  return files.length > 0;
}

/**
 * Initialize templates - fetches from remote and caches, or uses cache/bundled.
 * This must be called before using templates.
 */
export async function initializeTemplates(
  options: LoadOptions = {}
): Promise<LoadResult> {
  const { offline = false, forceRefresh = false, silent = false } = options;
  _offlineMode = offline;

  // If offline mode, only use cache or bundled
  if (offline) {
    if (cacheExists()) {
      try {
        _templates = loadFromCache();
        _initialized = true;
        return {
          success: true,
          source: "cache",
          templateCount: Object.keys(_templates).length,
        };
      } catch (error) {
        // Cache corrupted, try bundled
      }
    }

    // Fall back to bundled templates
    if (bundledTemplatesExist()) {
      _templates = loadFromBundled();
      _initialized = true;
      return {
        success: true,
        source: "bundled",
        templateCount: Object.keys(_templates).length,
        warning: "Using bundled templates (offline mode, no cache).",
      };
    }

    return {
      success: false,
      source: "cache",
      templateCount: 0,
      error:
        "No cached templates available. Run 'cc-permissions update' while online to download templates.",
    };
  }

  // Online mode: check if we need to fetch
  const shouldFetch = forceRefresh || !cacheExists() || isCacheStale();

  if (shouldFetch) {
    const fetchResult = await fetchAndCacheTemplates();

    if (fetchResult.success) {
      _templates = loadFromCache();
      _initialized = true;
      return {
        success: true,
        source: "remote",
        templateCount: Object.keys(_templates).length,
      };
    }

    // Fetch failed, try to use existing cache or bundled
    if (!silent) {
      console.warn(`Warning: Failed to fetch templates: ${fetchResult.error}`);
    }
  }

  // Try cache first
  if (cacheExists()) {
    try {
      _templates = loadFromCache();
      _initialized = true;
      return {
        success: true,
        source: "cache",
        templateCount: Object.keys(_templates).length,
        warning: shouldFetch ? "Using cached templates (fetch failed)." : undefined,
      };
    } catch {
      // Cache corrupted, continue to bundled
    }
  }

  // Fall back to bundled templates
  if (bundledTemplatesExist()) {
    _templates = loadFromBundled();
    _initialized = true;
    return {
      success: true,
      source: "bundled",
      templateCount: Object.keys(_templates).length,
      warning: "Using bundled templates. Run 'cc-permissions update' to get latest.",
    };
  }

  return {
    success: false,
    source: "cache",
    templateCount: 0,
    error:
      "No templates available. Please run 'cc-permissions update' to download templates.",
  };
}

/**
 * Get the loaded templates registry.
 * Throws if templates haven't been initialized.
 */
export function getTemplates(): TemplateRegistry {
  if (!_initialized || !_templates) {
    throw new Error(
      "Templates not initialized. Call initializeTemplates() first."
    );
  }
  return _templates;
}

/**
 * Check if templates have been initialized.
 */
export function isInitialized(): boolean {
  return _initialized;
}

/**
 * Reset the loader state (useful for testing).
 */
export function resetLoader(): void {
  _templates = null;
  _initialized = false;
  _offlineMode = false;
}

/**
 * Synchronously load templates from cache or bundled (for backward compatibility).
 * Prefers cache, falls back to bundled.
 */
export function loadTemplatesSync(): TemplateRegistry {
  if (cacheExists()) {
    try {
      return loadFromCache();
    } catch {
      // Fall through to bundled
    }
  }

  if (bundledTemplatesExist()) {
    return loadFromBundled();
  }

  throw new Error(
    "No templates available. Please run 'cc-permissions update' to download templates."
  );
}
