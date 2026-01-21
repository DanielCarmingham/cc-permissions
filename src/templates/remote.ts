import {
  cacheTemplate,
  saveCacheMeta,
  getCacheMeta,
  ensureCacheDir,
  type CacheMeta,
} from "./cache.js";

// jsDelivr CDN pointing to GitHub repo (free, fast, no rate limits)
// URL pattern: https://cdn.jsdelivr.net/gh/user/repo@branch/path
const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/gh/DanielCarmingham/cc-permissions-templates@main";

const MANIFEST_URL = `${CDN_BASE_URL}/index.json`;
const TEMPLATES_BASE_URL = `${CDN_BASE_URL}/templates`;

// Timeout for fetch requests (10 seconds)
const FETCH_TIMEOUT_MS = 10000;

export interface TemplateCategory {
  name: string;
  templates: string[];
}

export interface TemplateManifest {
  version: string;
  categories: TemplateCategory[];
}

/**
 * Extract a flat list of all template names from the categorized manifest.
 */
export function getTemplateNames(manifest: TemplateManifest): string[] {
  return manifest.categories.flatMap((category) => category.templates);
}

export interface FetchResult {
  success: boolean;
  manifest?: TemplateManifest;
  error?: string;
  cached?: boolean;
}

/**
 * Fetch with timeout support.
 */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch the template manifest from the remote CDN.
 */
export async function fetchManifest(): Promise<TemplateManifest> {
  const response = await fetchWithTimeout(MANIFEST_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
  }

  const manifest = (await response.json()) as TemplateManifest;

  // Validate manifest structure
  if (!manifest.version || !Array.isArray(manifest.categories)) {
    throw new Error("Invalid manifest format: missing version or categories");
  }

  // Validate each category has name and templates
  for (const category of manifest.categories) {
    if (!category.name || !Array.isArray(category.templates)) {
      throw new Error("Invalid manifest format: category missing name or templates");
    }
  }

  return manifest;
}

/**
 * Fetch a single template from the remote CDN.
 */
export async function fetchTemplate(name: string): Promise<string> {
  const url = `${TEMPLATES_BASE_URL}/${name}.jsonc`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch template "${name}": ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Fetch all templates from the remote CDN and cache them locally.
 * Returns the fetch result with success/failure status.
 */
export async function fetchAndCacheTemplates(): Promise<FetchResult> {
  try {
    // Fetch manifest first
    const manifest = await fetchManifest();

    // Ensure cache directory exists
    ensureCacheDir();

    // Extract flat template list from categories
    const templateNames = getTemplateNames(manifest);

    // Fetch all templates in parallel
    const templatePromises = templateNames.map(async (name) => {
      const content = await fetchTemplate(name);
      cacheTemplate(name, content);
      return name;
    });

    await Promise.all(templatePromises);

    // Save cache metadata
    const meta: CacheMeta = {
      lastUpdated: new Date().toISOString(),
      version: manifest.version,
      templates: templateNames,
      categories: manifest.categories,
    };
    saveCacheMeta(meta);

    return {
      success: true,
      manifest,
      cached: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if updates are available by comparing manifest versions.
 */
export async function checkForUpdates(): Promise<{
  hasUpdates: boolean;
  currentVersion: string | null;
  latestVersion: string | null;
  error?: string;
}> {
  const currentMeta = getCacheMeta();
  const currentVersion = currentMeta?.version ?? null;

  try {
    const manifest = await fetchManifest();
    const latestVersion = manifest.version;

    return {
      hasUpdates: currentVersion !== latestVersion,
      currentVersion,
      latestVersion,
    };
  } catch (error) {
    return {
      hasUpdates: false,
      currentVersion,
      latestVersion: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the CDN base URL (for informational purposes).
 */
export function getCdnBaseUrl(): string {
  return CDN_BASE_URL;
}
