import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir, homedir } from "node:os";

// Import cache functions
import {
  ensureCacheDir,
  cacheExists,
  getCacheMeta,
  saveCacheMeta,
  getCacheTemplatesDir,
  cacheTemplate,
  readCachedTemplate,
  listCachedTemplateFiles,
  clearCache,
  getCacheInfo,
  isCacheStale,
  type CacheMeta,
} from "../src/templates/cache.js";

// Note: These tests operate on the real cache directory (~/.cc-permissions)
// We save and restore its state to avoid affecting user data

describe("cache module", () => {
  // Path to backup existing cache
  const cacheBaseDir = path.join(homedir(), ".cc-permissions");
  const backupDir = path.join(tmpdir(), `cc-perm-cache-backup-${Date.now()}`);
  let hadExistingCache = false;

  beforeEach(() => {
    // Backup existing cache if it exists
    if (existsSync(cacheBaseDir)) {
      hadExistingCache = true;
      fs.cpSync(cacheBaseDir, backupDir, { recursive: true });
      rmSync(cacheBaseDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test cache
    if (existsSync(cacheBaseDir)) {
      rmSync(cacheBaseDir, { recursive: true, force: true });
    }
    // Restore original cache if it existed
    if (hadExistingCache && existsSync(backupDir)) {
      fs.cpSync(backupDir, cacheBaseDir, { recursive: true });
      rmSync(backupDir, { recursive: true, force: true });
    }
    hadExistingCache = false;
  });

  describe("ensureCacheDir", () => {
    it("should create cache directory if it does not exist", () => {
      assert.ok(!existsSync(cacheBaseDir));
      ensureCacheDir();
      assert.ok(existsSync(cacheBaseDir));
      assert.ok(existsSync(getCacheTemplatesDir()));
    });

    it("should not throw if directory already exists", () => {
      ensureCacheDir();
      assert.doesNotThrow(() => ensureCacheDir());
    });
  });

  describe("cacheExists", () => {
    it("should return false when cache directory does not exist", () => {
      assert.equal(cacheExists(), false);
    });

    it("should return false when cache directory is empty", () => {
      ensureCacheDir();
      assert.equal(cacheExists(), false);
    });

    it("should return true when templates exist in cache", () => {
      ensureCacheDir();
      cacheTemplate("test", '{"name": "test"}');
      assert.equal(cacheExists(), true);
    });
  });

  describe("cacheTemplate and readCachedTemplate", () => {
    it("should cache and read templates", () => {
      const content = '{"name": "test", "description": "Test template"}';
      cacheTemplate("test", content);
      const read = readCachedTemplate("test");
      assert.equal(read, content);
    });

    it("should return null for non-existent template", () => {
      ensureCacheDir();
      const read = readCachedTemplate("nonexistent");
      assert.equal(read, null);
    });
  });

  describe("listCachedTemplateFiles", () => {
    it("should return empty array when no cache", () => {
      const files = listCachedTemplateFiles();
      assert.deepEqual(files, []);
    });

    it("should list cached template files", () => {
      cacheTemplate("test1", "{}");
      cacheTemplate("test2", "{}");
      const files = listCachedTemplateFiles();
      assert.ok(files.includes("test1.jsonc"));
      assert.ok(files.includes("test2.jsonc"));
    });
  });

  describe("cache metadata", () => {
    it("should return null when no metadata exists", () => {
      const meta = getCacheMeta();
      assert.equal(meta, null);
    });

    it("should save and read metadata", () => {
      const meta: CacheMeta = {
        lastUpdated: new Date().toISOString(),
        version: "1",
        templates: ["test1", "test2"],
      };
      saveCacheMeta(meta);
      const read = getCacheMeta();
      assert.deepEqual(read, meta);
    });
  });

  describe("clearCache", () => {
    it("should report when cache does not exist", () => {
      const result = clearCache();
      assert.equal(result.cleared, false);
      assert.ok(result.message.includes("does not exist"));
    });

    it("should clear existing cache", () => {
      ensureCacheDir();
      cacheTemplate("test", "{}");
      assert.ok(cacheExists());

      const result = clearCache();
      assert.ok(result.cleared);
      assert.ok(!existsSync(cacheBaseDir));
    });
  });

  describe("getCacheInfo", () => {
    it("should return info when no cache exists", () => {
      const info = getCacheInfo();
      assert.equal(info.exists, false);
      assert.equal(info.templateCount, 0);
      assert.equal(info.lastUpdated, null);
      assert.equal(info.version, null);
    });

    it("should return correct info for populated cache", () => {
      cacheTemplate("test1", "{}");
      cacheTemplate("test2", "{}");
      saveCacheMeta({
        lastUpdated: "2024-01-01T00:00:00.000Z",
        version: "2",
        templates: ["test1", "test2"],
      });

      const info = getCacheInfo();
      assert.equal(info.exists, true);
      assert.equal(info.templateCount, 2);
      assert.equal(info.lastUpdated, "2024-01-01T00:00:00.000Z");
      assert.equal(info.version, "2");
    });
  });

  describe("isCacheStale", () => {
    it("should return true when no metadata exists", () => {
      ensureCacheDir();
      assert.equal(isCacheStale(), true);
    });

    it("should return false for fresh cache", () => {
      saveCacheMeta({
        lastUpdated: new Date().toISOString(),
        version: "1",
        templates: [],
      });
      assert.equal(isCacheStale(), false);
    });

    it("should return true for old cache", () => {
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago
      saveCacheMeta({
        lastUpdated: oldDate.toISOString(),
        version: "1",
        templates: [],
      });
      assert.equal(isCacheStale(24 * 60 * 60 * 1000), true); // 24 hour max age
    });

    it("should respect custom max age", () => {
      const recentDate = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      saveCacheMeta({
        lastUpdated: recentDate.toISOString(),
        version: "1",
        templates: [],
      });
      assert.equal(isCacheStale(1 * 60 * 1000), true); // 1 minute max age
      assert.equal(isCacheStale(10 * 60 * 1000), false); // 10 minute max age
    });
  });
});
