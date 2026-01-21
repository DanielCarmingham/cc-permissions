import type { TemplateDefinition, TemplateRegistry } from "../types.js";
import {
  getTemplates as getLoadedTemplates,
  isInitialized,
  resetLoader,
  getTemplatesDir,
} from "./loader.js";

// Re-export from loader
export { isInitialized, resetLoader, getTemplatesDir };

/**
 * Get all loaded templates.
 */
export function templates(): TemplateRegistry {
  return getLoadedTemplates();
}

/**
 * Get a template by name.
 */
export function getTemplate(name: string): TemplateDefinition | undefined {
  const registry = getLoadedTemplates();
  return registry[name.toLowerCase()];
}

/**
 * Get multiple templates by name.
 * Returns templates that were found and an array of names that weren't found.
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
 */
export function listTemplateNames(): string[] {
  const registry = getLoadedTemplates();
  return Object.keys(registry);
}

/**
 * List all templates with descriptions and categories.
 */
export function listTemplates(): Array<{ name: string; description: string; category?: string }> {
  const registry = getLoadedTemplates();
  return Object.entries(registry).map(([name, template]) => ({
    name,
    description: template.description,
    category: template.category,
  }));
}
