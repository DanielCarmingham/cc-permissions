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
  cc-permissions <command> [options]

Commands:
  template <names>  Generate permissions from templates
  analyze [path]    Analyze project and recommend templates
  list              List available templates

Options:
  -h, --help        Show this help message
  -v, --version     Show version number
  -l, --level       Permission level: restrictive, standard, permissive (default: standard)
  -f, --format      Output format: json, summary, both (default: json)
  -a, --apply       Apply permissions to .claude/settings.json (creates backup)

${describeLevels()}

Examples:
  cc-permissions template shell --level standard
  cc-permissions template nodejs,python --level permissive
  cc-permissions template nodejs --level standard --apply
  cc-permissions analyze ./my-project
  cc-permissions list
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

function handleAnalyze(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Usage: cc-permissions analyze [path]

Analyze a project directory and recommend templates.

Arguments:
  path              Path to analyze (default: current directory)

Examples:
  cc-permissions analyze
  cc-permissions analyze ./my-project
`);
    process.exit(0);
  }

  const targetPath = positionals[0] || ".";
  const result = analyzeDirectory(targetPath);
  console.log(formatAnalysisResult(result));
}

function handleList(): void {
  console.log(`Available Templates:\n`);

  const allTemplates = listTemplates();

  for (const template of allTemplates) {
    console.log(`  ${template.name.padEnd(12)} ${template.description}`);
  }

  console.log(`\nUse "cc-permissions template <name> --level <level>" to generate permissions.`);
}

// Main CLI entry point
function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
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

  switch (command) {
    case "template":
      handleTemplate(subArgs);
      break;
    case "analyze":
      handleAnalyze(subArgs);
      break;
    case "list":
      handleList();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "cc-permissions --help" for usage information.');
      process.exit(1);
  }
}

// Run main
main();
