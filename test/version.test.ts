import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import {
  parseVersion,
  isValidVersion,
  calculateNextVersion,
  parseBumpType,
  formatVersionInfo,
  readPackageJson,
  writePackageJson,
  getVersion,
  bumpVersion,
  setVersion,
  PackageJson,
  BumpType,
} from "../src/version.js";

// Helper to create temp directory
function createTempDir(): string {
  return mkdtempSync(path.join(tmpdir(), "cc-perm-version-test-"));
}

// Helper to create a mock package.json
function createMockPackageJson(tempDir: string, version: string = "1.2.3"): string {
  const packagePath = path.join(tempDir, "package.json");
  const pkg: PackageJson = {
    name: "test-package",
    version,
  };
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  return packagePath;
}

describe("parseVersion", () => {
  it("should parse valid semver versions", () => {
    assert.deepEqual(parseVersion("1.2.3"), { major: 1, minor: 2, patch: 3 });
    assert.deepEqual(parseVersion("0.0.0"), { major: 0, minor: 0, patch: 0 });
    assert.deepEqual(parseVersion("10.20.30"), { major: 10, minor: 20, patch: 30 });
    assert.deepEqual(parseVersion("123.456.789"), { major: 123, minor: 456, patch: 789 });
  });

  it("should return null for invalid versions", () => {
    assert.equal(parseVersion("1.2"), null);
    assert.equal(parseVersion("1.2.3.4"), null);
    assert.equal(parseVersion("v1.2.3"), null);
    assert.equal(parseVersion("1.2.3-beta"), null);
    assert.equal(parseVersion("1.2.3+build"), null);
    assert.equal(parseVersion("abc"), null);
    assert.equal(parseVersion(""), null);
    assert.equal(parseVersion("1.2.a"), null);
  });
});

describe("isValidVersion", () => {
  it("should return true for valid versions", () => {
    assert.equal(isValidVersion("1.2.3"), true);
    assert.equal(isValidVersion("0.0.0"), true);
    assert.equal(isValidVersion("10.20.30"), true);
  });

  it("should return false for invalid versions", () => {
    assert.equal(isValidVersion("1.2"), false);
    assert.equal(isValidVersion("v1.2.3"), false);
    assert.equal(isValidVersion("invalid"), false);
    assert.equal(isValidVersion(""), false);
  });
});

describe("calculateNextVersion", () => {
  it("should bump major version", () => {
    assert.equal(calculateNextVersion("1.2.3", "major"), "2.0.0");
    assert.equal(calculateNextVersion("0.9.9", "major"), "1.0.0");
    assert.equal(calculateNextVersion("10.5.3", "major"), "11.0.0");
  });

  it("should bump minor version", () => {
    assert.equal(calculateNextVersion("1.2.3", "minor"), "1.3.0");
    assert.equal(calculateNextVersion("0.9.9", "minor"), "0.10.0");
    assert.equal(calculateNextVersion("1.0.5", "minor"), "1.1.0");
  });

  it("should bump patch version", () => {
    assert.equal(calculateNextVersion("1.2.3", "patch"), "1.2.4");
    assert.equal(calculateNextVersion("0.0.0", "patch"), "0.0.1");
    assert.equal(calculateNextVersion("1.2.9", "patch"), "1.2.10");
  });

  it("should return null for invalid current version", () => {
    assert.equal(calculateNextVersion("invalid", "patch"), null);
    assert.equal(calculateNextVersion("1.2", "minor"), null);
  });
});

describe("parseBumpType", () => {
  it("should parse valid bump types", () => {
    assert.equal(parseBumpType("major"), "major");
    assert.equal(parseBumpType("minor"), "minor");
    assert.equal(parseBumpType("patch"), "patch");
  });

  it("should be case insensitive", () => {
    assert.equal(parseBumpType("MAJOR"), "major");
    assert.equal(parseBumpType("Minor"), "minor");
    assert.equal(parseBumpType("PATCH"), "patch");
  });

  it("should handle whitespace", () => {
    assert.equal(parseBumpType("  major  "), "major");
    assert.equal(parseBumpType("\tminor\n"), "minor");
  });

  it("should return null for invalid bump types", () => {
    assert.equal(parseBumpType("invalid"), null);
    assert.equal(parseBumpType(""), null);
    assert.equal(parseBumpType("maj"), null);
    assert.equal(parseBumpType("prerelease"), null);
  });
});

