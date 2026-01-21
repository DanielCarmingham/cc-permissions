#!/usr/bin/env node

/**
 * Version management script for package maintainers.
 *
 * Usage:
 *   npm run version:bump patch   # 0.1.0 → 0.1.1
 *   npm run version:bump minor   # 0.1.0 → 0.2.0
 *   npm run version:bump major   # 0.1.0 → 1.0.0
 *   npm run version:set 2.0.0    # Set exact version
 *   npm run version:show         # Display current version
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, "..", "package.json");

// Read package.json
function readPackageJson() {
  return JSON.parse(readFileSync(packagePath, "utf-8"));
}

// Write package.json
function writePackageJson(pkg) {
  writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

// Parse semver
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

// Validate semver
function isValidVersion(version) {
  return parseVersion(version) !== null;
}

// Calculate next version
function calculateNextVersion(currentVersion, bumpType) {
  const parsed = parseVersion(currentVersion);
  if (!parsed) return null;

  switch (bumpType) {
    case "major":
      return `${parsed.major + 1}.0.0`;
    case "minor":
      return `${parsed.major}.${parsed.minor + 1}.0`;
    case "patch":
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    default:
      return null;
  }
}

// Show version
function showVersion() {
  const pkg = readPackageJson();
  console.log(`${pkg.name} v${pkg.version}`);
}

// Bump version
function bumpVersion(bumpType) {
  if (!["major", "minor", "patch"].includes(bumpType)) {
    console.error(`Invalid bump type: ${bumpType}`);
    console.error("Valid types: major, minor, patch");
    process.exit(1);
  }

  const pkg = readPackageJson();
  const currentVersion = pkg.version;
  const newVersion = calculateNextVersion(currentVersion, bumpType);

  if (!newVersion) {
    console.error(`Invalid current version: ${currentVersion}`);
    process.exit(1);
  }

  pkg.version = newVersion;
  writePackageJson(pkg);
  console.log(`Bumped ${bumpType}: ${currentVersion} → ${newVersion}`);
}

// Set version
function setVersion(newVersion) {
  if (!isValidVersion(newVersion)) {
    console.error(`Invalid version format: ${newVersion}`);
    console.error("Use semver format (e.g., 1.2.3)");
    process.exit(1);
  }

  const pkg = readPackageJson();
  const currentVersion = pkg.version;
  pkg.version = newVersion;
  writePackageJson(pkg);
  console.log(`Set version: ${currentVersion} → ${newVersion}`);
}

// Main
const [,, command, arg] = process.argv;

switch (command) {
  case "show":
    showVersion();
    break;
  case "bump":
    if (!arg) {
      console.error("Usage: npm run version:bump <major|minor|patch>");
      process.exit(1);
    }
    bumpVersion(arg);
    break;
  case "set":
    if (!arg) {
      console.error("Usage: npm run version:set <version>");
      process.exit(1);
    }
    setVersion(arg);
    break;
  default:
    console.error("Version management script for package maintainers.\n");
    console.error("Usage:");
    console.error("  npm run version:show         Show current version");
    console.error("  npm run version:bump patch   Bump patch version (0.1.0 → 0.1.1)");
    console.error("  npm run version:bump minor   Bump minor version (0.1.0 → 0.2.0)");
    console.error("  npm run version:bump major   Bump major version (0.1.0 → 1.0.0)");
    console.error("  npm run version:set 2.0.0    Set exact version");
    process.exit(1);
}
