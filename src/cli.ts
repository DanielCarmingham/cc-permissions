#!/usr/bin/env node

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseLevel, describeLevels } from "./permissions.js";
import { PermissionLevel } from "./types.js";
import {
  getTemplates,
  listTemplates,
} from "./templates/index.js";
import { formatFullOutput, applyPermissions, formatApplyResult, parseScope } from "./output.js";
import { analyzeDirectory, formatAnalysisResult } from "./analyze.js";
import { formatVersionInfo, readPackageJson } from "./version.js";
import { fmt, formatError, formatHint, formatSafetyWarning } from "./format.js";

// Load build info (generated at build time)
interface BuildInfo {
  commitHash: string;
  commitHashFull: string;
  dirty: boolean;
  buildTime: string;
}

function loadBuildInfo(): BuildInfo {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const buildInfoPath = join(__dirname, "build-info.json");
    return JSON.parse(readFileSync(buildInfoPath, "utf-8"));
  } catch {
    return { commitHash: "dev", commitHashFull: "dev", dirty: true, buildTime: "" };
  }
}

const buildInfo = loadBuildInfo();

function showHelp(): void {
  const pkg = readPackageJson();
  const dirtyMarker = buildInfo.dirty ? "-dirty" : "";
  const versionInfo = fmt.dim(`v${pkg.version} (${buildInfo.commitHash}${dirtyMarker})`);
  const dirtyNote = buildInfo.dirty ? fmt.dim("\n  (Local build has uncommitted changes - docs may not match)") : "";

  console.log(`
${fmt.title("cc-permissions")} - Generate permission configs for Claude Code
${versionInfo}

${fmt.section("Usage:")}
  ${fmt.command("cc-permissions")} ${fmt.optionalArg("[options]")}              Analyze current directory
  ${fmt.command("cc-permissions")} ${fmt.arg("<command>")} ${fmt.optionalArg("[options]")}    Run a specific command

${fmt.section("Commands:")}
  ${fmt.subcommand("apply")} ${fmt.optionalArg("[templates]")}  Analyze and apply permissions (or apply specific templates)
  ${fmt.subcommand("analyze")} ${fmt.optionalArg("[path]")}     Analyze project and recommend templates (no changes)
  ${fmt.subcommand("template")} ${fmt.arg("<names>")}   Output permissions from specific templates (no apply)
  ${fmt.subcommand("list")}               List available templates

${fmt.section("Global Options:")}
  ${fmt.option("-h, --help")}        Show this help message
  ${fmt.option("-v, --version")}     Show version number
  ${fmt.option("-l, --level")}       Permission level: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}
  ${fmt.option("-s, --scope")}       Settings scope: ${fmt.value("project")}, ${fmt.value("user")}, ${fmt.value("local")} ${fmt.dim("(default: project)")}
  ${fmt.option("-o, --output")}      Custom output file path (overrides --scope)

${fmt.section("Scopes:")}
  ${fmt.value("project")}           ${fmt.path(".claude/settings.json")} (in target directory)
  ${fmt.value("user")}, ${fmt.value("global")}      ${fmt.path("~/.claude/settings.json")} (user's home directory)
  ${fmt.value("local")}             ${fmt.path(".claude/settings.local.json")} (gitignored, for personal prefs)

Run "${fmt.command("cc-permissions")} ${fmt.arg("<command>")} ${fmt.option("--help")}" for command-specific options.

${fmt.section("Examples:")}
  ${fmt.example("cc-permissions")}                        Analyze current directory
  ${fmt.example("cc-permissions apply")}                  Analyze and apply permissions
  ${fmt.example("cc-permissions apply nodejs,docker")}    Apply specific templates
  ${fmt.example("cc-permissions apply -l permissive")}    Analyze and apply with custom level
  ${fmt.example("cc-permissions apply --scope user")}     Apply to user-level settings
  ${fmt.example("cc-permissions analyze ./my-project")}   Analyze a specific path
  ${fmt.example("cc-permissions template nodejs")}        Output template permissions
  ${fmt.example("cc-permissions list")}                   List all templates

${fmt.section("Documentation:")}
  ${fmt.url(`https://github.com/DanielCarmingham/cc-permissions/blob/${buildInfo.commitHash}/README.md`)}${dirtyNote}

${formatSafetyWarning()}
`);
}

function showTemplateHelp(): void {
  console.log(`
${fmt.section("Usage:")} ${fmt.command("cc-permissions template")} ${fmt.arg("<names>")} ${fmt.optionalArg("[options]")}

View permission configurations from one or more templates.
Use "${fmt.command("cc-permissions apply")}" to actually apply permissions.

${fmt.section("Arguments:")}
  ${fmt.arg("names")}             Comma-separated template names (e.g., ${fmt.value('"nodejs"')} or ${fmt.value('"nodejs,python"')})

${fmt.section("Options:")}
  ${fmt.option("-l, --level")}       Permission level: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")} ${fmt.dim("(default: standard)")}
  ${fmt.option("-f, --format")}      Output format: ${fmt.value("summary")}, ${fmt.value("json")} ${fmt.dim("(default: summary)")}

${describeLevels()}

Run "${fmt.command("cc-permissions list")}" to see available templates.

${fmt.section("Examples:")}
  ${fmt.example("cc-permissions template nodejs")}
  ${fmt.example("cc-permissions template nodejs --level restrictive")}
  ${fmt.example("cc-permissions template nodejs,python")}
  ${fmt.example("cc-permissions template nodejs --format json")}
`);
}

function handleTemplate(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      level: { type: "string", short: "l", default: "standard" },
      format: { type: "string", short: "f", default: "summary" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    showTemplateHelp();
    process.exit(0);
  }

  // Parse template names (comma-separated)
  const templateNames = positionals[0].split(",").map((n) => n.trim().toLowerCase());

  // Validate and get templates
  const { found, notFound } = getTemplates(templateNames);

  if (notFound.length > 0) {
    console.error(formatError(`Unknown template(s): ${fmt.value(notFound.join(", "))}`));
    console.error(formatHint(`Available templates: ${listTemplates().map((t) => t.name).join(", ")}`));
    process.exit(1);
  }

  // Parse level
  const level = parseLevel(values.level as string);
  if (!level) {
    console.error(formatError(`Invalid level: ${fmt.value(values.level as string)}`));
    console.error(formatHint(`Valid levels: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}`));
    process.exit(1);
  }

  // Parse format
  const format = values.format as string;
  if (!["json", "summary"].includes(format)) {
    console.error(formatError(`Invalid format: ${fmt.value(format)}`));
    console.error(formatHint(`Valid formats: ${fmt.value("json")}, ${fmt.value("summary")}`));
    process.exit(1);
  }

  // Generate output
  const output = formatFullOutput(found, level, format as "json" | "summary");
  console.log(output);
}

function showApplyHelp(): void {
  console.log(`
${fmt.section("Usage:")} ${fmt.command("cc-permissions apply")} ${fmt.optionalArg("[templates]")} ${fmt.optionalArg("[options]")}

Analyze project and apply permissions, or apply specific templates.

${fmt.section("Arguments:")}
  ${fmt.arg("templates")}         Optional comma-separated template names (e.g., ${fmt.value('"nodejs,python"')})
                    If omitted, analyzes project and applies recommended templates

${fmt.section("Options:")}
  ${fmt.option("-l, --level")}       Permission level: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}
                    ${fmt.dim("(default: auto-detected when analyzing, standard when using templates)")}
  ${fmt.option("-s, --scope")}       Settings scope: ${fmt.value("project")}, ${fmt.value("user")}, ${fmt.value("local")} ${fmt.dim("(default: project)")}
  ${fmt.option("-o, --output")}      Custom output file path (overrides --scope)
  ${fmt.option("-h, --help")}        Show this help

