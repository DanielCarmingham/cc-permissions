#!/usr/bin/env node

import { parseArgs } from "node:util";
import { PermissionLevel } from "./types.js";
import { parseLevel, describeLevels } from "./permissions.js";
import {
  getTemplates,
  listTemplates,
  initializeTemplates,
  clearCache,
  getCacheInfo,
  checkForUpdates,
  fetchAndCacheTemplates,
  getCdnBaseUrl,
  getCategories,
  type LoadResult,
  type TemplateCategory,
} from "./templates/index.js";
import { formatFullOutput, applyPermissions, formatApplyResult } from "./output.js";
import { analyzeDirectory, formatAnalysisResult } from "./analyze.js";
import { formatVersionInfo, readPackageJson } from "./version.js";

function showHelp(): void {
  console.log(`
cc-permissions - Generate permission configs for Claude Code

Usage:
  cc-permissions <command> [options]

Commands:
  template <names>  Generate permissions from templates
  analyze [path]    Analyze project and recommend templates
  list              List available templates
  update            Update templates from remote
  cache <action>    Manage template cache (info, clear)

Options:
  -h, --help        Show this help message
  -v, --version     Show version number
  -l, --level       Permission level: restrictive, standard, permissive (default: standard)
  -f, --format      Output format: json, summary, both (default: json)
  -a, --apply       Apply permissions to .claude/settings.json (creates backup)
  --offline         Use cached templates only (no network requests)

${describeLevels()}

Examples:
  cc-permissions template shell --level standard
  cc-permissions template nodejs,python --level permissive
  cc-permissions template nodejs --level standard --apply
  cc-permissions template nodejs --offline
  cc-permissions analyze ./my-project
  cc-permissions list
  cc-permissions update
  cc-permissions cache info
`);
}

function showTemplateHelp(): void {
  console.log(`
Usage: cc-permissions template <names> [options]

Generate permission configurations from one or more templates.

Arguments:
  names             Comma-separated template names (e.g., "nodejs" or "nodejs,python")

Options:
  -l, --level       Permission level: restrictive, standard, permissive (default: standard)
  -f, --format      Output format: json, summary, both (default: json)
  -a, --apply       Apply permissions to .claude/settings.json (creates .bak backup)
  --offline         Use cached templates only (no network requests)

${describeLevels()}

Run "cc-permissions list" to see available templates.

Examples:
  cc-permissions template shell --level restrictive
  cc-permissions template nodejs --level standard
  cc-permissions template nodejs,python --level permissive --format summary
  cc-permissions template nodejs --level standard --apply
  cc-permissions template nodejs --offline
`);
}

async function handleTemplate(args: string[], offline: boolean): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      level: { type: "string", short: "l", default: "standard" },
      format: { type: "string", short: "f", default: "json" },
      apply: { type: "boolean", short: "a" },
      help: { type: "boolean", short: "h" },
      offline: { type: "boolean" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    showTemplateHelp();
    process.exit(0);
  }

  // Initialize templates
  const isOffline = offline || values.offline === true;
  const loadResult = await initializeTemplates({ offline: isOffline, silent: true });

  if (!loadResult.success) {
    console.error(`Error: ${loadResult.error}`);
    process.exit(1);
  }

  if (loadResult.warning) {
    console.warn(`Warning: ${loadResult.warning}`);
  }

  // Parse template names (comma-separated)
  const templateNames = positionals[0].split(",").map((n) => n.trim().toLowerCase());

  // Validate and get templates
  const { found, notFound } = getTemplates(templateNames);

  if (notFound.length > 0) {
    console.error(`Unknown template(s): ${notFound.join(", ")}`);
    console.error(`Available templates: ${listTemplates().map((t) => t.name).join(", ")}`);
    process.exit(1);
  }

  // Parse level
  const level = parseLevel(values.level as string);
  if (!level) {
    console.error(`Invalid level: ${values.level}`);
    console.error(`Valid levels: restrictive, standard, permissive`);
    process.exit(1);
  }

  // Handle --apply flag
  if (values.apply) {
    const result = applyPermissions(process.cwd(), found, level);
    console.log(formatApplyResult(result));
    return;
  }

  // Parse format
  const format = values.format as string;
  if (!["json", "summary", "both"].includes(format)) {
    console.error(`Invalid format: ${format}`);
    console.error(`Valid formats: json, summary, both`);
    process.exit(1);
  }

  // Generate output
  const output = formatFullOutput(found, level, format as "json" | "summary" | "both");
  console.log(output);
}

