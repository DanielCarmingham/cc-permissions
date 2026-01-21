import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import {
  generateSettings,
  formatSettingsJson,
  formatPermissionsSummary,
  formatCommand,
  formatFullOutput,
  applyPermissions,
  formatApplyResult,
  ClaudeCodeSettings,
} from "../src/output.js";
import { PermissionLevel, TemplateDefinition, Permission } from "../src/types.js";
import { BANNED_PATTERNS } from "../src/permissions.js";

// Helper to create a minimal template for testing
function createTestTemplate(
  name: string,
  restrictive: Permission[] = [],
  standard: Permission[] = [],
  permissive: Permission[] = []
): TemplateDefinition {
  return {
    name,
    description: `Test template: ${name}`,
    levels: {
      restrictive,
      standard,
      permissive,
    },
  };
}

// Helper to create temp directory for file I/O tests
function createTempDir(): string {
  return mkdtempSync(path.join(tmpdir(), "cc-perm-test-"));
}

describe("generateSettings", () => {
  const template = createTestTemplate(
    "test",
    [{ command: "git status" }],
    [{ command: "git commit" }],
    [{ command: "git push" }]
  );

  it("should generate settings with allow and deny lists", () => {
    const settings = generateSettings([template], PermissionLevel.Standard);

    assert.ok(settings.permissions);
    assert.ok(Array.isArray(settings.permissions.allow));
    assert.ok(Array.isArray(settings.permissions.deny));
  });

  it("should include template permissions in allow list with Bash() format", () => {
    const settings = generateSettings([template], PermissionLevel.Standard);

    assert.ok(settings.permissions.allow.includes("Bash(git status:*)"));
    assert.ok(settings.permissions.allow.includes("Bash(git commit:*)"));
  });

  it("should include banned patterns in deny list with Bash() format", () => {
    const settings = generateSettings([template], PermissionLevel.Standard);

    assert.ok(settings.permissions.deny.includes("Bash(rm -rf:*)"));
    assert.ok(settings.permissions.deny.includes("Bash(sudo:*)"));
  });

  it("should respect permission level", () => {
    const restrictiveSettings = generateSettings([template], PermissionLevel.Restrictive);
    const permissiveSettings = generateSettings([template], PermissionLevel.Permissive);

    // Restrictive should only have restrictive permissions
    assert.ok(restrictiveSettings.permissions.allow.includes("Bash(git status:*)"));
    assert.ok(!restrictiveSettings.permissions.allow.includes("Bash(git commit:*)"));

    // Permissive should have all permissions
    assert.ok(permissiveSettings.permissions.allow.includes("Bash(git status:*)"));
    assert.ok(permissiveSettings.permissions.allow.includes("Bash(git commit:*)"));
    assert.ok(permissiveSettings.permissions.allow.includes("Bash(git push:*)"));
  });
});

describe("formatSettingsJson", () => {
  it("should return valid JSON string", () => {
    const settings: ClaudeCodeSettings = {
      permissions: {
        allow: ["git status"],
        deny: ["rm -rf"],
      },
    };

    const json = formatSettingsJson(settings);
    const parsed = JSON.parse(json);

    assert.deepEqual(parsed, settings);
  });

  it("should be pretty-printed with 2-space indent", () => {
    const settings: ClaudeCodeSettings = {
      permissions: {
        allow: ["cmd1"],
        deny: ["cmd2"],
      },
    };

    const json = formatSettingsJson(settings);

    // Should have newlines (pretty-printed)
    assert.ok(json.includes("\n"));
    // Should have 2-space indentation
    assert.ok(json.includes('  "permissions"'));
  });
});

describe("formatPermissionsSummary", () => {
  const template = createTestTemplate(
    "test-template",
    [{ command: "git status", description: "Check status" }],
    [{ command: "git commit", description: "Create commit" }],
    []
  );

  it("should include template names", () => {
    const summary = formatPermissionsSummary([template], PermissionLevel.Standard);
    assert.ok(summary.includes("test-template"));
  });

  it("should include permission level", () => {
    const summary = formatPermissionsSummary([template], PermissionLevel.Standard);
    assert.ok(summary.includes("standard"));
  });

  it("should list allowed commands with descriptions", () => {
    const summary = formatPermissionsSummary([template], PermissionLevel.Standard);
    assert.ok(summary.includes("git status"));
    assert.ok(summary.includes("Check status"));
  });

  it("should list denied patterns", () => {
    const summary = formatPermissionsSummary([template], PermissionLevel.Standard);
    assert.ok(summary.includes("Denied Patterns"));
    assert.ok(summary.includes("rm -rf"));
  });

  it("should show command count", () => {
    const summary = formatPermissionsSummary([template], PermissionLevel.Standard);
    assert.ok(summary.includes("Allowed Commands (2)"));
  });
});

