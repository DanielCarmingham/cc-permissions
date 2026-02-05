# typescript-mcp

TypeScript MCP Server tools for type checking, compilation, and code analysis

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__typescript__check_types` | Run type checking |
| `mcp__typescript__get_diagnostics` | Get TypeScript diagnostics |
| `mcp__typescript__validate_syntax` | Validate TypeScript syntax |
| `mcp__typescript__type-check` | Run TypeScript type checking |
| `mcp__typescript__lint-check` | Run linting checks |
| `mcp__typescript__suggest-improvements` | Suggest code improvements |
| `mcp__typescript__load-guidelines` | Load coding guidelines |

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
