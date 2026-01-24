#!/usr/bin/env node

/**
 * Generates build info (git commit hash) for inclusion in the build.
 * Run this before TypeScript compilation.
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const outputPath = join(distDir, "build-info.json");

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

function getGitCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

function getGitCommitHashFull() {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

const buildInfo = {
  commitHash: getGitCommitHash(),
  commitHashFull: getGitCommitHashFull(),
  buildTime: new Date().toISOString(),
};

writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2) + "\n", "utf-8");
console.log(`Generated build info: ${buildInfo.commitHash}`);