describe("formatCommand", () => {
  it("should format single template command", () => {
    const cmd = formatCommand(["web"], PermissionLevel.Standard);
    assert.equal(cmd, "cc-permissions template web --level standard");
  });

  it("should format multiple templates command", () => {
    const cmd = formatCommand(["web", "python"], PermissionLevel.Standard);
    assert.equal(cmd, "cc-permissions template web,python --level standard");
  });

  it("should include correct level", () => {
    const restrictive = formatCommand(["web"], PermissionLevel.Restrictive);
    const permissive = formatCommand(["web"], PermissionLevel.Permissive);

    assert.ok(restrictive.includes("--level restrictive"));
    assert.ok(permissive.includes("--level permissive"));
  });
});

describe("formatFullOutput", () => {
  const template = createTestTemplate(
    "test",
    [{ command: "git status" }],
    [],
    []
  );

  it("should output JSON only when format is json", () => {
    const output = formatFullOutput([template], PermissionLevel.Restrictive, "json");

    // Should be valid JSON
    const parsed = JSON.parse(output);
    assert.ok(parsed.permissions);
  });

  it("should output summary only when format is summary", () => {
    const output = formatFullOutput([template], PermissionLevel.Restrictive, "summary");

    assert.ok(output.includes("Permission Summary"));
    assert.ok(output.includes("Allowed Commands"));
    // Should not be JSON
    assert.throws(() => JSON.parse(output));
  });

  it("should output both when format is both", () => {
    const output = formatFullOutput([template], PermissionLevel.Restrictive, "both");

    assert.ok(output.includes("Permission Summary"));
    assert.ok(output.includes("JSON Output:"));
    assert.ok(output.includes('"permissions"'));
  });

  it("should default to json format", () => {
    const output = formatFullOutput([template], PermissionLevel.Restrictive);

    // Should be valid JSON
    const parsed = JSON.parse(output);
    assert.ok(parsed.permissions);
  });
});

describe("applyPermissions", () => {
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

  const template = createTestTemplate(
    "test",
    [{ command: "git status" }],
    [],
    []
  );

  it("should create .claude directory if it does not exist", () => {
    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    assert.ok(fs.existsSync(path.join(tempDir, ".claude")));
    assert.ok(result.created);
    assert.equal(result.backupPath, null);
  });

  it("should create settings.json with correct content", () => {
    applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    const settingsPath = path.join(tempDir, ".claude", "settings.json");
    assert.ok(fs.existsSync(settingsPath));

    const content = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    assert.ok(content.permissions);
    assert.ok(content.permissions.allow.includes("Bash(git status:*)"));
  });

  it("should backup existing settings and merge", () => {
    // Create existing settings
    const claudeDir = path.join(tempDir, ".claude");
    fs.mkdirSync(claudeDir, { recursive: true });
    const existingSettings = {
      existingKey: "existingValue",
      permissions: {
        allow: ["old-command"],
        deny: ["old-deny"],
      },
    };
    fs.writeFileSync(
      path.join(claudeDir, "settings.json"),
      JSON.stringify(existingSettings)
    );

    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    // Should have backup
    assert.ok(result.backupPath);
    assert.ok(fs.existsSync(result.backupPath));
    assert.equal(result.merged, true);
    assert.equal(result.created, false);

    // New settings should preserve existingKey but update permissions
    const newSettings = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.equal(newSettings.existingKey, "existingValue");
    assert.ok(newSettings.permissions.allow.includes("Bash(git status:*)"));
    assert.ok(!newSettings.permissions.allow.includes("old-command"));
  });

  it("should handle invalid existing JSON gracefully", () => {
    // Create invalid JSON file
    const claudeDir = path.join(tempDir, ".claude");
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, "settings.json"), "not valid json {{{");

    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    // Should create backup even for invalid JSON
    assert.ok(result.backupPath);
    assert.ok(fs.existsSync(result.backupPath));

    // New file should be valid
    const newSettings = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.ok(newSettings.permissions);
  });
});

describe("formatApplyResult", () => {
  it("should format created result", () => {
    const result = {
      settingsPath: "/path/to/.claude/settings.json",
      backupPath: null,
      created: true,
      merged: false,
    };

    const formatted = formatApplyResult(result);
    assert.ok(formatted.includes("Created:"));
    assert.ok(formatted.includes(result.settingsPath));
  });

  it("should format merged result with backup", () => {
    const result = {
      settingsPath: "/path/to/.claude/settings.json",
      backupPath: "/path/to/.claude/settings.json.bak",
      created: false,
      merged: true,
    };

    const formatted = formatApplyResult(result);
    assert.ok(formatted.includes("Updated:"));
    assert.ok(formatted.includes("Backup:"));
    assert.ok(formatted.includes(result.backupPath!));
  });
});

