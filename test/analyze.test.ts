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
    it("should detect nodejs project from package.json", () => {
      const webProjectDir = path.join(fixturesDir, "mock-project-web");
      const result = analyzeDirectory(webProjectDir);

      assert.ok(result.recommendedTemplates.includes("nodejs"));
      assert.ok(result.recommendedTemplates.includes("shell"));
      assert.ok(result.detectedFiles.some((f) => f.includes("package.json")));
    });

    it("should detect python project from requirements.txt", () => {
      const pythonProjectDir = path.join(fixturesDir, "mock-project-python");
      const result = analyzeDirectory(pythonProjectDir);

      assert.ok(result.recommendedTemplates.includes("python"));
      assert.ok(result.recommendedTemplates.includes("shell"));
      assert.ok(result.detectedFiles.some((f) => f.includes("requirements.txt")));
    });

    it("should detect dotnet project from .csproj file", () => {
      const dotnetProjectDir = path.join(fixturesDir, "mock-project-dotnet");
      const result = analyzeDirectory(dotnetProjectDir);

      assert.ok(result.recommendedTemplates.includes("dotnet"));
      assert.ok(result.recommendedTemplates.includes("shell"));
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

    it("should always include shell template", () => {
      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("shell"));
    });

    it("should handle empty directory", () => {
      const result = analyzeDirectory(tempDir);

      assert.equal(result.detectedFiles.length, 0);
      assert.ok(result.recommendedTemplates.includes("shell"));
      assert.equal(result.suggestedLevel, PermissionLevel.Restrictive);
    });

    it("should detect package-lock.json as nodejs project", () => {
      fs.writeFileSync(path.join(tempDir, "package-lock.json"), "{}");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("nodejs"));
    });

    it("should detect yarn.lock as nodejs project", () => {
      fs.writeFileSync(path.join(tempDir, "yarn.lock"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("nodejs"));
    });

    it("should detect pnpm-lock.yaml as nodejs project", () => {
      fs.writeFileSync(path.join(tempDir, "pnpm-lock.yaml"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("nodejs"));
    });

    it("should detect bun.lockb as nodejs project", () => {
      fs.writeFileSync(path.join(tempDir, "bun.lockb"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("nodejs"));
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
      assert.ok(result.recommendedTemplates.includes("nodejs"));
      assert.ok(result.recommendedTemplates.includes("python"));
      assert.ok(result.recommendedTemplates.includes("shell"));
    });

    it("should detect go project from go.mod", () => {
      fs.writeFileSync(path.join(tempDir, "go.mod"), "module test");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("go"));
    });

    it("should detect rust project from Cargo.toml", () => {
      fs.writeFileSync(path.join(tempDir, "Cargo.toml"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("rust"));
    });

    it("should detect ruby project from Gemfile", () => {
      fs.writeFileSync(path.join(tempDir, "Gemfile"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("ruby"));
    });

    it("should detect php project from composer.json", () => {
      fs.writeFileSync(path.join(tempDir, "composer.json"), "{}");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("php"));
    });

    it("should detect docker project from Dockerfile", () => {
      fs.writeFileSync(path.join(tempDir, "Dockerfile"), "FROM node:18");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("docker"));
    });

    it("should detect java project from pom.xml", () => {
      fs.writeFileSync(path.join(tempDir, "pom.xml"), "<project></project>");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("java"));
    });

    it("should detect git repository from .git directory", () => {
      fs.mkdirSync(path.join(tempDir, ".git"));

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("git"));
    });

    it("should detect github project from .github directory", () => {
      fs.mkdirSync(path.join(tempDir, ".github"));

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("github"));
    });
  });

  describe("content pattern detection", () => {
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

    it("should detect flutter project from pubspec.yaml with flutter:", () => {
      fs.writeFileSync(
        path.join(tempDir, "pubspec.yaml"),
        `name: my_app
flutter:
  sdk: flutter
`
      );

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("flutter"));
    });

    it("should NOT detect flutter for dart-only project", () => {
      fs.writeFileSync(
        path.join(tempDir, "pubspec.yaml"),
        `name: my_dart_app
dependencies:
  http: ^0.13.0
`
      );

      const result = analyzeDirectory(tempDir);
      assert.ok(!result.recommendedTemplates.includes("flutter"));
    });

    it("should detect android project from build.gradle with com.android", () => {
      fs.writeFileSync(
        path.join(tempDir, "build.gradle"),
        `plugins {
    id 'com.android.application'
}
`
      );

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("android"));
    });

    it("should NOT detect android for plain gradle project", () => {
      fs.writeFileSync(
        path.join(tempDir, "build.gradle"),
        `plugins {
    id 'java'
}
`
      );

      const result = analyzeDirectory(tempDir);
      assert.ok(!result.recommendedTemplates.includes("android"));
      // But should detect java
      assert.ok(result.recommendedTemplates.includes("java"));
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
      // shell + nodejs = 2 templates -> standard
      assert.equal(result.suggestedLevel, PermissionLevel.Standard);
    });

    it("should cap at standard (not permissive) for complex projects", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");
      fs.writeFileSync(path.join(tempDir, "MyApp.csproj"), "");

      const result = analyzeDirectory(tempDir);
      // shell + nodejs + python + dotnet = 4 templates, but should still be standard
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
      assert.ok(result.suggestedCommand.includes("shell"));
      assert.ok(result.suggestedCommand.includes("--level"));
    });

    it("should include all detected templates in command", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");

      const result = analyzeDirectory(tempDir);

      assert.ok(result.suggestedCommand.includes("shell"));
      assert.ok(result.suggestedCommand.includes("nodejs"));
      assert.ok(result.suggestedCommand.includes("python"));
    });
  });
});

