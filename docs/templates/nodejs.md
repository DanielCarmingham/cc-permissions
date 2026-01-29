# nodejs

Node.js, npm, and npx

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