async function handleAnalyze(args: string[], offline: boolean): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
      offline: { type: "boolean" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Usage: cc-permissions analyze [path]

Analyze a project directory and recommend templates.

Arguments:
  path              Path to analyze (default: current directory)

Options:
  --offline         Use cached templates only (no network requests)

Examples:
  cc-permissions analyze
  cc-permissions analyze ./my-project
`);
    process.exit(0);
  }

  // Initialize templates for analysis recommendations
  const isOffline = offline || values.offline === true;
  const loadResult = await initializeTemplates({ offline: isOffline, silent: true });

  if (!loadResult.success) {
    console.error(`Error: ${loadResult.error}`);
    process.exit(1);
  }

  const targetPath = positionals[0] || ".";
  const result = analyzeDirectory(targetPath);
  console.log(formatAnalysisResult(result));
}

async function handleList(offline: boolean): Promise<void> {
  // Initialize templates
  const loadResult = await initializeTemplates({ offline, silent: true });

  if (!loadResult.success) {
    console.error(`Error: ${loadResult.error}`);
    process.exit(1);
  }

  if (loadResult.warning) {
    console.warn(`Warning: ${loadResult.warning}\n`);
  }

  console.log(`Available Templates:\n`);

  const categories = getCategories();
  const allTemplates = listTemplates();
  const templateMap = new Map(allTemplates.map((t) => [t.name, t.description]));

  if (categories && categories.length > 0) {
    // Display templates grouped by category
    for (const category of categories) {
      console.log(`  ${category.name}:`);
      for (const name of category.templates) {
        const description = templateMap.get(name) || "";
        console.log(`    ${name.padEnd(12)} ${description}`);
      }
      console.log();
    }
  } else {
    // Fallback: display flat list (for old cache format)
    for (const template of allTemplates) {
      console.log(`  ${template.name.padEnd(12)} ${template.description}`);
    }
  }

  console.log(`Use "cc-permissions template <name> --level <level>" to generate permissions.`);
  console.log(`\nTemplate source: ${loadResult.source}`);
}

async function handleUpdate(): Promise<void> {
  console.log("Checking for template updates...\n");

  // Check current state
  const cacheInfo = getCacheInfo();
  if (cacheInfo.exists) {
    console.log(`Current cache: ${cacheInfo.templateCount} templates (v${cacheInfo.version || "unknown"})`);
    if (cacheInfo.lastUpdated) {
      console.log(`Last updated: ${new Date(cacheInfo.lastUpdated).toLocaleString()}`);
    }
    console.log();
  }

  // Fetch latest templates
  console.log("Fetching templates from remote...");
  const result = await fetchAndCacheTemplates();

  if (result.success && result.manifest) {
    const categories = result.manifest.categories;
    const totalTemplates = categories.reduce((sum, cat) => sum + cat.templates.length, 0);
    console.log(`\nSuccess! Downloaded ${totalTemplates} templates (v${result.manifest.version}).`);
    console.log("\nAvailable templates:");
    for (const category of categories) {
      console.log(`\n  ${category.name}:`);
      for (const name of category.templates) {
        console.log(`    - ${name}`);
      }
    }
  } else if (!result.success) {
    console.error(`\nError: ${result.error}`);
    console.error("\nPlease check your network connection and try again.");
    process.exit(1);
  }
}

function handleCache(args: string[]): void {
  const { positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  const action = positionals[0];

  if (!action || action === "info") {
    const info = getCacheInfo();
    console.log("Template Cache Information:\n");
    console.log(`  Path:           ${info.path}`);
    console.log(`  Exists:         ${info.exists ? "Yes" : "No"}`);
    console.log(`  Templates:      ${info.templateCount}`);
    console.log(`  Version:        ${info.version || "N/A"}`);
    console.log(`  Last updated:   ${info.lastUpdated ? new Date(info.lastUpdated).toLocaleString() : "N/A"}`);
    console.log(`\n  CDN URL:        ${getCdnBaseUrl()}`);
    return;
  }

  if (action === "clear") {
    const result = clearCache();
    if (result.cleared) {
      console.log("Cache cleared successfully.");
    } else {
      console.error(`Error: ${result.message}`);
      process.exit(1);
    }
    return;
  }

  console.error(`Unknown cache action: ${action}`);
  console.error("Valid actions: info, clear");
  process.exit(1);
}

// Main CLI entry point
async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      offline: { type: "boolean" },
    },
    allowPositionals: true,
    strict: false, // Allow unknown options to pass through to subcommands
  });

  if (values.version) {
    const pkg = readPackageJson();
    console.log(formatVersionInfo(pkg.version, pkg.name));
    process.exit(0);
  }

  if (values.help || positionals.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = positionals[0];
  const subArgs = process.argv.slice(process.argv.indexOf(command) + 1);
  const offline = values.offline === true;

  switch (command) {
    case "template":
      await handleTemplate(subArgs, offline);
      break;
    case "analyze":
      await handleAnalyze(subArgs, offline);
      break;
    case "list":
      await handleList(offline);
      break;
    case "update":
      await handleUpdate();
      break;
    case "cache":
      handleCache(subArgs);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "cc-permissions --help" for usage information.');
      process.exit(1);
  }
}

// Run main
main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