${describeLevels()}

${fmt.section("Examples:")}
  ${fmt.example("cc-permissions apply")}                  Analyze and apply recommended templates
  ${fmt.example("cc-permissions apply nodejs")}           Apply nodejs template
  ${fmt.example("cc-permissions apply nodejs,python")}    Apply multiple templates
  ${fmt.example("cc-permissions apply -l permissive")}    Analyze and apply with permissive level
  ${fmt.example("cc-permissions apply --scope user")}     Apply to user-level settings
`);
}

function handleApply(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
      level: { type: "string", short: "l" },
      scope: { type: "string", short: "s", default: "project" },
      output: { type: "string", short: "o" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showApplyHelp();
    process.exit(0);
  }

  // Parse scope
  const scope = parseScope(values.scope as string);
  if (!scope) {
    console.error(formatError(`Invalid scope: ${fmt.value(values.scope as string)}`));
    console.error(formatHint(`Valid scopes: ${fmt.value("project")}, ${fmt.value("user")}, ${fmt.value("global")}, ${fmt.value("local")}`));
    process.exit(1);
  }

  // If templates are specified, apply those directly
  if (positionals.length > 0) {
    const templateNames = positionals[0].split(",").map((n) => n.trim().toLowerCase());

    // Validate and get templates
    const { found, notFound } = getTemplates(templateNames);

    if (notFound.length > 0) {
      console.error(formatError(`Unknown template(s): ${fmt.value(notFound.join(", "))}`));
      console.error(formatHint(`Available templates: ${listTemplates().map((t) => t.name).join(", ")}`));
      process.exit(1);
    }

    // Parse level (default to standard for explicit templates)
    const level = values.level ? parseLevel(values.level as string) : PermissionLevel.Standard;
    if (!level) {
      console.error(formatError(`Invalid level: ${fmt.value(values.level as string)}`));
      console.error(formatHint(`Valid levels: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}`));
      process.exit(1);
    }

    const result = applyPermissions(found, level, {
      scope,
      outputPath: values.output as string | undefined,
    });
    console.log(formatApplyResult(result));
    return;
  }

  // No templates specified: analyze and apply
  const analysisResult = analyzeDirectory(".");

  // Use provided level or the suggested level from analysis
  let level = analysisResult.suggestedLevel;
  if (values.level) {
    const parsedLevel = parseLevel(values.level as string);
    if (!parsedLevel) {
      console.error(formatError(`Invalid level: ${fmt.value(values.level as string)}`));
      console.error(formatHint(`Valid levels: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}`));
      process.exit(1);
    }
    level = parsedLevel;
  }

  // Get the templates
  const { found, notFound } = getTemplates(analysisResult.recommendedTemplates);

  if (notFound.length > 0) {
    console.error(formatError(`Unknown template(s): ${fmt.value(notFound.join(", "))}`));
    process.exit(1);
  }

  // Apply the permissions
  const applyResult = applyPermissions(found, level, {
    scope,
    outputPath: values.output as string | undefined,
  });

  // Show analysis summary then apply result
  console.log(`${fmt.dim("Detected templates:")} ${fmt.item(analysisResult.recommendedTemplates.join(", "))}`);
  console.log(`${fmt.dim("Applied level:")} ${fmt.value(level)}`);
  console.log(formatApplyResult(applyResult));
}

function showAnalyzeHelp(): void {
  console.log(`
