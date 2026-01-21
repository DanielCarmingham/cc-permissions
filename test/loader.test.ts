import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  resetLoader,
  getTemplates,
  isInitialized,
} from "../src/templates/loader.js";

describe("loader module - basic operations", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  describe("isInitialized", () => {
    it("should return false before loading templates", () => {
      assert.equal(isInitialized(), false);
    });

    it("should return true after loading templates", () => {
      getTemplates();
      assert.equal(isInitialized(), true);
    });

    it("should return false after reset", () => {
      getTemplates();
      resetLoader();
      assert.equal(isInitialized(), false);
    });
  });

  describe("getTemplates", () => {
    it("should return templates on first call (lazy load)", () => {
      const templates = getTemplates();
      assert.ok(templates);
      assert.ok(typeof templates === "object");
    });

    it("should return same registry on subsequent calls", () => {
      const templates1 = getTemplates();
      const templates2 = getTemplates();
      assert.strictEqual(templates1, templates2);
    });
  });

  describe("resetLoader", () => {
    it("should reset loader state", () => {
      getTemplates();
      assert.ok(isInitialized());
      resetLoader();
      assert.equal(isInitialized(), false);
    });
  });
});

describe("loader module - template loading", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  describe("getTemplates", () => {
    it("should load expected templates", () => {
      const templates = getTemplates();

      // Should have common templates
      assert.ok(templates.shell);
      assert.ok(templates.nodejs);
      assert.ok(templates.python);
    });

    it("should load templates with proper structure", () => {
      const templates = getTemplates();
      const shell = templates.shell;

      assert.ok(shell);
      assert.equal(shell.name, "shell");
      assert.ok(shell.description);
      assert.ok(shell.levels.restrictive);
      assert.ok(shell.levels.standard);
      assert.ok(shell.levels.permissive);
    });

    it("should load templates with detection rules", () => {
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
  });
});

describe("loader module - template validation", () => {
  beforeEach(() => {
    resetLoader();
  });

  afterEach(() => {
    resetLoader();
  });

  it("should validate template structure", () => {
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

  it("should validate template name format", () => {
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
