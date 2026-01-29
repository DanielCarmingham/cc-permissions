# cc-permissions

**Thoughtful permission configs for Claude Code without the container overhead.**

Claude Code users face a frustrating choice: run in a Docker sandbox with `--dangerously-skip-permissions` for convenience, or run natively and deal with constant permission prompts.

This tool offers a middle ground. Generate permission configurations tailored to your workflow, reducing prompt fatigue while maintaining control over what Claude Code can do.

> ⚠️ **Warning:** This approach is inherently less safe than a fully isolated environment. You're trading sandbox protection for convenience. ⚠️

## Getting started

The fastest way to get going:

```bash
npx cc-permissions apply
```

This analyzes your project, detects relevant templates, and applies permissions to `.claude/settings.json`.

Want to see what would be applied first?

```bash
npx cc-permissions
```

Or install globally to use without npx:

```bash
npm install -g cc-permissions
```
Then run: `cc-permissions apply`

Or use as slash command via a Claude Code plugin:

```bash
# Add the marketplace
claude plugin marketplace add DanielCarmingham/cc-permissions

# Install the plugin
claude plugin install cc-permissions@DanielCarmingham-cc-permissions

# Update to latest version
claude plugin update cc-permissions@DanielCarmingham-cc-permissions

# Uninstall
claude plugin uninstall cc-permissions@DanielCarmingham-cc-permissions
```

Then use `/cc-permissions:analyze`, `/cc-permissions:apply`, and other slash commands directly in Claude Code.

Note: Third-party plugins don't auto-update by default. Run `claude plugin update` from your terminal to get new versions, or enable auto-update via `/plugin` → Marketplaces → select marketplace → Enable auto-update.

## How it works

Permissions are organized into **templates** and **levels**.

**Templates** group commands by technology. Use `nodejs` for npm/yarn/pnpm commands, `python` for pip and pytest, `docker` for container operations, and so on. Combine them freely:

```bash
cc-permissions apply nodejs,python,docker
```

**Levels** control how permissive each template is:

| Level | What it allows |
|-------|----------------|
| `restrictive` | Read-only operations (list, status, info) |
| `standard` | Development workflow (run, build, test) |
| `permissive` | Broader access (install, publish, remove) |

Levels are cumulative. `standard` includes everything from `restrictive`, and `permissive` includes everything from `standard`.

```bash
# Safe exploration mode
cc-permissions apply nodejs --level restrictive

# Normal development (default)
cc-permissions apply nodejs

# Trusted project, full access
cc-permissions apply nodejs --level permissive
```

## Templates

### General

| Template | Description |
|----------|-------------|
| [shell](docs/templates/shell.md) | Basic shell and filesystem commands |

### Version Control

| Template | Description |
|----------|-------------|
| [git](docs/templates/git.md) | Git version control |
| [gitea](docs/templates/gitea.md) | Gitea CLI (tea) for repository and workflow management |
| [gitea-mcp](docs/templates/gitea-mcp.md) | Gitea MCP Server tools for repository and workflow management |
| [github](docs/templates/github.md) | GitHub CLI (gh) for repository and workflow management |
| [github-mcp](docs/templates/github-mcp.md) | GitHub MCP Server tools for repository and workflow management |
| [gitlab](docs/templates/gitlab.md) | GitLab CLI (glab) for repository and workflow management |
| [gitlab-mcp](docs/templates/gitlab-mcp.md) | GitLab MCP Server tools for repository and workflow management |

### Languages & Runtimes

| Template | Description |
|----------|-------------|
| [bun](docs/templates/bun.md) | Bun runtime and package manager |
| [dotnet](docs/templates/dotnet.md) | dotnet CLI, NuGet, MSBuild |
| [go](docs/templates/go.md) | Go development and golangci-lint |
| [java](docs/templates/java.md) | Java and JVM runtime |
| [nodejs](docs/templates/nodejs.md) | Node.js, npm, and npx |
| [php](docs/templates/php.md) | PHP, Composer, and Laravel Artisan |
| [pnpm](docs/templates/pnpm.md) | pnpm package manager |
| [python](docs/templates/python.md) | pip, python, venv, pytest, and common data tools |
| [ruby](docs/templates/ruby.md) | Ruby, Bundler, Rails, and Rake |
| [rust](docs/templates/rust.md) | Cargo, rustc, and rustup |
| [typescript](docs/templates/typescript.md) | TypeScript compiler (tsc) |
| [yarn](docs/templates/yarn.md) | Yarn package manager |

### Build Tools

| Template | Description |
|----------|-------------|
| [gradle](docs/templates/gradle.md) | Gradle build tool and wrapper |
| [maven](docs/templates/maven.md) | Apache Maven build tool |

### Cloud Providers

| Template | Description |
|----------|-------------|
| [aws](docs/templates/aws.md) | AWS CLI, SAM, CDK, Amplify, and Elastic Beanstalk |
| [aws-mcp](docs/templates/aws-mcp.md) | AWS MCP Server tools for cloud infrastructure and serverless development |
| [azure](docs/templates/azure.md) | Azure CLI, Functions, Bicep, and Azure Developer CLI |
| [bicep](docs/templates/bicep.md) | Azure Bicep infrastructure-as-code CLI |
| [gcp](docs/templates/gcp.md) | Google Cloud CLI, gsutil, Firebase, and BigQuery |

### Container & Infrastructure