${fmt.section("Usage:")} ${fmt.command("cc-permissions analyze")} ${fmt.optionalArg("[path]")} ${fmt.optionalArg("[options]")}

Analyze a project directory and recommend templates (no changes made).

${fmt.section("Arguments:")}
  ${fmt.arg("path")}              Path to analyze ${fmt.dim("(default: current directory)")}

${fmt.section("Options:")}
  ${fmt.option("-l, --level")}       Permission level: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}
                    ${fmt.dim("(default: auto-detected based on project complexity)")}
  ${fmt.option("-s, --scope")}       Settings scope: ${fmt.value("project")}, ${fmt.value("user")}, ${fmt.value("local")} ${fmt.dim("(default: project)")}
  ${fmt.option("-o, --output")}      Custom output file path (overrides --scope)
  ${fmt.option("-h, --help")}        Show this help

${describeLevels()}

${fmt.section("Examples:")}
  ${fmt.example("cc-permissions analyze")}
  ${fmt.example("cc-permissions analyze ./my-project")}
  ${fmt.example("cc-permissions analyze -l permissive")}
`);
}

function handleAnalyze(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
      level: { type: "string", short: "l" },
      // Keep --apply for backwards compatibility
      apply: { type: "boolean", short: "a" },
      scope: { type: "string", short: "s", default: "project" },
      output: { type: "string", short: "o" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showAnalyzeHelp();
    process.exit(0);
  }

  const targetPath = positionals[0] || ".";
  const result = analyzeDirectory(targetPath);

  // Handle --apply flag (backwards compatibility - prefer `cc-permissions apply`)
  if (values.apply) {
    // Use provided level or the suggested level from analysis
    let level = result.suggestedLevel;
    if (values.level) {
      const parsedLevel = parseLevel(values.level as string);
      if (!parsedLevel) {
        console.error(formatError(`Invalid level: ${fmt.value(values.level as string)}`));
        console.error(formatHint(`Valid levels: ${fmt.value("restrictive")}, ${fmt.value("standard")}, ${fmt.value("permissive")}`));
        process.exit(1);
      }
      level = parsedLevel;
    }

    // Get the templates
    const { found, notFound } = getTemplates(result.recommendedTemplates);

    if (notFound.length > 0) {
      console.error(formatError(`Unknown template(s): ${fmt.value(notFound.join(", "))}`));
      process.exit(1);
    }

    // Parse scope
    const scope = parseScope(values.scope as string);
    if (!scope) {
      console.error(formatError(`Invalid scope: ${fmt.value(values.scope as string)}`));
      console.error(formatHint(`Valid scopes: ${fmt.value("project")}, ${fmt.value("user")}, ${fmt.value("global")}, ${fmt.value("local")}`));
      process.exit(1);
    }

    // Apply the permissions
    const applyResult = applyPermissions(found, level, {
      scope,
      outputPath: values.output as string | undefined,
    });

    // Show analysis summary then apply result
    console.log(`${fmt.dim("Detected templates:")} ${fmt.item(result.recommendedTemplates.join(", "))}`);
    console.log(`${fmt.dim("Applied level:")} ${fmt.value(level)}`);
    console.log(formatApplyResult(applyResult));
    return;
  }

  // Standard output: show analysis result
  console.log(formatAnalysisResult(result));
}

function showListHelp(): void {
  console.log(`
