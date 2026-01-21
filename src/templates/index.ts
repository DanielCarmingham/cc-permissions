import { TemplateDefinition, TemplateRegistry } from "../types.js";
import {
  initializeTemplates as initLoader,
  getTemplates as getLoadedTemplates,
  isInitialized,
  resetLoader,
  loadTemplatesSync,
  type LoadOptions,
  type LoadResult,
} from "./loader.js";

// Re-export types and functions from loader
export { type LoadOptions, type LoadResult } from "./loader.js";
export { resetLoader, isInitialized };

// Re-export cache functions
export {
  clearCache,
  getCacheInfo,
  cacheExists,
  isCacheStale,
} from "./cache.js";

// Re-export remote functions
export {
  checkForUpdates,
  fetchAndCacheTemplates,
  getCdnBaseUrl,
} from "./remote.js";

/**
 * Initialize templates from remote/cache/bundled.
 * Must be called before using template functions.
 */
export async function initializeTemplates(
  options: LoadOptions = {}
): Promise<LoadResult> {
  return initLoader(options);
}

/**
 * Get all loaded templates.
 * Throws if templates haven't been initialized.
 */
export function templates(): TemplateRegistry {
  return getLoadedTemplates();
}

/**
 * Get a template by name.
 * Throws if templates haven't been initialized.
 */
export function getTemplate(name: string): TemplateDefinition | undefined {
  const registry = getLoadedTemplates();
  return registry[name.toLowerCase()];
}

/**
 * Get multiple templates by name.
 * Returns templates that were found and an array of names that weren't found.
 * Throws if templates haven't been initialized.
 */
export function getTemplates(names: string[]): {
  found: TemplateDefinition[];
  notFound: string[];
} {
  const registry = getLoadedTemplates();
  const found: TemplateDefinition[] = [];
  const notFound: string[] = [];

  for (const name of names) {
    const template = registry[name.toLowerCase()];
    if (template) {
      found.push(template);
    } else {
      notFound.push(name);
    }
  }

  return { found, notFound };
}

/**
 * List all available template names.
 * Throws if templates haven't been initialized.
 */
export function listTemplateNames(): string[] {
  const registry = getLoadedTemplates();
  return Object.keys(registry);
}

/**
 * List all templates with descriptions.
 * Throws if templates haven't been initialized.
 */
export function listTemplates(): Array<{ name: string; description: string }> {
  const registry = getLoadedTemplates();
  return Object.entries(registry).map(([name, template]) => ({
    name,
    description: template.description,
  }));
}

/**
 * Synchronously get templates (uses cache or bundled).
 * For backward compatibility where async init isn't possible.
 */
export function getTemplatesSync(): TemplateRegistry {
  if (isInitialized()) {
    return getLoadedTemplates();
  }
  return loadTemplatesSync();
}