describe("formatVersionInfo", () => {
  it("should format version without name", () => {
    assert.equal(formatVersionInfo("1.2.3"), "v1.2.3");
  });

  it("should format version with name", () => {
    assert.equal(formatVersionInfo("1.2.3", "my-package"), "my-package v1.2.3");
  });

  it("should handle empty name", () => {
    assert.equal(formatVersionInfo("1.2.3", ""), "v1.2.3");
  });
});

describe("readPackageJson and writePackageJson", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it("should read package.json correctly", () => {
    const packagePath = createMockPackageJson(tempDir, "2.0.0");
    const pkg = readPackageJson(packagePath);

    assert.equal(pkg.name, "test-package");
    assert.equal(pkg.version, "2.0.0");
  });

  it("should write package.json correctly", () => {
    const packagePath = createMockPackageJson(tempDir, "1.0.0");

    const pkg = readPackageJson(packagePath);
    pkg.version = "2.0.0";
    pkg.description = "Added description";
    writePackageJson(pkg, packagePath);

    const updated = readPackageJson(packagePath);
    assert.equal(updated.version, "2.0.0");
    assert.equal(updated.description, "Added description");
  });

  it("should preserve formatting with 2-space indent", () => {
    const packagePath = createMockPackageJson(tempDir, "1.0.0");

    const pkg = readPackageJson(packagePath);
    writePackageJson(pkg, packagePath);

    const content = fs.readFileSync(packagePath, "utf-8");
    assert.ok(content.includes('  "name"'));
    assert.ok(content.endsWith("\n"));
  });
});

describe("getVersion", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it("should return current version from package.json", () => {
    const packagePath = createMockPackageJson(tempDir, "3.2.1");
    const version = getVersion(packagePath);
    assert.equal(version, "3.2.1");
  });
});

describe("bumpVersion", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it("should bump patch version and update file", () => {
    const packagePath = createMockPackageJson(tempDir, "1.2.3");
    const newVersion = bumpVersion("patch", packagePath);

    assert.equal(newVersion, "1.2.4");
    assert.equal(getVersion(packagePath), "1.2.4");
  });

  it("should bump minor version and update file", () => {
    const packagePath = createMockPackageJson(tempDir, "1.2.3");
    const newVersion = bumpVersion("minor", packagePath);

    assert.equal(newVersion, "1.3.0");
    assert.equal(getVersion(packagePath), "1.3.0");
  });

  it("should bump major version and update file", () => {
    const packagePath = createMockPackageJson(tempDir, "1.2.3");
    const newVersion = bumpVersion("major", packagePath);

    assert.equal(newVersion, "2.0.0");
    assert.equal(getVersion(packagePath), "2.0.0");
  });

  it("should throw for invalid current version", () => {
    const packagePath = path.join(tempDir, "package.json");
    fs.writeFileSync(packagePath, JSON.stringify({ name: "test", version: "invalid" }));

    assert.throws(() => bumpVersion("patch", packagePath), /Invalid current version/);
  });
});

describe("setVersion", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it("should set specific version and update file", () => {
    const packagePath = createMockPackageJson(tempDir, "1.0.0");
    const newVersion = setVersion("5.0.0", packagePath);

    assert.equal(newVersion, "5.0.0");
    assert.equal(getVersion(packagePath), "5.0.0");
  });

  it("should throw for invalid version format", () => {
    const packagePath = createMockPackageJson(tempDir, "1.0.0");

    assert.throws(() => setVersion("invalid", packagePath), /Invalid version format/);
    assert.throws(() => setVersion("1.2", packagePath), /Invalid version format/);
    assert.throws(() => setVersion("v1.2.3", packagePath), /Invalid version format/);
  });

  it("should preserve other package.json fields", () => {
    const packagePath = path.join(tempDir, "package.json");
    const originalPkg = {
      name: "test-package",
      version: "1.0.0",
      description: "Test description",
      author: "Test Author",
    };
    fs.writeFileSync(packagePath, JSON.stringify(originalPkg, null, 2));

    setVersion("2.0.0", packagePath);

    const updatedPkg = readPackageJson(packagePath);
    assert.equal(updatedPkg.version, "2.0.0");
    assert.equal(updatedPkg.description, "Test description");
    assert.equal(updatedPkg.author, "Test Author");
  });
});
