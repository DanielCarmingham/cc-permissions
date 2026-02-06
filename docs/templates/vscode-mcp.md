# vscode-mcp

VS Code IDE MCP tools for Claude Code integration

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__ide__getDiagnostics` | Get language diagnostics from VS Code |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__ide__executeCode` | Execute Python code in Jupyter kernel |
