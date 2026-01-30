import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";

// Path to the CLI entry point
const CLI_PATH = path.join(import.meta.dirname, "..", "src", "cli.ts");

/**
 * Execute the CLI with given arguments.
 * Uses tsx to run TypeScript directly.
 */
function runCli(args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): {
  stdout: string;
  stderr: string;
  exitCode: number;
} {
  const result = spawnSync("npx", ["tsx", CLI_PATH, ...args], {
    encoding: "utf-8",
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env },
    timeout: 30000,
  });

  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    exitCode: result.status ?? 1,
  };
}

/**
 * Helper to create temp directory for file I/O tests
 */
function createTempDir(): string {
  return mkdtempSync(path.join(tmpdir(), "cc-perm-cli-test-"));
}

describe("CLI - Help and Version", () => {
  it("should display help with --help flag", () => {
    const { stdout, exitCode } = runCli(["--help"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("cc-permissions"));
    assert.ok(stdout.includes("Usage:"));
    assert.ok(stdout.includes("Commands:"));
    assert.ok(stdout.includes("template"));
    assert.ok(stdout.includes("analyze"));
    assert.ok(stdout.includes("list"));
  });

  it("should display help with -h flag", () => {
    const { stdout, exitCode } = runCli(["-h"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("cc-permissions"));
  });

  it("should run analyze when no arguments provided", () => {
    const { stdout, exitCode } = runCli([]);

    assert.equal(exitCode, 0);
    // Should run analyze and show project analysis output
    assert.ok(stdout.includes("Project Analysis"));
  });

  it("should display version with --version flag", () => {
    const { stdout, exitCode } = runCli(["--version"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("cc-permissions"));
    // Should include a version number pattern (e.g., 0.1.0)
    assert.ok(/\d+\.\d+\.\d+/.test(stdout));
  });

  it("should display version with -v flag", () => {
    const { stdout, exitCode } = runCli(["-v"]);

    assert.equal(exitCode, 0);
    assert.ok(/\d+\.\d+\.\d+/.test(stdout));
  });
});

describe("CLI - Unknown Command", () => {
  it("should show error for unknown command", () => {
    const { stderr, exitCode } = runCli(["unknowncommand"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown command"));
    assert.ok(stderr.includes("unknowncommand"));
  });
});

describe("CLI - Template Command", () => {
  it("should display template help when no arguments provided", () => {
    const { stdout, exitCode } = runCli(["template"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Usage: cc-permissions template"));
    assert.ok(stdout.includes("--level"));
    assert.ok(stdout.includes("--format"));
  });

  it("should generate permissions JSON with --format json", () => {
    const { stdout, exitCode } = runCli(["template", "shell", "--format", "json"]);

    assert.equal(exitCode, 0);
    // Should be valid JSON
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions);
    assert.ok(Array.isArray(parsed.permissions.allow));
    assert.ok(Array.isArray(parsed.permissions.deny));
  });

  it("should generate permissions with specified level", () => {
    const restrictive = runCli(["template", "shell", "--level", "restrictive", "--format", "json"]);
    const permissive = runCli(["template", "shell", "--level", "permissive", "--format", "json"]);

    assert.equal(restrictive.exitCode, 0);
    assert.equal(permissive.exitCode, 0);

    const restrictivePerms = JSON.parse(restrictive.stdout);
    const permissivePerms = JSON.parse(permissive.stdout);

    // Permissive should have more or equal permissions than restrictive
    assert.ok(permissivePerms.permissions.allow.length >= restrictivePerms.permissions.allow.length);
  });

  it("should support summary format", () => {
    const { stdout, exitCode } = runCli(["template", "shell", "--format", "summary"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Permission Summary"));
    assert.ok(stdout.includes("Allowed Commands"));
    // Should not be pure JSON
    assert.throws(() => JSON.parse(stdout));
  });

  it("should output summary format by default", () => {
    const { stdout, exitCode } = runCli(["template", "shell"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Permission Summary"));
    assert.ok(stdout.includes("Allowed Commands"));
    // Should not be pure JSON
    assert.throws(() => JSON.parse(stdout));
  });

  it("should handle multiple templates (comma-separated)", () => {
    const { stdout, exitCode } = runCli(["template", "shell,git", "--format", "json"]);

    assert.equal(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions.allow.length > 0);
  });

  it("should error for unknown template", () => {
    const { stderr, exitCode } = runCli(["template", "nonexistent"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown template"));
    assert.ok(stderr.includes("nonexistent"));
  });

  it("should error for invalid level", () => {
    const { stderr, exitCode } = runCli(["template", "shell", "--level", "invalid"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Invalid level"));
  });

  it("should error for invalid format", () => {
    const { stderr, exitCode } = runCli(["template", "shell", "--format", "invalid"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Invalid format"));
  });

  it("should apply permissions with apply command", () => {
    const tempDir = createTempDir();

    try {
      const { stdout, exitCode } = runCli(
        ["apply", "shell", "--level", "standard"],
        { cwd: tempDir }
      );

      assert.equal(exitCode, 0);
      assert.ok(stdout.includes("Created:") || stdout.includes("Updated:"));

      // Verify file was created
      const settingsPath = path.join(tempDir, ".claude", "settings.json");
      assert.ok(existsSync(settingsPath));

      const content = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      assert.ok(content.permissions);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe("CLI - Analyze Command", () => {
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

  it("should analyze current directory by default", () => {
    // Create a simple Node.js project
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const { stdout, exitCode } = runCli(["analyze"], { cwd: tempDir });

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Project Analysis"));
    assert.ok(stdout.includes("nodejs"));
    assert.ok(stdout.includes("shell"));
  });

  it("should analyze specified directory", () => {
    fs.writeFileSync(path.join(tempDir, "requirements.txt"), "flask");

    const { stdout, exitCode } = runCli(["analyze", tempDir]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("python"));
  });

  it("should detect multiple project types", () => {
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
    fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");
    fs.mkdirSync(path.join(tempDir, ".git"));

    const { stdout, exitCode } = runCli(["analyze", tempDir]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("nodejs"));
    assert.ok(stdout.includes("python"));
    assert.ok(stdout.includes("git"));
  });

  it("should show suggested command", () => {
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const { stdout, exitCode } = runCli(["analyze", tempDir]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Apply Permissions:"));
    assert.ok(stdout.includes("cc-permissions apply"));
  });
});

describe("CLI - List Command", () => {
  it("should list available templates", () => {
    const { stdout, exitCode } = runCli(["list"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("Available Templates"));
    assert.ok(stdout.includes("shell"));
    assert.ok(stdout.includes("nodejs"));
    assert.ok(stdout.includes("python"));
  });
});

describe("CLI - Unknown Options", () => {
  it("should error on --h (not a valid long option)", () => {
    const { stderr, exitCode } = runCli(["--h"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown option"));
    assert.ok(stderr.includes("--h"));
    assert.ok(stderr.includes("--help"));
  });

  it("should error on --hlep (typo for --help)", () => {
    const { stderr, exitCode } = runCli(["--hlep"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown option"));
    assert.ok(stderr.includes("--hlep"));
    assert.ok(stderr.includes("--help"));
  });

  it("should suggest --version for --versiom", () => {
    const { stderr, exitCode } = runCli(["--versiom"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown option"));
    assert.ok(stderr.includes("--versiom"));
    assert.ok(stderr.includes("--version"));
  });

  it("should error without suggestion for distant typos", () => {
    const { stderr, exitCode } = runCli(["--zzz"]);

    assert.equal(exitCode, 1);
    assert.ok(stderr.includes("Unknown option"));
    assert.ok(stderr.includes("--zzz"));
    // Should NOT suggest anything (distance > 2)
    assert.ok(!stderr.includes("Did you mean"));
  });

  it("should still allow valid flags without command", () => {
    const { stdout, exitCode } = runCli(["--help"]);

    assert.equal(exitCode, 0);
    assert.ok(stdout.includes("cc-permissions"));
    assert.ok(stdout.includes("Usage:"));
  });

  it("should not validate unknown options when a command is present", () => {
    const { stdout, exitCode } = runCli(["template", "shell", "--format", "json"]);

    assert.equal(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions);
  });
});

describe("CLI - Edge Cases", () => {
  it("should handle mixed case template names", () => {
    const { stdout, exitCode } = runCli(["template", "SHELL", "--format", "json"]);

    assert.equal(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions);
  });

  it("should handle short flags", () => {
    const { stdout, exitCode } = runCli(["template", "shell", "-l", "restrictive", "-f", "json"]);

    assert.equal(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions);
  });

  it("should handle whitespace in template names (comma-separated)", () => {
    const { stdout, exitCode } = runCli(["template", "shell, git", "--format", "json"]);

    assert.equal(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(parsed.permissions);
  });
});
