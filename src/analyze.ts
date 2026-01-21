import * as fs from "node:fs";
import * as path from "node:path";
import { AnalysisResult, PermissionLevel } from "./types.js";

// File patterns that indicate which templates to recommend
interface DetectionPattern {
  files: string[];
  template: string;
  description: string;
}

const DETECTION_PATTERNS: DetectionPattern[] = [
  // Web/Node.js
  {
    files: ["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"],
    template: "web",
    description: "Node.js/npm project detected",
  },
  // Python
  {
    files: [
      "pyproject.toml",
      "setup.py",
      "setup.cfg",
      "requirements.txt",
      "Pipfile",
      "poetry.lock",
      "uv.lock",
      "conda.yaml",
      "environment.yml",
    ],
    template: "python",
    description: "Python project detected",
  },
  // .NET
  {
    files: ["*.csproj", "*.fsproj", "*.vbproj", "*.sln", "nuget.config", "global.json"],
    template: "dotnet",
    description: ".NET project detected",
  },
];

/**
 * Check if a file exists in the directory.
 * Supports glob patterns like "*.csproj"
 */
function fileExists(dir: string, pattern: string): string | null {
  try {
    if (pattern.includes("*")) {
      // Simple glob matching
      const ext = pattern.replace("*", "");
      const files = fs.readdirSync(dir);
      const match = files.find((f) => f.endsWith(ext));
      return match ? path.join(dir, match) : null;
    } else {
      const filePath = path.join(dir, pattern);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Analyze a directory to recommend templates.
 */
export function analyzeDirectory(dir: string): AnalysisResult {
  const absoluteDir = path.resolve(dir);
  const detectedFiles: string[] = [];
  const recommendedTemplates: Set<string> = new Set();

  // Always recommend general template
  recommendedTemplates.add("general");

  // Check each detection pattern
  for (const pattern of DETECTION_PATTERNS) {
    for (const file of pattern.files) {
      const found = fileExists(absoluteDir, file);
      if (found) {
        detectedFiles.push(path.relative(absoluteDir, found) || file);
        recommendedTemplates.add(pattern.template);
        break; // Only need to detect one file per pattern
      }
    }
  }

  // Determine suggested level based on number of templates
  // More templates = more complex project = likely needs standard
  const templateCount = recommendedTemplates.size;
  let suggestedLevel: PermissionLevel;

  if (templateCount <= 1) {
    suggestedLevel = PermissionLevel.Restrictive;
  } else if (templateCount <= 3) {
    suggestedLevel = PermissionLevel.Standard;
  } else {
    suggestedLevel = PermissionLevel.Standard; // Stay at standard, don't auto-suggest permissive
  }

  const templateNames = Array.from(recommendedTemplates);
  const suggestedCommand = `cc-permissions template ${templateNames.join(",")} --level ${suggestedLevel}`;

  return {
    detectedFiles,
    recommendedTemplates: templateNames,
    suggestedLevel,
    suggestedCommand,
  };
}

/**
 * Format analysis result for display.
 */
export function formatAnalysisResult(result: AnalysisResult): string {
  const lines: string[] = [
    `Project Analysis`,
    `================`,
    ``,
  ];

  if (result.detectedFiles.length === 0) {
    lines.push(`No specific project files detected.`);
    lines.push(`Recommending general template only.`);
  } else {
    lines.push(`Detected Files:`);
    for (const file of result.detectedFiles) {
      lines.push(`  - ${file}`);
    }
  }

  lines.push(``);
  lines.push(`Recommended Templates:`);
  for (const template of result.recommendedTemplates) {
    lines.push(`  - ${template}`);
  }

  lines.push(``);
  lines.push(`Suggested Level: ${result.suggestedLevel}`);
  lines.push(``);
  lines.push(`Suggested Command:`);
  lines.push(`  ${result.suggestedCommand}`);

  return lines.join("\n");
}
