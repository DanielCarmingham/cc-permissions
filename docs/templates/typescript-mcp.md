# typescript-mcp

TypeScript MCP Server tools for type checking and compilation

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__typescript__check_types` | Run type checking |
| `mcp__typescript__get_diagnostics` | Get TypeScript diagnostics |
| `mcp__typescript__validate_syntax` | Validate TypeScript syntax |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__typescript__compile_typescript` | Compile TypeScript code |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__typescript__create_tsconfig` | Create tsconfig.json |
| `mcp__typescript__update_tsconfig` | Update tsconfig.json |
