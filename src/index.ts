// cc-permission-generator
// Main module exports

export const VERSION = "0.1.0";

// Types
export * from "./types.js";

// Core permission logic
export {
  BANNED_PATTERNS,
  getPermissionsForLevel,
  combineTemplatePermissions,
  generateClaudeCodePermissions,
  parseLevel,
  describeLevels,
} from "./permissions.js";

// Templates
export {
  templates,
  getTemplate,
  getTemplates,
  listTemplateNames,
  listTemplates,
  getTemplatesSync,
  // Async initialization
  initializeTemplates,
  isInitialized,
  resetLoader,
  // Cache management
  clearCache,
  getCacheInfo,
  cacheExists,
  isCacheStale,
  // Remote fetch
  checkForUpdates,
  fetchAndCacheTemplates,
  getCdnBaseUrl,
  // Types
  type LoadOptions,
  type LoadResult,
} from "./templates/index.js";

// Output generation
export {
  generateSettings,
  formatSettingsJson,
  formatPermissionsSummary,
  formatCommand,
  formatFullOutput,
  applyPermissions,
  formatApplyResult,
} from "./output.js";

// Analysis
export {
  analyzeDirectory,
  formatAnalysisResult,
} from "./analyze.js";
