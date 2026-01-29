import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  templates,
  getTemplate,
  getTemplates,
  listTemplateNames,
  listTemplates,
  resetLoader,
} from "../src/templates/index.js";

describe("templates", () => {
  after(() => {
    resetLoader();
  });

  describe("getTemplate", () => {
    it("should return existing templates by name", () => {
      const shell = getTemplate("shell");
      assert.ok(shell);
      assert.equal(shell.name, "shell");

      const nodejs = getTemplate("nodejs");
      assert.ok(nodejs);
      assert.equal(nodejs.name, "nodejs");

      const python = getTemplate("python");
      assert.ok(python);
      assert.equal(python.name, "python");

      const dotnet = getTemplate("dotnet");
      assert.ok(dotnet);
      assert.equal(dotnet.name, "dotnet");
    });

    it("should be case insensitive", () => {
      const shell1 = getTemplate("shell");
      const shell2 = getTemplate("SHELL");
      const shell3 = getTemplate("Shell");
      const shell4 = getTemplate("ShElL");

      assert.ok(shell1);
      assert.deepEqual(shell1, shell2);
      assert.deepEqual(shell2, shell3);
      assert.deepEqual(shell3, shell4);
    });

    it("should return undefined for non-existent templates", () => {
      assert.equal(getTemplate("nonexistent"), undefined);
      assert.equal(getTemplate(""), undefined);
      // These templates now exist, so we use other non-existent names
      assert.equal(getTemplate("foobar"), undefined);
      assert.equal(getTemplate("notatemplate"), undefined);
    });
  });

  describe("getTemplates", () => {
    it("should return found templates and track not found", () => {
      const result = getTemplates(["shell", "nodejs", "invalid"]);

      assert.equal(result.found.length, 2);
      assert.equal(result.notFound.length, 1);
      assert.ok(result.notFound.includes("invalid"));

      const names = result.found.map((t) => t.name);
      assert.ok(names.includes("shell"));
      assert.ok(names.includes("nodejs"));
    });

    it("should handle all valid templates", () => {
      const result = getTemplates(["shell", "nodejs", "python", "dotnet"]);

      assert.equal(result.found.length, 4);
      assert.equal(result.notFound.length, 0);
    });

    it("should handle all invalid templates", () => {
      const result = getTemplates(["invalid1", "invalid2", "invalid3"]);

      assert.equal(result.found.length, 0);
      assert.equal(result.notFound.length, 3);
    });

    it("should handle empty input", () => {
      const result = getTemplates([]);

      assert.equal(result.found.length, 0);
      assert.equal(result.notFound.length, 0);
    });

    it("should be case insensitive", () => {
      const result = getTemplates(["SHELL", "NodeJS", "PYTHON"]);

      assert.equal(result.found.length, 3);
      assert.equal(result.notFound.length, 0);
    });
  });

  describe("listTemplateNames", () => {
    it("should return all template names", () => {
      const names = listTemplateNames();

      assert.ok(Array.isArray(names));
      assert.ok(names.includes("shell"));
      assert.ok(names.includes("nodejs"));
      assert.ok(names.includes("python"));
      assert.ok(names.includes("dotnet"));
    });

    it("should return at least 4 templates", () => {
      const names = listTemplateNames();
      assert.ok(names.length >= 4);
    });
  });

  describe("listTemplates", () => {
    it("should return template objects with name and description", () => {
      const templateList = listTemplates();

      assert.ok(Array.isArray(templateList));
      assert.ok(templateList.length >= 4);

      for (const item of templateList) {
        assert.ok(typeof item.name === "string");
        assert.ok(typeof item.description === "string");
        assert.ok(item.name.length > 0);
        assert.ok(item.description.length > 0);
      }
    });

    it("should include all expected templates", () => {
      const templateList = listTemplates();
      const names = templateList.map((t) => t.name);

      assert.ok(names.includes("shell"));
      assert.ok(names.includes("nodejs"));
      assert.ok(names.includes("python"));
      assert.ok(names.includes("dotnet"));
    });
  });

  describe("template structure validation", () => {
    it("all templates should have required fields", () => {
      for (const [name, template] of Object.entries(templates())) {
        // Check basic structure
        assert.ok(template.name, `Template "${name}" should have a name`);
        assert.ok(template.description, `Template "${name}" should have a description`);
        assert.ok(template.levels, `Template "${name}" should have levels`);

        // Check levels structure
        assert.ok(
          Array.isArray(template.levels.restrictive),
          `Template "${name}" should have restrictive level as array`
        );
        assert.ok(
          Array.isArray(template.levels.standard),
          `Template "${name}" should have standard level as array`
        );
        assert.ok(
          Array.isArray(template.levels.permissive),
          `Template "${name}" should have permissive level as array`
        );
      }
    });

    it("all permissions should have command field", () => {
      for (const [name, template] of Object.entries(templates())) {
        const allPerms = [
          ...template.levels.restrictive,
          ...template.levels.standard,
          ...template.levels.permissive,
        ];

        for (const perm of allPerms) {
          assert.ok(
            typeof perm.command === "string" && perm.command.length > 0,
            `Template "${name}" has permission without command`
          );
        }
      }
    });

    it("git template should have basic git commands", () => {
      const git = getTemplate("git");
      assert.ok(git);

      const allCommands = [
        ...git.levels.restrictive,
        ...git.levels.standard,
        ...git.levels.permissive,
      ].map((p) => p.command);

      assert.ok(allCommands.includes("git status"));
      assert.ok(allCommands.includes("git log"));
      assert.ok(allCommands.includes("git diff"));
    });

    it("nodejs template should have npm commands", () => {
      const nodejs = getTemplate("nodejs");
      assert.ok(nodejs);

      const allCommands = [
        ...nodejs.levels.restrictive,
        ...nodejs.levels.standard,
        ...nodejs.levels.permissive,
      ].map((p) => p.command);

      // Check for npm-related commands
      const hasNpmCommands = allCommands.some((cmd) => cmd.includes("npm"));
      assert.ok(hasNpmCommands, "nodejs template should include npm commands");
    });

    it("python template should have python commands", () => {
      const python = getTemplate("python");
      assert.ok(python);

      const allCommands = [
        ...python.levels.restrictive,
        ...python.levels.standard,
        ...python.levels.permissive,
      ].map((p) => p.command);

      // Check for python-related commands
      const hasPythonCommands = allCommands.some(
        (cmd) => cmd.includes("python") || cmd.includes("pip") || cmd.includes("pytest")
      );
      assert.ok(hasPythonCommands, "Python template should include python/pip commands");
    });

    it("dotnet template should have dotnet commands", () => {
      const dotnet = getTemplate("dotnet");
      assert.ok(dotnet);

      const allCommands = [
        ...dotnet.levels.restrictive,
        ...dotnet.levels.standard,
        ...dotnet.levels.permissive,
      ].map((p) => p.command);

      // Check for dotnet-related commands
      const hasDotnetCommands = allCommands.some((cmd) => cmd.includes("dotnet"));
      assert.ok(hasDotnetCommands, "Dotnet template should include dotnet commands");
    });

    it("shell template should have basic shell commands", () => {
      const shell = getTemplate("shell");
      assert.ok(shell);

      const allCommands = [
        ...shell.levels.restrictive,
        ...shell.levels.standard,
        ...shell.levels.permissive,
      ].map((p) => p.command);

      assert.ok(allCommands.includes("ls"), "Shell template should include ls");
      assert.ok(allCommands.includes("cat"), "Shell template should include cat");
      assert.ok(allCommands.includes("pwd"), "Shell template should include pwd");
    });

    it("yarn template should have yarn commands", () => {
      const yarn = getTemplate("yarn");
      assert.ok(yarn);

      const allCommands = [
        ...yarn.levels.restrictive,
        ...yarn.levels.standard,
        ...yarn.levels.permissive,
      ].map((p) => p.command);

      const hasYarnCommands = allCommands.some((cmd) => cmd.includes("yarn"));
      assert.ok(hasYarnCommands, "yarn template should include yarn commands");
      assert.ok(allCommands.includes("yarn list"), "yarn template should include yarn list");
      assert.ok(allCommands.includes("yarn install"), "yarn template should include yarn install");
    });

    it("pnpm template should have pnpm commands", () => {
      const pnpm = getTemplate("pnpm");
      assert.ok(pnpm);

      const allCommands = [
        ...pnpm.levels.restrictive,
        ...pnpm.levels.standard,
        ...pnpm.levels.permissive,
      ].map((p) => p.command);

      const hasPnpmCommands = allCommands.some((cmd) => cmd.includes("pnpm"));
      assert.ok(hasPnpmCommands, "pnpm template should include pnpm commands");
      assert.ok(allCommands.includes("pnpm list"), "pnpm template should include pnpm list");
      assert.ok(allCommands.includes("pnpm install"), "pnpm template should include pnpm install");
    });

    it("bun template should have bun commands", () => {
      const bun = getTemplate("bun");
      assert.ok(bun);

      const allCommands = [
        ...bun.levels.restrictive,
        ...bun.levels.standard,
        ...bun.levels.permissive,
      ].map((p) => p.command);

      const hasBunCommands = allCommands.some((cmd) => cmd.includes("bun"));
      assert.ok(hasBunCommands, "bun template should include bun commands");
      assert.ok(allCommands.includes("bun --version"), "bun template should include bun --version");
      assert.ok(allCommands.includes("bun install"), "bun template should include bun install");
    });

    it("typescript template should have tsc commands", () => {
      const ts = getTemplate("typescript");
      assert.ok(ts);

      const allCommands = [
        ...ts.levels.restrictive,
        ...ts.levels.standard,
        ...ts.levels.permissive,
      ].map((p) => p.command);

      const hasTscCommands = allCommands.some((cmd) => cmd.includes("tsc"));
      assert.ok(hasTscCommands, "typescript template should include tsc commands");
      assert.ok(allCommands.includes("tsc --version"), "typescript template should include tsc --version");
      assert.ok(allCommands.includes("tsc --noEmit"), "typescript template should include tsc --noEmit");
    });

    it("typescript-mcp template should have MCP tools", () => {
      const tsMcp = getTemplate("typescript-mcp");
      assert.ok(tsMcp);

      const allCommands = [
        ...tsMcp.levels.restrictive,
        ...tsMcp.levels.standard,
        ...tsMcp.levels.permissive,
      ].map((p) => p.command);

      assert.ok(allCommands.includes("mcp__typescript__check_types"), "typescript-mcp should include check_types");
      assert.ok(allCommands.includes("mcp__typescript__compile_typescript"), "typescript-mcp should include compile_typescript");
    });

    it("azure-sql-mcp template should have Azure SQL MCP tools", () => {
      const azSqlMcp = getTemplate("azure-sql-mcp");
      assert.ok(azSqlMcp);

      const allCommands = [
        ...azSqlMcp.levels.restrictive,
        ...azSqlMcp.levels.standard,
        ...azSqlMcp.levels.permissive,
      ].map((p) => p.command);

      assert.ok(allCommands.includes("mcp__azmcp__azmcp_sql_db_list"), "azure-sql-mcp should include db list");
      assert.ok(allCommands.includes("mcp__azmcp__azmcp_sql_server_create"), "azure-sql-mcp should include server create");
    });

    it("azure-storage-mcp template should have Azure Storage MCP tools", () => {
      const azStorageMcp = getTemplate("azure-storage-mcp");
      assert.ok(azStorageMcp);

      const allCommands = [
        ...azStorageMcp.levels.restrictive,
        ...azStorageMcp.levels.standard,
        ...azStorageMcp.levels.permissive,
      ].map((p) => p.command);

      assert.ok(allCommands.includes("mcp__azmcp__azmcp_storage_account_get"), "azure-storage-mcp should include account get");
      assert.ok(allCommands.includes("mcp__azmcp__azmcp_storage_blob_upload"), "azure-storage-mcp should include blob upload");
    });
  });
});

describe("templates - synchronous loading", () => {
  before(() => {
    resetLoader();
  });

  after(() => {
    resetLoader();
  });

  it("should load templates synchronously via lazy loading", () => {
    const registry = templates();

    assert.ok(registry);
    assert.ok(registry.shell);
    assert.ok(registry.nodejs);
    assert.ok(registry.python);
    assert.ok(registry.dotnet);
  });
});
