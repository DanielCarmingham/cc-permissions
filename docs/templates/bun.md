# bun

Bun runtime and package manager

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `bun --version` | Check Bun version |
| `bun pm ls` | List installed packages |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `bun run` | Run bun scripts |
| `bun test` | Run tests |
| `bun build` | Build the project |
| `bunx` | Execute bun packages |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `bun install` | Install packages |
| `bun add` | Add packages |
| `bun remove` | Remove packages |
| `bun update` | Update packages |
