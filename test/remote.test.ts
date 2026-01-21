import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { rmSync, existsSync } from "node:fs";
import { tmpdir, homedir } from "node:os";

// Import remote module functions directly
import {
  getTemplateNames,
  getCdnBaseUrl,
  fetchManifest,
  fetchTemplate,
  fetchAndCacheTemplates,
  checkForUpdates,
  type TemplateManifest,
} from "../src/templates/remote.js";

/**
 * Create a valid test manifest
 */
function createValidManifest(): TemplateManifest {
  return {
    version: "1.0.0",
    categories: [
      { name: "Core", templates: ["shell", "git"] },
      { name: "Languages", templates: ["nodejs", "python"] },
    ],
  };
}

describe("remote module - utility functions", () => {
  describe("getTemplateNames", () => {
    it("should extract flat list from categorized manifest", () => {
      const manifest = createValidManifest();
      const names = getTemplateNames(manifest);

      assert.deepEqual(names, ["shell", "git", "nodejs", "python"]);
    });

    it("should handle empty categories", () => {
      const manifest: TemplateManifest = { version: "1.0.0", categories: [] };
      const names = getTemplateNames(manifest);

      assert.deepEqual(names, []);
    });

    it("should handle single category", () => {
      const manifest: TemplateManifest = {
        version: "1.0.0",
        categories: [{ name: "Single", templates: ["only"] }],
      };
      const names = getTemplateNames(manifest);

      assert.deepEqual(names, ["only"]);
    });

    it("should handle many categories", () => {
      const manifest: TemplateManifest = {
        version: "1.0.0",
        categories: [
          { name: "A", templates: ["a1", "a2"] },
          { name: "B", templates: ["b1"] },
          { name: "C", templates: ["c1", "c2", "c3"] },
        ],
      };
      const names = getTemplateNames(manifest);

      assert.deepEqual(names, ["a1", "a2", "b1", "c1", "c2", "c3"]);
    });

    it("should handle category with empty templates array", () => {
      const manifest: TemplateManifest = {
        version: "1.0.0",
        categories: [
          { name: "Empty", templates: [] },
          { name: "HasSome", templates: ["one"] },
        ],
      };
      const names = getTemplateNames(manifest);

      assert.deepEqual(names, ["one"]);
    });
  });

  describe("getCdnBaseUrl", () => {
    it("should return the CDN base URL", () => {
      const url = getCdnBaseUrl();

      assert.ok(typeof url === "string");
      assert.ok(url.length > 0);
      assert.ok(url.startsWith("https://"));
    });

    it("should include github reference", () => {
      const url = getCdnBaseUrl();

      assert.ok(url.includes("github"));
    });

    it("should include templates repository", () => {
      const url = getCdnBaseUrl();

      assert.ok(url.includes("cc-permissions-templates"));
    });
  });
});

describe("remote module - network functions (integration)", () => {
  // These tests make actual network requests
  // They test real-world behavior but may fail if network is unavailable
  const cacheBaseDir = path.join(homedir(), ".cc-permissions");

  describe("fetchManifest", () => {
    it("should fetch real manifest from CDN", async () => {
      try {
        const manifest = await fetchManifest();

        assert.ok(manifest.version);
        assert.ok(Array.isArray(manifest.categories));
        assert.ok(manifest.categories.length > 0);

        // Check structure
        for (const category of manifest.categories) {
          assert.ok(category.name);
          assert.ok(Array.isArray(category.templates));
        }
      } catch (error) {
        // Network may be unavailable - that's acceptable for integration tests
        const err = error as Error;
        if (err.message.includes("fetch") || err.message.includes("network")) {
          // Skip - network unavailable
          return;
        }
        throw error;
      }
    });

    it("should return manifest with version starting with 1", async () => {
      try {
        const manifest = await fetchManifest();

        // Version should be semver starting with 1 (since SUPPORTED_MAJOR_VERSION is 1)
        assert.ok(/^1\.\d+\.\d+/.test(manifest.version));
      } catch (error) {
        const err = error as Error;
        if (err.message.includes("fetch") || err.message.includes("network")) {
          return;
        }
        throw error;
      }
    });
  });

  describe("fetchTemplate", () => {
    it("should fetch real shell template from CDN", async () => {
      try {
        const content = await fetchTemplate("shell");

        assert.ok(content.length > 0);
        // Should be valid JSONC (may have comments)
        assert.ok(content.includes('"name"'));
        assert.ok(content.includes('"levels"'));
      } catch (error) {
        const err = error as Error;
        if (err.message.includes("fetch") || err.message.includes("network")) {
          return;
        }
        throw error;
      }
    });
  });

  describe("fetchAndCacheTemplates", () => {
    it("should fetch and cache templates", async () => {
      try {
        const result = await fetchAndCacheTemplates();

        if (result.success) {
          assert.ok(result.manifest);
          assert.ok(existsSync(cacheBaseDir));
          assert.ok(existsSync(path.join(cacheBaseDir, "templates")));
          assert.ok(existsSync(path.join(cacheBaseDir, "cache-meta.json")));
        } else {
          // May fail due to network - check error is sensible
          assert.ok(result.error);
        }
      } catch (error) {
        const err = error as Error;
        if (err.message.includes("fetch") || err.message.includes("network")) {
          return;
        }
        throw error;
      }
    });
  });

  describe("checkForUpdates", () => {
    it("should check for updates without crashing", async () => {
      try {
        const result = await checkForUpdates();

        // Should return a valid result structure
        assert.ok(typeof result.hasUpdates === "boolean");

        if (result.error) {
          // Network error - acceptable
          assert.ok(typeof result.error === "string");
        } else {
          // If successful, should have version info
          assert.ok(result.latestVersion || result.currentVersion !== undefined);
        }
      } catch (error) {
        const err = error as Error;
        if (err.message.includes("fetch") || err.message.includes("network")) {
          return;
        }
        throw error;
      }
    });
  });
});

describe("remote module - type validation", () => {
  describe("TemplateManifest type", () => {
    it("should accept valid manifest structure", () => {
      const manifest: TemplateManifest = {
        version: "1.0.0",
        categories: [{ name: "Test", templates: ["a", "b"] }],
      };

      // Type check - if this compiles, the type is correct
      assert.equal(manifest.version, "1.0.0");
      assert.equal(manifest.categories[0].name, "Test");
    });

    it("should work with getTemplateNames", () => {
      const manifest: TemplateManifest = {
        version: "1.2.3",
        categories: [
          { name: "Core", templates: ["shell"] },
          { name: "Dev", templates: ["nodejs", "python"] },
        ],
      };

      const names = getTemplateNames(manifest);
      assert.deepEqual(names, ["shell", "nodejs", "python"]);
    });
  });
});
