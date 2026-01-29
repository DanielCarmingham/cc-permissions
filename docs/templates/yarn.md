# yarn

Yarn package manager

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `yarn list` | List installed packages |
| `yarn info` | View package info |
| `yarn outdated` | Check for outdated packages |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `yarn run` | Run yarn scripts |
| `yarn test` | Run tests |
| `yarn build` | Build the project |
| `yarn dev` | Run dev server |
| `yarn dlx` | Execute without install |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `yarn install` | Install packages |
| `yarn add` | Add packages |
| `yarn remove` | Remove packages |
| `yarn upgrade` | Upgrade packages |
