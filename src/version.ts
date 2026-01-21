import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export interface PackageJson {
  name: string;
  version: string;
  [key: string]: unknown;
}

export type BumpType = "major" | "minor" | "patch";

/**
 * Get the path to package.json relative to this module.
 */
function getPackageJsonPath(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // In dist/, go up one level to find package.json
  // In src/, also go up one level
  return path.resolve(__dirname, "..", "package.json");
}

/**
 * Read and parse package.json.
 */
export function readPackageJson(packagePath?: string): PackageJson {
  const targetPath = packagePath ?? getPackageJsonPath();
  const content = fs.readFileSync(targetPath, "utf-8");
  return JSON.parse(content) as PackageJson;
}

/**
 * Write package.json with updated content.
 */
export function writePackageJson(pkg: PackageJson, packagePath?: string): void {
  const targetPath = packagePath ?? getPackageJsonPath();
  fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

/**
 * Get the current version from package.json.
 */
export function getVersion(packagePath?: string): string {
  const pkg = readPackageJson(packagePath);
  return pkg.version;
}

/**
 * Parse a semantic version string into components.
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Validate that a string is a valid semver version.
 */
export function isValidVersion(version: string): boolean {
  return parseVersion(version) !== null;
}

/**
 * Calculate the next version based on bump type.
 */
export function calculateNextVersion(currentVersion: string, bumpType: BumpType): string | null {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    return null;
  }

  switch (bumpType) {
    case "major":
      return `${parsed.major + 1}.0.0`;
    case "minor":
      return `${parsed.major}.${parsed.minor + 1}.0`;
    case "patch":
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }
}

/**
 * Bump the version in package.json.
 * Returns the new version.
 */
export function bumpVersion(bumpType: BumpType, packagePath?: string): string {
  const pkg = readPackageJson(packagePath);
  const newVersion = calculateNextVersion(pkg.version, bumpType);

  if (!newVersion) {
    throw new Error(`Invalid current version: ${pkg.version}`);
  }

  pkg.version = newVersion;
  writePackageJson(pkg, packagePath);
  return newVersion;
}

/**
 * Set a specific version in package.json.
 * Returns the new version.
 */
export function setVersion(newVersion: string, packagePath?: string): string {
  if (!isValidVersion(newVersion)) {
    throw new Error(`Invalid version format: ${newVersion}. Use semver format (e.g., 1.2.3)`);
  }

  const pkg = readPackageJson(packagePath);
  pkg.version = newVersion;
  writePackageJson(pkg, packagePath);
  return newVersion;
}

/**
 * Parse bump type from string.
 */
export function parseBumpType(str: string): BumpType | null {
  const normalized = str.toLowerCase().trim();
  if (normalized === "major" || normalized === "minor" || normalized === "patch") {
    return normalized;
  }
  return null;
}

/**
 * Format version info for display.
 */
export function formatVersionInfo(version: string, name?: string): string {
  if (name) {
    return `${name} v${version}`;
  }
  return `v${version}`;
}