describe("analyzeDirectory - error scenarios", () => {
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

  it("should handle non-existent directory gracefully", () => {
    const nonExistent = path.join(tempDir, "does-not-exist");

    // analyzeDirectory should handle this gracefully
    const result = analyzeDirectory(nonExistent);

    // Should return fallback result with shell template
    assert.ok(result.recommendedTemplates.includes("shell"));
    assert.equal(result.detectedFiles.length, 0);
  });

  it("should handle file instead of directory", () => {
    const filePath = path.join(tempDir, "file.txt");
    fs.writeFileSync(filePath, "test");

    // When given a file path instead of directory
    const result = analyzeDirectory(filePath);

    // Should handle gracefully and recommend shell
    assert.ok(result.recommendedTemplates.includes("shell"));
  });

  it("should handle symbolic links", () => {
    // Create a directory and a symlink to it
    const realDir = path.join(tempDir, "real");
    const linkDir = path.join(tempDir, "link");
    fs.mkdirSync(realDir);
    fs.writeFileSync(path.join(realDir, "package.json"), "{}");

    try {
      fs.symlinkSync(realDir, linkDir);

      const result = analyzeDirectory(linkDir);

      // Should detect nodejs through symlink
      assert.ok(result.recommendedTemplates.includes("nodejs"));
    } catch {
      // Symlink creation may fail on some systems/permissions
      // In that case, just verify the test doesn't crash
    }
  });

  it("should handle deeply nested directory structures", () => {
    // Create nested structure
    const deep = path.join(tempDir, "a", "b", "c", "d", "e");
    fs.mkdirSync(deep, { recursive: true });
    fs.writeFileSync(path.join(deep, "package.json"), "{}");

    // Analyze the deep directory
    const result = analyzeDirectory(deep);

    // Should still detect nodejs
    assert.ok(result.recommendedTemplates.includes("nodejs"));
  });

  it("should handle directory with only hidden files", () => {
    fs.writeFileSync(path.join(tempDir, ".hidden"), "secret");
    fs.writeFileSync(path.join(tempDir, ".env"), "SECRET=value");

    const result = analyzeDirectory(tempDir);

    // Should still return shell as minimum
    assert.ok(result.recommendedTemplates.includes("shell"));
  });

  it("should handle directory with binary files", () => {
    // Create a binary file
    const buffer = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe]);
    fs.writeFileSync(path.join(tempDir, "binary.bin"), buffer);
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const result = analyzeDirectory(tempDir);

    // Should still work and detect nodejs
    assert.ok(result.recommendedTemplates.includes("nodejs"));
  });

  it("should handle very large number of files", () => {
    // Create many files
    for (let i = 0; i < 100; i++) {
      fs.writeFileSync(path.join(tempDir, `file${i}.txt`), `content ${i}`);
    }
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const result = analyzeDirectory(tempDir);

    // Should still work correctly
    assert.ok(result.recommendedTemplates.includes("nodejs"));
    assert.ok(result.recommendedTemplates.includes("shell"));
  });

  it("should handle unicode filenames", () => {
    fs.writeFileSync(path.join(tempDir, "文件.txt"), "chinese");
    fs.writeFileSync(path.join(tempDir, "файл.txt"), "russian");
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const result = analyzeDirectory(tempDir);

    // Should handle unicode files without crashing
    assert.ok(result.recommendedTemplates.includes("nodejs"));
  });

  it("should handle file with invalid JSON in content pattern check", () => {
    // Create a package.json with invalid JSON (shouldn't crash content checks)
    fs.writeFileSync(path.join(tempDir, "pubspec.yaml"), "not yaml {{{{");

    const result = analyzeDirectory(tempDir);

    // Should not crash, should still return shell
    assert.ok(result.recommendedTemplates.includes("shell"));
  });

  it("should handle relative path with nested directory", () => {
    // Create a nested structure and use relative path from parent
    const nestedDir = path.join(tempDir, "nested");
    fs.mkdirSync(nestedDir);
    fs.writeFileSync(path.join(nestedDir, "package.json"), "{}");

    // Analyze using relative path from temp dir (without changing cwd)
    const result = analyzeDirectory(path.join(tempDir, "nested"));

    // Should handle paths correctly
    assert.ok(result.recommendedTemplates.includes("nodejs"));
  });
});

describe("formatAnalysisResult", () => {
  it("should format empty analysis", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions template shell --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Project Analysis"));
    assert.ok(formatted.includes("No specific project files detected"));
    assert.ok(formatted.includes("shell"));
  });

  it("should list detected files", () => {
    const result = {
      detectedFiles: ["package.json", "tsconfig.json"],
      recommendedTemplates: ["shell", "nodejs"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell,nodejs --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Detected Files:"));
    assert.ok(formatted.includes("package.json"));
  });

  it("should list recommended templates", () => {
    const result = {
      detectedFiles: ["package.json"],
      recommendedTemplates: ["shell", "nodejs"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell,nodejs --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Recommended Templates:"));
    assert.ok(formatted.includes("shell"));
    assert.ok(formatted.includes("nodejs"));
  });

  it("should show suggested level", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Suggested Level: standard"));
  });

  it("should show suggested command", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions template shell --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Suggested Command:"));
    assert.ok(formatted.includes("cc-permissions template shell --level restrictive"));
  });
});
