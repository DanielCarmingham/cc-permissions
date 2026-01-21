import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import {
  initializeTemplates,
  resetLoader,
  getTemplates,
  isInitialized,
  loadTemplatesSync,
} from "../src/templates/loader.js";

/**
 * Create a valid template JSONC content
 */
function createValidTemplateJsonc(name: string): string {
  return `{
  // This is a comment that should be stripped
  "name": "${name}",
  "description": "Test template for ${name}",
  "levels": {
    "restrictive": [
      { "command": "${name} --version", "description": "Check version" }
    ],
    "standard": [
      { "command": "${name} --version" },
      { "command": "${name} help" }
    ],
    "permissive": [
      { "command": "${name} *" }
    ]
  }
}`;
}

/**
 * Create a template with detection rules
 */
function createTemplateWithDetection(name: string): string {
  return `{
  "name": "${name}",
  "description": "Template with detection",
  "detection": {
    "files": ["${name}.config", "${name}.json"],
    "directories": ["${name}_modules"],
    "contentPatterns": [
      { "file": "package.json", "contains": "\\"${name}\\":" }
    ],
    "always": false
  },
  "levels": {
    "restrictive": [{ "command": "${name} check" }],
    "standard": [{ "command": "${name} run" }],
    "permissive": [{ "command": "${name} *" }]
  }
}`;
}

describe("loader module - basic operations", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  describe("isInitialized", () => {
    it("should return false before initialization", () => {
      assert.equal(isInitialized(), false);
    });

    it("should return true after initialization", async () => {
      await initializeTemplates({ offline: true });
      assert.equal(isInitialized(), true);
    });

    it("should return false after reset", async () => {
      await initializeTemplates({ offline: true });
      resetLoader();
      assert.equal(isInitialized(), false);
    });
  });

  describe("getTemplates", () => {
    it("should throw when not initialized", () => {
      assert.throws(() => getTemplates(), /not initialized/);
    });

    it("should return templates after initialization", async () => {
      await initializeTemplates({ offline: true });
      const templates = getTemplates();
      assert.ok(templates);
      assert.ok(typeof templates === "object");
    });
  });

  describe("resetLoader", () => {
    it("should reset all loader state", async () => {
      await initializeTemplates({ offline: true });
      assert.ok(isInitialized());
      resetLoader();
      assert.equal(isInitialized(), false);
      assert.throws(() => getTemplates(), /not initialized/);
    });
  });
});

describe("loader module - initialization", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  describe("initializeTemplates", () => {
    it("should initialize successfully in offline mode", async () => {
      const result = await initializeTemplates({ offline: true });
      assert.ok(result.success);
      assert.ok(result.templateCount > 0);
      assert.ok(isInitialized());
    });

    it("should return proper structure on success", async () => {
      const result = await initializeTemplates({ offline: true });

      assert.ok("success" in result);
      assert.ok("source" in result);
      assert.ok("templateCount" in result);
      assert.ok(typeof result.success === "boolean");
      assert.ok(typeof result.templateCount === "number");
    });

    it("should load expected templates in offline mode", async () => {
      await initializeTemplates({ offline: true });
      const templates = getTemplates();

      // Should have common templates
      assert.ok(templates.shell);
      assert.ok(templates.nodejs);
      assert.ok(templates.python);
    });
  });

  describe("loadTemplatesSync", () => {
    it("should load templates synchronously", () => {
      const templates = loadTemplatesSync();

      assert.ok(templates);
      assert.ok(Object.keys(templates).length > 0);
    });

    it("should load expected templates synchronously", () => {
      const templates = loadTemplatesSync();

      assert.ok(templates.shell);
      assert.ok(templates.nodejs);
    });
  });
});

describe("loader module - template validation", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  describe("valid templates", () => {
    it("should load template with all required fields", async () => {
      const result = await initializeTemplates({ offline: true });
      assert.ok(result.success);

      const templates = getTemplates();
      const shell = templates.shell;

      assert.ok(shell);
      assert.equal(shell.name, "shell");
      assert.ok(shell.description);
      assert.ok(shell.levels.restrictive);
      assert.ok(shell.levels.standard);
      assert.ok(shell.levels.permissive);
    });

    it("should load templates with detection rules", async () => {
      await initializeTemplates({ offline: true });
      const templates = getTemplates();

      // Find a template with detection rules
      const templateWithDetection = Object.values(templates).find((t) => t.detection);

      if (templateWithDetection) {
        assert.ok(templateWithDetection.detection);
        // Detection should have at least one type of rule
        const d = templateWithDetection.detection;
        const hasRules = d.files || d.directories || d.contentPatterns || d.always;
        assert.ok(hasRules);
      }
    });

    it("should validate template structure", async () => {
      await initializeTemplates({ offline: true });
      const templates = getTemplates();

      for (const [name, template] of Object.entries(templates)) {
        // All templates should have required fields
        assert.ok(template.name, `Template "${name}" should have name`);
        assert.ok(template.description, `Template "${name}" should have description`);
        assert.ok(template.levels, `Template "${name}" should have levels`);
        assert.ok(
          Array.isArray(template.levels.restrictive),
          `Template "${name}" should have restrictive array`
        );
        assert.ok(
          Array.isArray(template.levels.standard),
          `Template "${name}" should have standard array`
        );
        assert.ok(
          Array.isArray(template.levels.permissive),
          `Template "${name}" should have permissive array`
        );

        // All permissions should have command
        const allPerms = [
          ...template.levels.restrictive,
          ...template.levels.standard,
          ...template.levels.permissive,
        ];
        for (const perm of allPerms) {
          assert.ok(perm.command, `Permission in "${name}" should have command`);
        }
      }
    });
  });
});

describe("loader module - JSONC parsing", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  it("should handle JSONC with comments", () => {
    // Test JSONC parsing through the loadTemplatesSync which reads bundled templates
    const templates = loadTemplatesSync();

    // If templates loaded successfully, JSONC parsing works
    assert.ok(Object.keys(templates).length > 0);
  });

  it("should validate template name format", async () => {
    await initializeTemplates({ offline: true });
    const templates = getTemplates();

    for (const [, template] of Object.entries(templates)) {
      // Name should be lowercase with optional hyphens
      assert.ok(
        /^[a-z][a-z0-9-]*$/.test(template.name),
        `Template name "${template.name}" should match naming convention`
      );
    }
  });
});
