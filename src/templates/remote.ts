import {
  cacheTemplate,
  saveCacheMeta,
  getCacheMeta,
  ensureCacheDir,
  type CacheMeta,
} from "./cache.js";

// Raw GitHub URL for templates (updates immediately, no CDN cache delays)
const CDN_BASE_URL =
  "https://raw.githubusercontent.com/DanielCarmingham/cc-permissions-templates/main";

const MANIFEST_URL = `${CDN_BASE_URL}/index.json`;
const TEMPLATES_BASE_URL = `${CDN_BASE_URL}/templates`;

// Timeout for fetch requests (10 seconds)
const FETCH_TIMEOUT_MS = 10000;

// Supported manifest major version
const SUPPORTED_MAJOR_VERSION = 1;

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
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse the major version from a semver string.
 */
function parseMajorVersion(version: string): number {
  const match = version.match(/^(\d+)\./);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return parseInt(match[1], 10);
}

/**
 * Fetch the template manifest from the remote CDN.
 */
export async function fetchManifest(): Promise<TemplateManifest> {
  const response = await fetchWithTimeout(MANIFEST_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.version) {
    throw new Error("Invalid manifest format: missing version");
  }

  const majorVersion = parseMajorVersion(data.version);
  if (majorVersion !== SUPPORTED_MAJOR_VERSION) {
    throw new Error(
      `Manifest version ${data.version} is not compatible with this version of cc-permissions. ` +
        `Please upgrade cc-permissions: npm install -g cc-permissions@latest`
    );
  }

  if (!Array.isArray(data.categories)) {
    throw new Error("Invalid manifest format: missing categories");
  }

  for (const category of data.categories) {
    if (!category.name || !Array.isArray(category.templates)) {
      throw new Error("Invalid manifest format: category missing name or templates");
    }
  }

  return data as TemplateManifest;
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
