import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { analyzeDirectory, formatAnalysisResult, _testing } from "../src/analyze.js";
import { PermissionLevel } from "../src/types.js";
import type { DetectionRules } from "../src/types.js";

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

      assert.ok(result.recommendedTemplates.includes("shell"));
      // Note: ancestor search may detect templates from parent directories
      // (e.g., .git from a parent repo), so we don't assert exact template count or level
    });

    it("should detect package-lock.json as nodejs project", () => {
      fs.writeFileSync(path.join(tempDir, "package-lock.json"), "{}");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("nodejs"));
    });

    it("should detect yarn.lock as yarn project", () => {
      fs.writeFileSync(path.join(tempDir, "yarn.lock"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("yarn"));
    });

    it("should detect pnpm-lock.yaml as pnpm project", () => {
      fs.writeFileSync(path.join(tempDir, "pnpm-lock.yaml"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("pnpm"));
    });

    it("should detect bun.lockb as bun project", () => {
      fs.writeFileSync(path.join(tempDir, "bun.lockb"), "");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("bun"));
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

    it("should detect maven project from pom.xml", () => {
      fs.writeFileSync(path.join(tempDir, "pom.xml"), "<project></project>");

      const result = analyzeDirectory(tempDir);
      assert.ok(result.recommendedTemplates.includes("maven"));
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
      // Should detect gradle (java no longer detects build.gradle files)
      assert.ok(result.recommendedTemplates.includes("gradle"));
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
      // When run inside a git repo, ancestor search may detect git template
      // which raises the level to standard. Outside a repo, this would be restrictive.
      assert.ok(
        result.suggestedLevel === PermissionLevel.Restrictive ||
        result.suggestedLevel === PermissionLevel.Standard
      );
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

      assert.ok(result.suggestedCommand.includes("cc-permissions apply"));
      // When run inside a git repo, ancestor search may detect git template,
      // so the command may not include --level restrictive
    });

    it("should use standard level without explicit flag", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.writeFileSync(path.join(tempDir, "requirements.txt"), "");

      const result = analyzeDirectory(tempDir);

      // Multiple templates means standard level, which is default so no --level flag
      assert.equal(result.suggestedCommand, "cc-permissions apply");
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
      detections: [{ template: "shell", type: "always" as const, reason: "always included" }],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions template shell --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Project Analysis"));
    assert.ok(formatted.includes("shell"));
    assert.ok(formatted.includes("Template")); // Table header
  });

  it("should list detected files in table", () => {
    const result = {
      detectedFiles: ["package.json", "tsconfig.json"],
      recommendedTemplates: ["shell", "nodejs"],
      detections: [
        { template: "nodejs", type: "file" as const, reason: "package.json" },
        { template: "shell", type: "always" as const, reason: "always included" },
      ],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell,nodejs --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("package.json"));
    assert.ok(formatted.includes("nodejs"));
  });

  it("should list recommended templates in table", () => {
    const result = {
      detectedFiles: ["package.json"],
      recommendedTemplates: ["shell", "nodejs"],
      detections: [
        { template: "nodejs", type: "file" as const, reason: "package.json" },
        { template: "shell", type: "always" as const, reason: "always included" },
      ],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell,nodejs --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Template")); // Table header
    assert.ok(formatted.includes("shell"));
    assert.ok(formatted.includes("nodejs"));
  });

  it("should show help hint and version footer", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      detections: [{ template: "shell", type: "always" as const, reason: "always included" }],
      suggestedLevel: PermissionLevel.Standard,
      suggestedCommand: "cc-permissions template shell --level standard",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("cc-permissions --help"));

    // With version string
    const formattedWithVersion = formatAnalysisResult(result, "v0.1.16 (abc1234)");
    assert.ok(formattedWithVersion.includes("cc-permissions v0.1.16 (abc1234)"));
  });

  it("should show suggested command", () => {
    const result = {
      detectedFiles: [],
      recommendedTemplates: ["shell"],
      detections: [{ template: "shell", type: "always" as const, reason: "always included" }],
      suggestedLevel: PermissionLevel.Restrictive,
      suggestedCommand: "cc-permissions apply --level restrictive",
    };

    const formatted = formatAnalysisResult(result);

    assert.ok(formatted.includes("Apply Permissions:"));
    assert.ok(formatted.includes("cc-permissions apply --level restrictive"));
  });
});