| Template | Description |
|----------|-------------|
| [docker](docs/templates/docker.md) | Docker, Docker Compose, and Buildx |
| [docker-mcp](docs/templates/docker-mcp.md) | Docker MCP Server tools for container management |
| [kubernetes](docs/templates/kubernetes.md) | kubectl, Helm, k9s, and Minikube |
| [terraform](docs/templates/terraform.md) | Terraform, Terragrunt, and tflint |

### Database

| Template | Description |
|----------|-------------|
| [azure-sql](docs/templates/azure-sql.md) | Azure SQL Database CLI tools (az sql) |
| [azure-storage](docs/templates/azure-storage.md) | Azure Storage CLI tools (az storage) for blobs, tables, queues, and file shares |
| [mariadb](docs/templates/mariadb.md) | MariaDB CLI tools (mariadb, mariadb-dump, mariadb-admin) |
| [mariadb-mcp](docs/templates/mariadb-mcp.md) | MariaDB MCP Server tools for database queries |
| [mongodb](docs/templates/mongodb.md) | MongoDB CLI tools (mongosh, mongodump, mongorestore) |
| [mysql](docs/templates/mysql.md) | MySQL CLI tools (mysql, mysqldump, mysqladmin) |
| [postgres](docs/templates/postgres.md) | PostgreSQL CLI tools (psql, pg_dump, pg_restore) |
| [postgres-mcp](docs/templates/postgres-mcp.md) | PostgreSQL MCP Server tools for database queries |
| [redis](docs/templates/redis.md) | Redis CLI tools (redis-cli) |
| [sqlite](docs/templates/sqlite.md) | SQLite CLI tools (sqlite3) |
| [sqlite-mcp](docs/templates/sqlite-mcp.md) | SQLite MCP Server tools for database operations |

### Testing

| Template | Description |
|----------|-------------|
| [playwright](docs/templates/playwright.md) | Playwright testing framework |
| [playwright-mcp](docs/templates/playwright-mcp.md) | Playwright MCP Server tools for browser automation |
| [selenium](docs/templates/selenium.md) | Selenium testing framework CLI tools |
| [selenium-mcp](docs/templates/selenium-mcp.md) | Selenium MCP Server tools for browser automation |

### Mobile Development

| Template | Description |
|----------|-------------|
| [android](docs/templates/android.md) | Android SDK, ADB, and emulator |
| [flutter](docs/templates/flutter.md) | Flutter SDK and Dart development |
| [ios](docs/templates/ios.md) | Xcode, Swift, CocoaPods, and iOS development |

### MCP Servers

All MCP server templates in one place. These are also listed alongside their CLI counterparts above.

| Template | Description |
|----------|-------------|
| [aws-mcp](docs/templates/aws-mcp.md) | AWS MCP Server tools for cloud infrastructure and serverless development |
| [azure-sql-mcp](docs/templates/azure-sql-mcp.md) | Azure SQL Database MCP Server tools (azmcp) |
| [azure-storage-mcp](docs/templates/azure-storage-mcp.md) | Azure Storage MCP Server tools (azmcp) |
| [docker-mcp](docs/templates/docker-mcp.md) | Docker MCP Server tools for container management |
| [gitea-mcp](docs/templates/gitea-mcp.md) | Gitea MCP Server tools for repository and workflow management |
| [github-mcp](docs/templates/github-mcp.md) | GitHub MCP Server tools for repository and workflow management |
| [gitlab-mcp](docs/templates/gitlab-mcp.md) | GitLab MCP Server tools for repository and workflow management |
| [mariadb-mcp](docs/templates/mariadb-mcp.md) | MariaDB MCP Server tools for database queries |
| [playwright-mcp](docs/templates/playwright-mcp.md) | Playwright MCP Server tools for browser automation |
| [selenium-mcp](docs/templates/selenium-mcp.md) | Selenium MCP Server tools for browser automation |
| [postgres-mcp](docs/templates/postgres-mcp.md) | PostgreSQL MCP Server tools for database queries |
| [sqlite-mcp](docs/templates/sqlite-mcp.md) | SQLite MCP Server tools for database operations |
| [typescript-mcp](docs/templates/typescript-mcp.md) | TypeScript MCP Server tools for type checking and compilation |

Click any template to see the full list of commands at each level.

## Where permissions are saved

By default, permissions go to `.claude/settings.json` (project scope). You can change this:

```bash
# Personal defaults across all projects
cc-permissions apply --scope user

# Project-specific overrides (gitignored)
cc-permissions apply --scope local

# Custom file
cc-permissions apply --output ./my-permissions.json
```

| Scope | File | Use case |
|-------|------|----------|
| `project` | `.claude/settings.json` | Team settings, commit to repo |
| `user` | `~/.claude/settings.json` | Personal defaults |
| `local` | `.claude/settings.local.json` | Personal overrides, gitignored |

## Safety

All generated configs include a deny list blocking dangerous patterns like `rm -rf /`, `sudo`, and piped remote execution (`curl | bash`). You can still shoot yourself in the foot, but the obvious hazards are blocked.

## Other commands

```bash
# See what would be applied (same as cc-permissions analyze)
cc-permissions

# List available templates
cc-permissions list

# View template permissions without applying
cc-permissions template nodejs

# Output as JSON (for piping/scripting)
cc-permissions template nodejs --format json
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on adding new templates and development setup.

## License

[0BSD](LICENSE.md) - Use freely, no attribution required.
