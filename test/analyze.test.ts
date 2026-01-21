import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { analyzeDirectory, formatAnalysisResult } from "../src/analyze.js";
import { PermissionLevel } from "../src/types.js";

// Helper to create temp directory
function createTempDir(): string {
  return mkdtempSync(path.join(tmpdir(), "cc-perm-test-"));
}

// Get the path to test fixtures
const fixturesDir = path.join(import.meta.dirname, "fixtures");

describe("analyzeDirectory", () => {
  describe("with fixture directories", () => {
    it("should detect web project from package.json", () => {
      const webProjectDir = path.join(fixturesDir, "mock-project-web");
      const result = analyzeDirectory(webProjectDir);

      assert.ok(result.recommendedTemplates.includes("web"));
      assert.ok(result.recommendedTemplates.includes("general"));
      assert.ok(result.detectedFiles.some((f) => f.includes("package.json")));
    });

    it("should detect python project from requirements.txt", () => {
      const pythonProjectDir = path.join(fixturesDir, "mock-project-python");
      const result = analyzeDirectory(pythonProjectDir);

      assert.ok(result.recommendedTemplates.includes("python"));
      assert.ok(result.recommendedTemplates.includes("general"));
      assert.ok(result.detectedFiles.some((f) => f.includes("requirements.txt")));
    });

    it("should detect dotnet project from .csproj file", () => {
      const dotnetProjectDir = path.join(fixturesDir, "mock-project-dotnet");
      const result = analyzeDirectory(dotnetProjectDir);

      assert.ok(result.recommendedTemplates.includes("dotnet"));
      assert.ok(result.recommendedTemplates.includes("general"));
      assert.ok(result.detectedFiles.some((f) => f.includes(".csproj")));
    });
  });

  describe("with temp directories", () => {
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

    it("should always include general template", () => {
      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("general"));
    });

    it("should handle empty directory", () => {
      const result = analyzeDirectory(tempDir);

      assert.equal(result.detectedFiles.length, 0);
      assert.deepEqual(result.recommendedTemplates, ["general"]);
      assert.equal(result.suggestedLevel, PermissionLevel.Restrictive);
    });

    it("should detect package-lock.json as web project", () => {
      fs.writeFileSync(path.join(tempDir, "package-lock.json"), "{}");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("web"));
    });

    it("should detect yarn.lock as web project", () => {
      fs.writeFileSync(path.join(tempDir, "yarn.lock"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("web"));
    });

    it("should detect pnpm-lock.yaml as web project", () => {
      fs.writeFileSync(path.join(tempDir, "pnpm-lock.yaml"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("web"));
    });

    it("should detect bun.lockb as web project", () => {
      fs.writeFileSync(path.join(tempDir, "bun.lockb"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("web"));
    });

    it("should detect pyproject.toml as python project", () => {
      fs.writeFileSync(path.join(tempDir, "pyproject.toml"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("python"));
    });

    it("should detect setup.py as python project", () => {
      fs.writeFileSync(path.join(tempDir, "setup.py"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("python"));
    });

    it("should detect Pipfile as python project", () => {
      fs.writeFileSync(path.join(tempDir, "Pipfile"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("python"));
    });

    it("should detect poetry.lock as python project", () => {
      fs.writeFileSync(path.join(tempDir, "poetry.lock"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("python"));
    });

    it("should detect uv.lock as python project", () => {
      fs.writeFileSync(path.join(tempDir, "uv.lock"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("python"));
    });

    it("should detect .sln as dotnet project", () => {
      fs.writeFileSync(path.join(tempDir, "MyApp.sln"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("dotnet"));
    });

    it("should detect .fsproj as dotnet project", () => {
      fs.writeFileSync(path.join(tempDir, "MyApp.fsproj"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("dotnet"));
    });

    it("should detect nuget.config as dotnet project", () => {
      fs.writeFileSync(path.join(tempDir, "nuget.config"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("dotnet"));
    });

    it("should detect multiple project types", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("web"));
      assert.ok(result.recommendedTemplates.includes("python"));
      assert.ok(result.recommendedTemplates.includes("general"));
    });
  });

  describe("suggested level logic", () => {
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

    it("should suggest restrictive for empty/simple projects", () => {
      const result = analyzeDirectory(tempDir);
      assert.equal(result.suggestedLevel, PermissionLevel.Restrictive);
    });

    it("should suggest standard for projects with additional templates", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

      const result = analyzeDirectory(tempDir);
      // general + web = 2 templates -> standard
      assert.equal(result.suggestedLevel, PermissionLevel.Standard);
    });

    it("should cap at standard (not permissive) for complex projects", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");
      fs.writeFileSync(path.join(tempDir, "MyApp.csproj"), "");

      const result = analyzeDirectory(tempDir);
      // general + web + python + dotnet = 4 templates, but should still be standard
      assert.equal(result.suggestedLevel, PermissionLevel.Standard);
    });
  });

  describe("suggested command", () => {
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

    it("should generate correct command for single template", () => {
      const result = analyzeDirectory(tempDir);

      assert.ok(result.suggestedCommand.includes("cc-permissions template"));
      assert.ok(result.suggestedCommand.includes("general"));
      assert.ok(result.suggestedCommand.includes("--level"));
    });

    it("should include all detected templates in command", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");

      const result = analyzeDirectory(tempDir);

      assert.ok(result.suggestedCommand.includes("general"));
      assert.ok(result.suggestedCommand.includes("web"));
      assert.ok(result.suggestedCommand.includes("python"));
    });
  });
});

describe("formatAnalysisResult", () => {
  it("should format empty analysis", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["general"],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions template general --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Project Analysis"));
    assert.ok(formatted.includes("No specific project files detected"));
    assert.ok(formatted.includes("general"));
  });

  it("should list detected files", () => {
    const result = {
      detectedFiles: ["package.json", "tsconfig.json"],
      recommendedTemplates: ["general", "web"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template general,web --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Detected Files:"));
    assert.ok(formatted.includes("package.json"));
  });

  it("should list recommended templates", () => {
    const result = {
      detectedFiles: ["package.json"],
      recommendedTemplates: ["general", "web"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template general,web --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Recommended Templates:"));
    assert.ok(formatted.includes("general"));
    assert.ok(formatted.includes("web"));
  });

  it("should show suggested level", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["general"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template general --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Suggested Level: standard"));
  });

  it("should show suggested command", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["general"],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions template general --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Suggested Command:"));
    assert.ok(formatted.includes("cc-permissions template general --level restrictive"));
  });
});
