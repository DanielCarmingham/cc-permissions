import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BANNED_PATTERNS,
  parseLevel,
  getPermissionsForLevel,
  combineTemplatePermissions,
  generateClaudeCodePermissions,
  describeLevels,
} from "../src/permissions.js";
import { PermissionLevel, TemplateDefinition, Permission } from "../src/types.js";

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

describe("parseLevel", () => {
  it("should parse 'restrictive' correctly", () => {
    assert.equal(parseLevel("restrictive"), PermissionLevel.Restrictive);
  });

  it("should parse 'standard' correctly", () => {
    assert.equal(parseLevel("standard"), PermissionLevel.Standard);
  });

  it("should parse 'permissive' correctly", () => {
    assert.equal(parseLevel("permissive"), PermissionLevel.Permissive);
  });

  it("should be case insensitive", () => {
    assert.equal(parseLevel("RESTRICTIVE"), PermissionLevel.Restrictive);
    assert.equal(parseLevel("Standard"), PermissionLevel.Standard);
    assert.equal(parseLevel("PERMISSIVE"), PermissionLevel.Permissive);
    assert.equal(parseLevel("StAnDaRd"), PermissionLevel.Standard);
  });

  it("should handle whitespace", () => {
    assert.equal(parseLevel("  restrictive  "), PermissionLevel.Restrictive);
    assert.equal(parseLevel("\tstandard\n"), PermissionLevel.Standard);
  });

  it("should return null for invalid input", () => {
    assert.equal(parseLevel("invalid"), null);
    assert.equal(parseLevel(""), null);
    assert.equal(parseLevel("x"), null);
  });

  it("should accept prefix matches", () => {
    assert.equal(parseLevel("r"), PermissionLevel.Restrictive);
    assert.equal(parseLevel("res"), PermissionLevel.Restrictive);
    assert.equal(parseLevel("restrict"), PermissionLevel.Restrictive);
    assert.equal(parseLevel("s"), PermissionLevel.Standard);
    assert.equal(parseLevel("stan"), PermissionLevel.Standard);
    assert.equal(parseLevel("p"), PermissionLevel.Permissive);
    assert.equal(parseLevel("perm"), PermissionLevel.Permissive);
  });
});

describe("getPermissionsForLevel", () => {
  const template = createTestTemplate(
    "test",
    [{ command: "read-only", description: "Restrictive command" }],
    [{ command: "dev-workflow", description: "Standard command" }],
    [{ command: "full-access", description: "Permissive command" }]
  );

  it("should return only restrictive permissions for restrictive level", () => {
    const perms = getPermissionsForLevel(template, PermissionLevel.Restrictive);
    assert.equal(perms.length, 1);
    assert.equal(perms[0].command, "read-only");
  });

  it("should return restrictive + standard for standard level", () => {
    const perms = getPermissionsForLevel(template, PermissionLevel.Standard);
    assert.equal(perms.length, 2);
    const commands = perms.map((p) => p.command);
    assert.ok(commands.includes("read-only"));
    assert.ok(commands.includes("dev-workflow"));
  });

  it("should return all permissions for permissive level", () => {
    const perms = getPermissionsForLevel(template, PermissionLevel.Permissive);
    assert.equal(perms.length, 3);
    const commands = perms.map((p) => p.command);
    assert.ok(commands.includes("read-only"));
    assert.ok(commands.includes("dev-workflow"));
    assert.ok(commands.includes("full-access"));
  });

  it("should handle empty levels", () => {
    const emptyTemplate = createTestTemplate("empty");
    assert.deepEqual(getPermissionsForLevel(emptyTemplate, PermissionLevel.Permissive), []);
  });
});

