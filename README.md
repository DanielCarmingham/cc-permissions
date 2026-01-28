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
| [gitea](docs/templates/gitea.md) | Gitea CLI (tea) and MCP server for repository and workflow management |
| [github](docs/templates/github.md) | GitHub CLI (gh) for repository and workflow management |
| [gitlab](docs/templates/gitlab.md) | GitLab CLI (glab) and MCP server for repository and workflow management |

### Languages & Runtimes

| Template | Description |
|----------|-------------|
| [dotnet](docs/templates/dotnet.md) | dotnet CLI, NuGet, MSBuild |
| [go](docs/templates/go.md) | Go development and golangci-lint |
| [java](docs/templates/java.md) | Java and JVM runtime |
| [nodejs](docs/templates/nodejs.md) | Node.js, npm, pnpm, yarn, and bun |
| [php](docs/templates/php.md) | PHP, Composer, and Laravel Artisan |
| [python](docs/templates/python.md) | pip, python, venv, pytest, and common data tools |
| [ruby](docs/templates/ruby.md) | Ruby, Bundler, Rails, and Rake |
| [rust](docs/templates/rust.md) | Cargo, rustc, and rustup |

### Build Tools

| Template | Description |
|----------|-------------|
| [gradle](docs/templates/gradle.md) | Gradle build tool and wrapper |
| [maven](docs/templates/maven.md) | Apache Maven build tool |

### Cloud Providers

| Template | Description |
|----------|-------------|
| [aws](docs/templates/aws.md) | AWS CLI, SAM, CDK, Amplify, and Elastic Beanstalk |
| [azure](docs/templates/azure.md) | Azure CLI, Functions, Bicep, and Azure Developer CLI |
| [gcp](docs/templates/gcp.md) | Google Cloud CLI, gsutil, Firebase, and BigQuery |

### Container & Infrastructure

| Template | Description |
|----------|-------------|
| [docker](docs/templates/docker.md) | Docker, Docker Compose, and Buildx |
| [kubernetes](docs/templates/kubernetes.md) | kubectl, Helm, k9s, and Minikube |
| [terraform](docs/templates/terraform.md) | Terraform, Terragrunt, and tflint |

### Testing

| Template | Description |
|----------|-------------|
| [playwright](docs/templates/playwright.md) | Playwright testing framework |

### Mobile Development

| Template | Description |
|----------|-------------|
| [android](docs/templates/android.md) | Android SDK, ADB, and emulator |
| [flutter](docs/templates/flutter.md) | Flutter SDK and Dart development |
| [ios](docs/templates/ios.md) | Xcode, Swift, CocoaPods, and iOS development |

### MCP Servers

| Template | Description |
|----------|-------------|
| [aws-mcp](docs/templates/aws-mcp.md) | AWS MCP Server tools for cloud infrastructure and serverless development |
| [docker-mcp](docs/templates/docker-mcp.md) | Docker MCP Server tools for container management |
| [gitea-mcp](docs/templates/gitea-mcp.md) | Gitea MCP Server tools for repository and workflow management |
| [github-mcp](docs/templates/github-mcp.md) | GitHub MCP Server tools for repository and workflow management |
| [gitlab-mcp](docs/templates/gitlab-mcp.md) | GitLab MCP Server tools for repository and workflow management |
| [playwright-mcp](docs/templates/playwright-mcp.md) | Playwright MCP Server tools for browser automation |
| [postgres-mcp](docs/templates/postgres-mcp.md) | PostgreSQL MCP Server tools for database queries |
| [sqlite-mcp](docs/templates/sqlite-mcp.md) | SQLite MCP Server tools for database operations |

### Utilities

| Template | Description |
|----------|-------------|
| [database](docs/templates/database.md) | PostgreSQL, MySQL, MongoDB, and Redis CLI tools |

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
