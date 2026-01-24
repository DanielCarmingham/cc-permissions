# nodejs

Node.js, npm, pnpm, yarn, and bun

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `npm list` | List installed packages |
| `npm ls` | List installed packages (alias) |
| `npm outdated` | Check for outdated packages |
| `npm view` | View package info |
| `npm info` | View package info (alias) |
| `npm search` | Search npm registry |
| `npm help` | Get npm help |
| `npm config list` | List npm config |
| `npm audit` | Run security audit |
| `node -v` | Check Node version |
| `node --version` | Check Node version |
| `node -e` | Evaluate Node expression |
| `node -p` | Print Node evaluation |
| `npx -v` | Check npx version |
| `pnpm list` | List installed packages (pnpm) |
| `pnpm ls` | List installed packages (pnpm alias) |
| `pnpm outdated` | Check for outdated packages (pnpm) |
| `yarn list` | List installed packages (yarn) |
| `yarn info` | View package info (yarn) |
| `yarn outdated` | Check for outdated packages (yarn) |
| `bun --version` | Check Bun version |
| `bun pm ls` | List installed packages (bun) |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `npm run` | Run npm scripts |
| `npm test` | Run tests |
| `npm start` | Start the application |
| `npm build` | Build the project |
| `npm run build` | Build the project |
| `npm run dev` | Run dev server |
| `npm run lint` | Run linter |
| `npm run format` | Run formatter |
| `npm run test` | Run tests |
| `npm run watch` | Run in watch mode |
| `npm exec` | Execute package binary |
| `npx` | Execute npm packages |
| `pnpm run` | Run pnpm scripts |
| `pnpm test` | Run tests (pnpm) |
| `pnpm build` | Build the project (pnpm) |
| `pnpm dev` | Run dev server (pnpm) |
| `pnpm exec` | Execute package binary (pnpm) |
| `pnpm dlx` | Execute without install (pnpm) |
| `yarn run` | Run yarn scripts |
| `yarn test` | Run tests (yarn) |
| `yarn build` | Build the project (yarn) |
| `yarn dev` | Run dev server (yarn) |
| `yarn dlx` | Execute without install (yarn) |
| `bun run` | Run bun scripts |
| `bun test` | Run tests (bun) |
| `bun build` | Build the project (bun) |
| `bunx` | Execute bun packages |
| `node` | Run Node.js scripts |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `npm install` | Install packages |
| `npm i` | Install packages (alias) |
| `npm ci` | Clean install |
| `npm uninstall` | Uninstall packages |
| `npm update` | Update packages |
| `npm link` | Link packages locally |
| `npm publish` | Publish to npm |
| `npm init` | Initialize new project |
| `npm pack` | Create package tarball |
| `npm cache clean` | Clean npm cache |
| `pnpm install` | Install packages (pnpm) |
| `pnpm add` | Add packages (pnpm) |
| `pnpm remove` | Remove packages (pnpm) |
| `pnpm update` | Update packages (pnpm) |
| `yarn install` | Install packages (yarn) |
| `yarn add` | Add packages (yarn) |
| `yarn remove` | Remove packages (yarn) |
| `yarn upgrade` | Upgrade packages (yarn) |
| `bun install` | Install packages (bun) |
| `bun add` | Add packages (bun) |
| `bun remove` | Remove packages (bun) |
| `bun update` | Update packages (bun) |