describe("combineTemplatePermissions", () => {
  it("should combine permissions from multiple templates", () => {
    const template1 = createTestTemplate(
      "t1",
      [{ command: "cmd1" }],
      [{ command: "cmd2" }],
      []
    );
    const template2 = createTestTemplate(
      "t2",
      [{ command: "cmd3" }],
      [{ command: "cmd4" }],
      []
    );

    const perms = combineTemplatePermissions([template1, template2], PermissionLevel.Standard);
    assert.equal(perms.length, 4);
    const commands = perms.map((p) => p.command);
    assert.ok(commands.includes("cmd1"));
    assert.ok(commands.includes("cmd2"));
    assert.ok(commands.includes("cmd3"));
    assert.ok(commands.includes("cmd4"));
  });

  it("should deduplicate commands", () => {
    const template1 = createTestTemplate(
      "t1",
      [{ command: "git status", description: "Template 1 description" }],
      [],
      []
    );
    const template2 = createTestTemplate(
      "t2",
      [{ command: "git status", description: "Template 2 description" }],
      [],
      []
    );

    const perms = combineTemplatePermissions([template1, template2], PermissionLevel.Restrictive);
    assert.equal(perms.length, 1);
    assert.equal(perms[0].command, "git status");
  });

  it("should prefer permission with description when deduplicating", () => {
    const template1 = createTestTemplate("t1", [{ command: "git status" }], [], []);
    const template2 = createTestTemplate(
      "t2",
      [{ command: "git status", description: "Has description" }],
      [],
      []
    );

    const perms = combineTemplatePermissions([template1, template2], PermissionLevel.Restrictive);
    assert.equal(perms.length, 1);
    assert.equal(perms[0].description, "Has description");
  });

  it("should handle empty template array", () => {
    const perms = combineTemplatePermissions([], PermissionLevel.Standard);
    assert.deepEqual(perms, []);
  });
});

describe("generateClaudeCodePermissions", () => {
  it("should generate allow list from permissions with Bash() format", () => {
    const permissions: Permission[] = [
      { command: "git status" },
      { command: "npm test" },
      { command: "ls" },
    ];

    const result = generateClaudeCodePermissions(permissions);
    assert.deepEqual(result.allow, [
      "Bash(git status:*)",
      "Bash(npm test:*)",
      "Bash(ls:*)",
    ]);
  });

  it("should include all banned patterns in deny list with Bash() format", () => {
    const result = generateClaudeCodePermissions([]);
    assert.deepEqual(
      result.deny,
      BANNED_PATTERNS.map((p) => `Bash(${p.command}:*)`)
    );
  });

  it("should handle empty permissions", () => {
    const result = generateClaudeCodePermissions([]);
    assert.deepEqual(result.allow, []);
    assert.ok(result.deny.length > 0); // Should still have banned patterns
  });
});

describe("BANNED_PATTERNS", () => {
  it("should contain dangerous patterns", () => {
    const commands = BANNED_PATTERNS.map((p) => p.command);

    // Check for expected dangerous patterns
    assert.ok(commands.includes("rm -rf"), "Should ban recursive force delete");
    assert.ok(commands.includes("sudo"), "Should ban privilege escalation");
    assert.ok(commands.includes("chmod 777"), "Should ban world-writable permissions");
    assert.ok(commands.includes("curl * | bash"), "Should ban remote code execution");
    assert.ok(commands.includes("dd"), "Should ban low-level disk operations");
    assert.ok(commands.includes("mkfs"), "Should ban filesystem creation");
  });

  it("should have descriptions for all patterns", () => {
    for (const pattern of BANNED_PATTERNS) {
      assert.ok(
        pattern.description,
        `Pattern "${pattern.command}" should have a description`
      );
    }
  });

  it("should include variants of remote code execution", () => {
    const commands = BANNED_PATTERNS.map((p) => p.command);

    // curl/wget variants with bash/sh, with/without spaces (wildcards for URLs)
    assert.ok(commands.includes("curl * | bash"));
    assert.ok(commands.includes("curl *|bash"));
    assert.ok(commands.includes("curl * | sh"));
    assert.ok(commands.includes("curl *|sh"));
    assert.ok(commands.includes("wget * | bash"));
    assert.ok(commands.includes("wget *|bash"));
    assert.ok(commands.includes("wget * | sh"));
    assert.ok(commands.includes("wget *|sh"));
  });
});

describe("describeLevels", () => {
  it("should return a description string", () => {
    const description = describeLevels();
    assert.ok(typeof description === "string");
    assert.ok(description.length > 0);
  });

  it("should mention all levels", () => {
    const description = describeLevels();
    assert.ok(description.includes("restrictive"));
    assert.ok(description.includes("standard"));
    assert.ok(description.includes("permissive"));
  });
});