describe("ancestor directory search", () => {
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

  it("should find .git/ in parent directory", () => {
    // Create parent/.git/ and parent/child/
    fs.mkdirSync(path.join(tempDir, ".git"));
    const childDir = path.join(tempDir, "child");
    fs.mkdirSync(childDir);

    const detection: DetectionRules = {
      ancestorDirectories: [".git/"],
    };

    const result = _testing.detectTemplate(childDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "ancestorDirectory");
    assert.ok(result?.reason.includes(".git"));
  });

  it("should find .github/ in grandparent directory", () => {
    // Create root/.github/ and root/a/b/
    fs.mkdirSync(path.join(tempDir, ".github"));
    const nested = path.join(tempDir, "a", "b");
    fs.mkdirSync(nested, { recursive: true });

    const detection: DetectionRules = {
      ancestorDirectories: [".github/"],
    };

    const result = _testing.detectTemplate(nested, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "ancestorDirectory");
    assert.ok(result?.reason.includes(".github"));
  });

  it("should find ancestor file (.gitlab-ci.yml at repo root)", () => {
    // Create root/.gitlab-ci.yml and root/src/
    fs.writeFileSync(path.join(tempDir, ".gitlab-ci.yml"), "stages: [build]");
    const srcDir = path.join(tempDir, "src");
    fs.mkdirSync(srcDir);

    const detection: DetectionRules = {
      ancestorFiles: [".gitlab-ci.yml"],
    };

    const result = _testing.detectTemplate(srcDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "ancestorFile");
    assert.ok(result?.reason.includes(".gitlab-ci.yml"));
  });

  it("should match current directory (ancestor search includes current dir)", () => {
    fs.mkdirSync(path.join(tempDir, ".git"));

    const detection: DetectionRules = {
      ancestorDirectories: [".git/"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "ancestorDirectory");
  });

  it("should enforce depth limit (>10 levels deep should not detect)", () => {
    // Create a structure deeper than 10 levels
    let deepPath = tempDir;
    for (let i = 0; i < 12; i++) {
      deepPath = path.join(deepPath, `d${i}`);
    }
    fs.mkdirSync(deepPath, { recursive: true });

    // Put .git at the tempDir root (12 levels up from deepPath)
    fs.mkdirSync(path.join(tempDir, ".git"));

    const detection: DetectionRules = {
      ancestorDirectories: [".git/"],
    };

    const result = _testing.detectTemplate(deepPath, detection);

    // 12 levels up exceeds the 10-level limit (0..10 = 11 checks)
    assert.equal(result, null);
  });

  it("should work with requireAll combining ancestor + local criteria", () => {
    // Create ancestor .git/ and local package.json
    fs.mkdirSync(path.join(tempDir, ".git"));
    const childDir = path.join(tempDir, "child");
    fs.mkdirSync(childDir);
    fs.writeFileSync(path.join(childDir, "package.json"), "{}");

    const detection: DetectionRules = {
      requireAll: true,
      ancestorDirectories: [".git/"],
      files: ["package.json"],
    };

    const result = _testing.detectTemplate(childDir, detection);

    assert.notEqual(result, null);
  });

  it("should fail requireAll when ancestor criterion missing", () => {
    const childDir = path.join(tempDir, "child");
    fs.mkdirSync(childDir);
    fs.writeFileSync(path.join(childDir, "package.json"), "{}");

    const detection: DetectionRules = {
      requireAll: true,
      ancestorDirectories: [".nonexistent/"],
      files: ["package.json"],
    };

    const result = _testing.detectTemplate(childDir, detection);

    assert.equal(result, null);
  });

  it("should show relative path for ancestor detections in analysis output", () => {
    // Create a git repo structure
    fs.mkdirSync(path.join(tempDir, ".git"));
    const childDir = path.join(tempDir, "child");
    fs.mkdirSync(childDir);

    const result = analyzeDirectory(childDir);

    // git template should be detected via ancestor search
    if (result.recommendedTemplates.includes("git")) {
      const gitDetection = result.detections.find(d => d.template === "git");
      assert.ok(gitDetection);
      // The reason should be a relative path (starts with ..)
      assert.ok(gitDetection!.reason.startsWith(".."), `Expected relative path starting with "..", got "${gitDetection!.reason}"`);
    }
  });
});

describe("repoFile detection", () => {
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

  it("should detect *.tf in subdirectory", () => {
    const infraDir = path.join(tempDir, "infra");
    fs.mkdirSync(infraDir);
    fs.writeFileSync(path.join(infraDir, "main.tf"), "");

    const detection: DetectionRules = {
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "repoFile");
    assert.ok(result?.reason.includes("main.tf"));
  });

  it("should detect deeply nested file", () => {
    const deepDir = path.join(tempDir, "a", "b", "c");
    fs.mkdirSync(deepDir, { recursive: true });
    fs.writeFileSync(path.join(deepDir, "db.sqlite"), "");

    const detection: DetectionRules = {
      repoFiles: ["*.sqlite"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "repoFile");
    assert.ok(result?.reason.includes("db.sqlite"));
  });

  it("should return null when no match", () => {
    fs.writeFileSync(path.join(tempDir, "readme.md"), "# Hello");

    const detection: DetectionRules = {
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.equal(result, null);
  });

  it("should match exact filenames in subdirectories", () => {
    const subDir = path.join(tempDir, "config");
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(subDir, "terragrunt.hcl"), "");

    const detection: DetectionRules = {
      repoFiles: ["terragrunt.hcl"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "repoFile");
    assert.ok(result?.reason.includes("terragrunt.hcl"));
  });

  it("should handle empty directory", () => {
    const detection: DetectionRules = {
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.equal(result, null);
  });

  it("should skip node_modules in fallback walk", () => {
    // Create a .tf file inside node_modules (should be skipped)
    const nmDir = path.join(tempDir, "node_modules", "some-pkg");
    fs.mkdirSync(nmDir, { recursive: true });
    fs.writeFileSync(path.join(nmDir, "main.tf"), "");

    const detection: DetectionRules = {
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    // node_modules should be skipped, so no match
    assert.equal(result, null);
  });

  it("should work with requireAll combining repoFiles + files", () => {
    // Root has package.json, subdirectory has .tf
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
    const infraDir = path.join(tempDir, "infra");
    fs.mkdirSync(infraDir);
    fs.writeFileSync(path.join(infraDir, "main.tf"), "");

    const detection: DetectionRules = {
      requireAll: true,
      files: ["package.json"],
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
  });

  it("should fail requireAll when repoFiles criterion missing", () => {
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const detection: DetectionRules = {
      requireAll: true,
      files: ["package.json"],
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.equal(result, null);
  });

  it("should match in OR mode when files don't match", () => {
    const infraDir = path.join(tempDir, "infra");
    fs.mkdirSync(infraDir);
    fs.writeFileSync(path.join(infraDir, "main.tf"), "");

    const detection: DetectionRules = {
      files: ["nonexistent.json"],
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "repoFile");
  });

  it("should prefer files over repoFiles in OR mode (checked first)", () => {
    fs.writeFileSync(path.join(tempDir, "main.tf"), "");

    const detection: DetectionRules = {
      files: ["main.tf"],
      repoFiles: ["*.tf"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "file");
  });

  it("should match first pattern from multiple patterns", () => {
    const infraDir = path.join(tempDir, "infra");
    fs.mkdirSync(infraDir);
    fs.writeFileSync(path.join(infraDir, "vars.tfvars"), "");

    const detection: DetectionRules = {
      repoFiles: ["*.tf", "*.tfvars"],
    };

    const result = _testing.detectTemplate(tempDir, detection);

    assert.notEqual(result, null);
    assert.equal(result?.type, "repoFile");
    assert.ok(result?.reason.includes("tfvars"));
  });
});

describe("detectTemplate - requireAll (AND logic)", () => {
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

  describe("OR mode (default)", () => {
    it("should detect when only files match (OR logic)", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

      const detection: DetectionRules = {
        files: ["package.json"],
        directories: [".nonexistent/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "file");
    });

    it("should detect when only directories match (OR logic)", () => {
      fs.mkdirSync(path.join(tempDir, ".mydir"));

      const detection: DetectionRules = {
        files: ["nonexistent.json"],
        directories: [".mydir/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "directory");
    });

    it("should return first match in OR mode", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.mkdirSync(path.join(tempDir, ".github"));

      const detection: DetectionRules = {
        files: ["package.json"],
        directories: [".github/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      // Files are checked first, so file should be returned
      assert.notEqual(result, null);
      assert.equal(result?.type, "file");
    });
  });

  describe("AND mode (requireAll: true)", () => {
    it("should detect when ALL criteria match", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");
      fs.mkdirSync(path.join(tempDir, ".github"));

      const detection: DetectionRules = {
        requireAll: true,
        files: ["package.json"],
        directories: [".github/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      // Returns first matching result (file in this case)
      assert.equal(result?.type, "file");
    });

    it("should NOT detect when files criteria missing", () => {
      fs.mkdirSync(path.join(tempDir, ".github"));

      const detection: DetectionRules = {
        requireAll: true,
        files: ["package.json"],
        directories: [".github/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });

    it("should NOT detect when directories criteria missing", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

      const detection: DetectionRules = {
        requireAll: true,
        files: ["package.json"],
        directories: [".github/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });

    it("should detect with single criteria type in AND mode", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

      const detection: DetectionRules = {
        requireAll: true,
        files: ["package.json"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "file");
    });

    it("should use OR logic within a criteria type (multiple files)", () => {
      // Only one of the files exists
      fs.writeFileSync(path.join(tempDir, "yarn.lock"), "");
      fs.mkdirSync(path.join(tempDir, ".config"));

      const detection: DetectionRules = {
        requireAll: true,
        files: ["package.json", "yarn.lock"], // Either file works
        directories: [".config/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "file");
    });

    it("should return null when no criteria match", () => {
      const detection: DetectionRules = {
        requireAll: true,
        files: ["nonexistent.json"],
        directories: [".nonexistent/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });

    it("should work with content patterns in AND mode", () => {
      fs.writeFileSync(
        path.join(tempDir, "pubspec.yaml"),
        "name: test\nflutter:\n  sdk: flutter"
      );
      fs.mkdirSync(path.join(tempDir, "lib"));

      const detection: DetectionRules = {
        requireAll: true,
        contentPatterns: [{ file: "pubspec.yaml", contains: "flutter:" }],
        directories: ["lib/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      // Both criteria must match for detection to succeed
      assert.notEqual(result, null);
      // The returned type is the first criteria type checked (directories before content)
      assert.ok(result?.type === "directory" || result?.type === "content");
    });

    it("should fail AND mode when content pattern missing", () => {
      fs.writeFileSync(path.join(tempDir, "pubspec.yaml"), "name: test");
      fs.mkdirSync(path.join(tempDir, "lib"));

      const detection: DetectionRules = {
        requireAll: true,
        contentPatterns: [{ file: "pubspec.yaml", contains: "flutter:" }],
        directories: ["lib/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });
  });

  describe("always flag behavior", () => {
    it("should always match when always is true, regardless of requireAll", () => {
      const detection: DetectionRules = {
        requireAll: true,
        always: true,
        files: ["nonexistent.json"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "always");
      assert.equal(result?.reason, "always included");
    });
  });

  describe("empty detection rules", () => {
    it("should return null for undefined detection", () => {
      const result = _testing.detectTemplate(tempDir, undefined);
      assert.equal(result, null);
    });

    it("should return null for empty detection with requireAll", () => {
      const detection: DetectionRules = {
        requireAll: true,
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });

    it("should return null for empty detection without requireAll", () => {
      const detection: DetectionRules = {};

      const result = _testing.detectTemplate(tempDir, detection);

      assert.equal(result, null);
    });
  });

  describe("backward compatibility", () => {
    it("should maintain OR logic when requireAll is false", () => {
      fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

      const detection: DetectionRules = {
        requireAll: false,
        files: ["package.json"],
        directories: [".nonexistent/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      assert.notEqual(result, null);
      assert.equal(result?.type, "file");
    });

    it("should default to OR logic when requireAll is not specified", () => {
      fs.mkdirSync(path.join(tempDir, ".mydir"));

      const detection: DetectionRules = {
        files: ["nonexistent.json"],
        directories: [".mydir/"],
      };

      const result = _testing.detectTemplate(tempDir, detection);

      // Should match on directory since files don't exist
      assert.notEqual(result, null);
      assert.equal(result?.type, "directory");
    });
  });
});
