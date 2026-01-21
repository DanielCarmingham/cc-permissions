#!/usr/bin/env node

/**
 * Prepublish script that checks if the current version already exists on npm.
 * Prevents accidentally publishing a duplicate version.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, "..", "package.json");

// Read current version from package.json
const pkg = JSON.parse(readFileSync(packagePath, "utf-8"));
const currentVersion = pkg.version;
const packageName = pkg.name;

console.log(`Checking if ${packageName}@${currentVersion} already exists on npm...`);

try {
  // Get all published versions from npm
  const result = execSync(`npm view ${packageName} versions --json 2>/dev/null`, {
    encoding: "utf-8",
  });

  const versions = JSON.parse(result);
  const publishedVersions = Array.isArray(versions) ? versions : [versions];

  if (publishedVersions.includes(currentVersion)) {
    console.error(`\nError: Version ${currentVersion} already exists on npm!`);
    console.error(`\nTo fix this, bump the version before publishing:`);
    console.error(`  npm run version:bump patch`);
    console.error(`  npm run version:bump minor`);
    console.error(`  npm run version:bump major`);
    process.exit(1);
  }

  console.log(`Version ${currentVersion} is available. Proceeding with publish.`);
} catch (error) {
  // If npm view fails, the package might not exist yet (first publish)
  if (error.message?.includes("404") || error.status === 1) {
    console.log(`Package not found on npm. This appears to be the first publish.`);
  } else {
    // For other errors, log but don't block (network issues, etc.)
    console.warn(`Warning: Could not verify version on npm. Proceeding anyway.`);
    console.warn(`  ${error.message || error}`);
  }
}
