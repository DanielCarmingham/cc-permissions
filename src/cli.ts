#!/usr/bin/env node

import { parseArgs } from "node:util";
import { parseLevel, describeLevels } from "./permissions.js";
import {
  getTemplates,
  listTemplates,
} from "./templates/index.js";
import { formatFullOutput, applyPermissions, formatApplyResult } from "./output.js";
import { analyzeDirectory, formatAnalysisResult } from "./analyze.js";
import { formatVersionInfo, readPackageJson } from "./version.js";

function showHelp(): void {
  console.log(`
cc-permissions - Generate permission configs for Claude Code

Usage:
  cc-permissions [options]              Analyze current directory
  cc-permissions <command> [options]    Run a specific command

Commands:
  analyze [path]    Analyze project and recommend templates
  template <names>  Generate permissions from specific templates
  list              List available templates

Global Options:
  -h, --help        Show this help message
  -v, --version     Show version number
  -l, --level       Permission level (used with analyze)
  -a, --apply       Apply permissions to .claude/settings.json

Run "cc-permissions <command> --help" for command-specific options.

Examples:
  cc-permissions                        Analyze current directory
  cc-permissions --apply                Analyze and apply permissions
  cc-permissions --apply -l permissive  Analyze and apply with custom level
  cc-permissions analyze ./my-project   Analyze a specific path
  cc-permissions template nodejs,python Manually select templates
  cc-permissions list                   List all templates
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

${describeLevels()}

Run "cc-permissions list" to see available templates.

Examples:
  cc-permissions template shell --level restrictive
  cc-permissions template nodejs --level standard
  cc-permissions template nodejs,python --level permissive --format summary
  cc-permissions template nodejs --level standard --apply
`);
}

function handleTemplate(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      level: { type: "string", short: "l", default: "standard" },
      format: { type: "string", short: "f", default: "json" },
      apply: { type: "boolean", short: "a" },
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

function showAnalyzeHelp(): void {
  console.log(`
Usage: cc-permissions analyze [path] [options]

Analyze a project directory and recommend templates.

Arguments:
  path              Path to analyze (default: current directory)

Options:
  -l, --level       Permission level: restrictive, standard, permissive
                    (default: auto-detected based on project complexity)
  -a, --apply       Apply permissions to .claude/settings.json
  -h, --help        Show this help

${describeLevels()}

Examples:
  cc-permissions analyze
  cc-permissions analyze ./my-project
  cc-permissions analyze --apply
  cc-permissions analyze -l permissive --apply
`);
}

function handleAnalyze(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
      level: { type: "string", short: "l" },
      apply: { type: "boolean", short: "a" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showAnalyzeHelp();
    process.exit(0);
  }

  const targetPath = positionals[0] || ".";
  const result = analyzeDirectory(targetPath);

  // Handle --apply flag
  if (values.apply) {
    // Use provided level or the suggested level from analysis
    let level = result.suggestedLevel;
    if (values.level) {
      const parsedLevel = parseLevel(values.level as string);
      if (!parsedLevel) {
        console.error(`Invalid level: ${values.level}`);
        console.error(`Valid levels: restrictive, standard, permissive`);
        process.exit(1);
      }
      level = parsedLevel;
    }

    // Get the templates
    const { found, notFound } = getTemplates(result.recommendedTemplates);

    if (notFound.length > 0) {
      console.error(`Unknown template(s): ${notFound.join(", ")}`);
      process.exit(1);
    }

    // Apply the permissions
    const applyResult = applyPermissions(process.cwd(), found, level);

    // Show analysis summary then apply result
    console.log(`Detected templates: ${result.recommendedTemplates.join(", ")}`);
    console.log(`Applied level: ${level}`);
    console.log(formatApplyResult(applyResult));
    return;
  }

  // Standard output: show analysis result
  console.log(formatAnalysisResult(result));
}

function showListHelp(): void {
  console.log(`
Usage: cc-permissions list

List all available templates grouped by category.

Options:
  -h, --help        Show this help

Examples:
  cc-permissions list
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
    "Cloud Providers",
    "Container & Infrastructure",
    "Mobile Development",
    "Utilities",
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

  console.log("Available Templates:\n");

  // Output in fixed category order
  for (const category of categoryOrder) {
    const templates = grouped.get(category);
    if (!templates || templates.length === 0) continue;

    console.log(`${category}:`);
    for (const template of templates) {
      console.log(`  ${template.name.padEnd(12)} ${template.description}`);
    }
    console.log();
  }

  console.log(`Use "cc-permissions template <name> --level <level>" to generate permissions.`);
}

// Main CLI entry point
function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      level: { type: "string", short: "l" },
      apply: { type: "boolean", short: "a" },
    },
    allowPositionals: true,
    strict: false, // Allow unknown options to pass through to subcommands
  });

  if (values.version) {
    const pkg = readPackageJson();
    console.log(formatVersionInfo(pkg.version, pkg.name));
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
  // Pass through --level and --apply flags
  if (!command) {
    const analyzeArgs: string[] = [];
    if (values.level) {
      analyzeArgs.push("--level", values.level as string);
    }
    if (values.apply) {
      analyzeArgs.push("--apply");
    }
    handleAnalyze(analyzeArgs);
    return;
  }

  // Command was specified - route to appropriate handler
  const subArgs = process.argv.slice(process.argv.indexOf(command) + 1);

  switch (command) {
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
      console.error(`Unknown command: ${command}`);
      console.error('Run "cc-permissions --help" for usage information.');
      process.exit(1);
  }
}

// Run main
main();