${fmt.section("Usage:")} ${fmt.command("cc-permissions list")}

List all available templates grouped by category.

${fmt.section("Options:")}
  ${fmt.option("-h, --help")}        Show this help

${fmt.section("Examples:")}
  ${fmt.example("cc-permissions list")}
`);
}

function handleList(args: string[]): void {
  const { values } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showListHelp();
    process.exit(0);
  }

  const allTemplates = listTemplates();

  // Fixed category order
  const categoryOrder = [
    "General",
    "Version Control",
    "Languages & Runtimes",
    "Build Tools",
    "Cloud Providers",
    "Container & Infrastructure",
    "Testing",
    "Mobile Development",
    "MCP Servers",
    "Database",
    "Other",
  ];

  // Group templates by category
  const grouped = new Map<string, Array<{ name: string; description: string }>>();

  for (const template of allTemplates) {
    const category = template.category || "Other";
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push({ name: template.name, description: template.description });
  }

  // Sort templates within each category alphabetically
  for (const templates of grouped.values()) {
    templates.sort((a, b) => a.name.localeCompare(b.name));
  }

  console.log(fmt.title("Available Templates") + "\n");

  // Compute padding from longest template name
  const maxNameLength = Math.max(...allTemplates.map((t) => t.name.length));
  const padWidth = maxNameLength + 2;

  // Output in fixed category order
  for (const category of categoryOrder) {
    const templates = grouped.get(category);
    if (!templates || templates.length === 0) continue;

    console.log(fmt.category(`${category}:`));
    for (const template of templates) {
      console.log(`  ${fmt.item(template.name.padEnd(padWidth))} ${fmt.itemDesc(template.description)}`);
    }
    console.log();
  }

  console.log(`Use "${fmt.command("cc-permissions template")} ${fmt.arg("<name>")} ${fmt.option("--level")} ${fmt.arg("<level>")}" to generate permissions.`);
}

// Main CLI entry point
function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      level: { type: "string", short: "l" },
      apply: { type: "boolean", short: "a" },
      scope: { type: "string", short: "s" },
      output: { type: "string", short: "o" },
    },
    allowPositionals: true,
    strict: false, // Allow unknown options to pass through to subcommands
  });

  if (values.version) {
    const pkg = readPackageJson();
    const dirty = buildInfo.dirty ? "-dirty" : "";
    const commitSuffix = buildInfo.commitHash !== "dev" ? fmt.dim(` (${buildInfo.commitHash}${dirty})`) : "";
    console.log(`${formatVersionInfo(pkg.version, pkg.name)}${commitSuffix}`);
    process.exit(0);
  }

  // Check if first positional is a command
  const command = positionals[0];

  // Show help if -h flag with no command
  if (values.help && !command) {
    showHelp();
    process.exit(0);
  }

  // No arguments: run analyze on current directory
  // Pass through relevant flags
  if (!command) {
    const analyzeArgs: string[] = [];
    if (values.level) {
      analyzeArgs.push("--level", values.level as string);
    }
    if (values.apply) {
      analyzeArgs.push("--apply");
    }
    if (values.scope) {
      analyzeArgs.push("--scope", values.scope as string);
    }
    if (values.output) {
      analyzeArgs.push("--output", values.output as string);
    }
    handleAnalyze(analyzeArgs);
    return;
  }

  // Command was specified - route to appropriate handler
  const subArgs = process.argv.slice(process.argv.indexOf(command) + 1);

  switch (command) {
    case "apply":
      handleApply(subArgs);
      break;
    case "template":
      handleTemplate(subArgs);
      break;
    case "analyze":
      handleAnalyze(subArgs);
      break;
    case "list":
      handleList(subArgs);
      break;
    default:
      console.error(formatError(`Unknown command: ${fmt.value(command)}`));
      console.error(`Run "${fmt.command("cc-permissions --help")}" for usage information.`);
      process.exit(1);
  }
}

// Run main
main();
