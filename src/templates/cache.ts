import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// Cache location: ~/.cc-permissions/templates/
const CACHE_BASE_DIR = join(homedir(), ".cc-permissions");
const CACHE_TEMPLATES_DIR = join(CACHE_BASE_DIR, "templates");
const CACHE_META_FILE = join(CACHE_BASE_DIR, "cache-meta.json");

export interface TemplateCategory {
  name: string;
  templates: string[];
}

export interface CacheMeta {
  lastUpdated: string; // ISO timestamp
  version: string; // Manifest version
  etag?: string; // ETag for conditional requests
  templates: string[]; // Flat list of cached template names
  categories?: TemplateCategory[]; // Categorized template list (optional for backwards compat)
}

/**
 * Ensure the cache directory exists.
 */
export function ensureCacheDir(): void {
  if (!existsSync(CACHE_BASE_DIR)) {
    mkdirSync(CACHE_BASE_DIR, { recursive: true });
  }
  if (!existsSync(CACHE_TEMPLATES_DIR)) {
    mkdirSync(CACHE_TEMPLATES_DIR, { recursive: true });
  }
}

/**
 * Check if the cache exists and has templates.
 */
export function cacheExists(): boolean {
  if (!existsSync(CACHE_TEMPLATES_DIR)) {
    return false;
  }
  const files = readdirSync(CACHE_TEMPLATES_DIR).filter((f) => f.endsWith(".jsonc"));
  return files.length > 0;
}

/**
 * Get the cache metadata.
 */
export function getCacheMeta(): CacheMeta | null {
  if (!existsSync(CACHE_META_FILE)) {
    return null;
  }
  try {
    const content = readFileSync(CACHE_META_FILE, "utf-8");
    return JSON.parse(content) as CacheMeta;
  } catch {
    return null;
  }
}

/**
 * Save cache metadata.
 */
export function saveCacheMeta(meta: CacheMeta): void {
  ensureCacheDir();
  writeFileSync(CACHE_META_FILE, JSON.stringify(meta, null, 2));
}

/**
 * Get the path to the cache templates directory.
 */
export function getCacheTemplatesDir(): string {
  return CACHE_TEMPLATES_DIR;
}

/**
 * Save a template to the cache.
 */
export function cacheTemplate(name: string, content: string): void {
  ensureCacheDir();
  const filepath = join(CACHE_TEMPLATES_DIR, `${name}.jsonc`);
  writeFileSync(filepath, content);
}

/**
 * Read a template from the cache.
 */
export function readCachedTemplate(name: string): string | null {
  const filepath = join(CACHE_TEMPLATES_DIR, `${name}.jsonc`);
  if (!existsSync(filepath)) {
    return null;
  }
  return readFileSync(filepath, "utf-8");
}

/**
 * List all cached template files.
 */
export function listCachedTemplateFiles(): string[] {
  if (!existsSync(CACHE_TEMPLATES_DIR)) {
    return [];
  }
  return readdirSync(CACHE_TEMPLATES_DIR).filter((f) => f.endsWith(".jsonc"));
}

/**
 * Clear the template cache.
 */
export function clearCache(): { cleared: boolean; message: string } {
  if (!existsSync(CACHE_BASE_DIR)) {
    return { cleared: false, message: "Cache directory does not exist." };
  }

  try {
    rmSync(CACHE_BASE_DIR, { recursive: true, force: true });
    return { cleared: true, message: "Cache cleared successfully." };
  } catch (error) {
    return {
      cleared: false,
      message: `Failed to clear cache: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Get cache information for display.
 */
export function getCacheInfo(): {
  exists: boolean;
  path: string;
  templateCount: number;
  lastUpdated: string | null;
  version: string | null;
} {
  const meta = getCacheMeta();
  const files = listCachedTemplateFiles();

  return {
    exists: cacheExists(),
    path: CACHE_BASE_DIR,
    templateCount: files.length,
    lastUpdated: meta?.lastUpdated ?? null,
    version: meta?.version ?? null,
  };
}

/**
 * Check if the cache is stale (older than the given max age in milliseconds).
 * Default max age is 24 hours.
 */
export function isCacheStale(maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
  const meta = getCacheMeta();
  if (!meta?.lastUpdated) {
    return true;
  }

  const lastUpdated = new Date(meta.lastUpdated).getTime();
  const now = Date.now();
  return now - lastUpdated > maxAgeMs;
}

/**
 * Get categories from the cache metadata.
 * Returns null if no categories are available.
 */
export function getCategories(): TemplateCategory[] | null {
  const meta = getCacheMeta();
  return meta?.categories ?? null;
}