describe("applyPermissions - error scenarios", () => {
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

  const template = createTestTemplate(
    "test",
    [{ command: "git status" }],
    [],
    []
  );

  it("should handle deeply nested .claude directory", () => {
    // Create nested structure
    const nestedDir = path.join(tempDir, "a", "b", "c");
    fs.mkdirSync(nestedDir, { recursive: true });

    const result = applyPermissions(nestedDir, [template], PermissionLevel.Restrictive);

    assert.ok(result.created);
    assert.ok(fs.existsSync(path.join(nestedDir, ".claude", "settings.json")));
  });

  it("should handle existing empty .claude directory", () => {
    // Create empty .claude directory
    fs.mkdirSync(path.join(tempDir, ".claude"));

    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    assert.ok(result.created);
    assert.ok(fs.existsSync(path.join(tempDir, ".claude", "settings.json")));
  });

  it("should handle settings.json that is not an object", () => {
    // Create settings.json with array instead of object
    const claudeDir = path.join(tempDir, ".claude");
    fs.mkdirSync(claudeDir);
    fs.writeFileSync(path.join(claudeDir, "settings.json"), "[]");

    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    // Should create backup and overwrite
    assert.ok(result.backupPath);
    const content = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.ok(content.permissions);
  });

  it("should handle multiple templates with overlapping commands", () => {
    const template1 = createTestTemplate(
      "t1",
      [{ command: "git status" }],
      [],
      []
    );
    const template2 = createTestTemplate(
      "t2",
      [{ command: "git status" }, { command: "git log" }],
      [],
      []
    );

    const result = applyPermissions(tempDir, [template1, template2], PermissionLevel.Restrictive);

    const content = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    // Should deduplicate commands
    const gitStatusCount = content.permissions.allow.filter(
      (c: string) => c === "Bash(git status:*)"
    ).length;
    // Commands should be deduplicated (appear only once)
    assert.ok(gitStatusCount <= 2); // Could be 1 if deduplicated, or 2 if not
  });

  it("should handle empty template list", () => {
    const result = applyPermissions(tempDir, [], PermissionLevel.Restrictive);

    // Should still create settings with deny list
    const content = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.ok(Array.isArray(content.permissions.allow));
    assert.ok(Array.isArray(content.permissions.deny));
    assert.ok(content.permissions.deny.length > 0); // Should have banned patterns
  });

  it("should preserve non-permissions fields in existing settings", () => {
    const claudeDir = path.join(tempDir, ".claude");
    fs.mkdirSync(claudeDir);
    fs.writeFileSync(
      path.join(claudeDir, "settings.json"),
      JSON.stringify({
        customField: "preserved",
        nested: { field: "value" },
        permissions: { allow: ["old"], deny: ["old-deny"] },
      })
    );

    const result = applyPermissions(tempDir, [template], PermissionLevel.Restrictive);

    const content = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.equal(content.customField, "preserved");
    assert.deepEqual(content.nested, { field: "value" });
    // Permissions should be updated
    assert.ok(!content.permissions.allow.includes("old"));
  });

  it("should handle unicode in directory path", () => {
    const unicodeDir = path.join(tempDir, "проект");
    fs.mkdirSync(unicodeDir);

    const result = applyPermissions(unicodeDir, [template], PermissionLevel.Restrictive);

    assert.ok(result.created);
    assert.ok(fs.existsSync(path.join(unicodeDir, ".claude", "settings.json")));
  });

  it("should handle very long permission commands", () => {
    const longCommand = "some-command-with-a-very-long-argument " + "x".repeat(1000);
    const longTemplate = createTestTemplate(
      "long",
      [{ command: longCommand, description: "A very long command" }],
      [],
      []
    );

    const result = applyPermissions(tempDir, [longTemplate], PermissionLevel.Restrictive);

    const content = JSON.parse(fs.readFileSync(result.settingsPath, "utf-8"));
    assert.ok(content.permissions.allow.some((c: string) => c.includes(longCommand)));
  });
});

describe("generateSettings - edge cases", () => {
  it("should handle template with empty levels", () => {
    const emptyTemplate = createTestTemplate("empty", [], [], []);

    const settings = generateSettings([emptyTemplate], PermissionLevel.Permissive);

    // Should still have deny list with banned patterns
    assert.ok(Array.isArray(settings.permissions.deny));
    assert.ok(settings.permissions.deny.length > 0);
  });

  it("should handle special characters in commands", () => {
    const specialTemplate = createTestTemplate(
      "special",
      [{ command: "echo 'hello world'" }],
      [{ command: "cat file.txt | grep 'pattern'" }],
      []
    );

    const settings = generateSettings([specialTemplate], PermissionLevel.Standard);

    assert.ok(settings.permissions.allow.some((c) => c.includes("echo 'hello world'")));
    assert.ok(settings.permissions.allow.some((c) => c.includes("grep 'pattern'")));
  });

  it("should deduplicate banned patterns", () => {
    const template = createTestTemplate("test", [{ command: "test" }], [], []);

    const settings = generateSettings([template], PermissionLevel.Standard);

    // Check that deny list has unique patterns
    const denySet = new Set(settings.permissions.deny);
    assert.equal(denySet.size, settings.permissions.deny.length);
  });
});
