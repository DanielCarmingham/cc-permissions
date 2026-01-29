# pnpm

pnpm package manager

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `pnpm list` | List installed packages |
| `pnpm ls` | List installed packages (alias) |
| `pnpm outdated` | Check for outdated packages |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `pnpm run` | Run pnpm scripts |
| `pnpm test` | Run tests |
| `pnpm build` | Build the project |
| `pnpm dev` | Run dev server |
| `pnpm exec` | Execute package binary |
| `pnpm dlx` | Execute without install |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `pnpm install` | Install packages |
| `pnpm add` | Add packages |
| `pnpm remove` | Remove packages |
| `pnpm update` | Update packages |
