# typescript

TypeScript compiler (tsc)

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `tsc --version` | Check TypeScript version |
| `tsc --help` | Show tsc help |
| `npx tsc --version` | Check TypeScript version (npx) |
| `tsc --noEmit` | Type-check without emitting |
| `npx tsc --noEmit` | Type-check without emitting (npx) |
| `tsc --showConfig` | Show resolved tsconfig |
| `npx tsc --showConfig` | Show resolved tsconfig (npx) |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `tsc` | Compile TypeScript |
| `npx tsc` | Compile TypeScript (npx) |
| `tsc --watch` | Compile in watch mode |
| `npx tsc --watch` | Compile in watch mode (npx) |
| `tsc --build` | Build project references |
| `npx tsc --build` | Build project references (npx) |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `tsc --init` | Initialize tsconfig.json |
| `npx tsc --init` | Initialize tsconfig.json (npx) |
