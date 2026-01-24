# cc-permissions

**Thoughtful permission configs for Claude Code without the container overhead.**

Claude Code users face a frustrating choice: run in a Docker sandbox with `--dangerously-skip-permissions` for convenience, or run natively and deal with constant permission prompts.

This tool offers a middle ground. Generate permission configurations tailored to your workflow, reducing prompt fatigue while maintaining control over what Claude Code can do.

> **Note:** This approach is inherently less safe than a fully isolated environment. You're trading sandbox protection for convenience.

## Getting started

The fastest way to get going:

```bash
npx cc-permissions --apply
```

This analyzes your project, detects relevant templates, and applies permissions to `.claude/settings.json`.

Want more control? Install globally:

```bash
npm install -g cc-permissions
```

Or use as a Claude Code plugin:

```bash
# Add the marketplace
/plugin marketplace add DanielCarmingham/cc-permissions

# Install the plugin
/plugin install cc-permissions@DanielCarmingham-cc-permissions
```

Then use `/cc-permissions:analyze`, `/cc-permissions:apply`, and other slash commands directly in Claude Code.

## How it works

Permissions are organized into **templates** and **levels**.

**Templates** group commands by technology. Use `nodejs` for npm/yarn/pnpm commands, `python` for pip and pytest, `docker` for container operations, and so on. Combine them freely:

```bash
cc-permissions template nodejs,python,docker --apply
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
cc-permissions template nodejs --level restrictive

# Normal development (default)
cc-permissions template nodejs --level standard

# Trusted project, full access
cc-permissions template nodejs --level permissive
```

## Templates

| Template | Description |
|----------|-------------|
| [shell](docs/templates/shell.md) | Basic shell and filesystem commands |
| [git](docs/templates/git.md) | Git version control |
| [github](docs/templates/github.md) | GitHub CLI (gh) for repository and workflow management |
| [nodejs](docs/templates/nodejs.md) | Node.js, npm, pnpm, yarn, and bun |
| [python](docs/templates/python.md) | pip, python, venv, pytest, and common data tools |
| [go](docs/templates/go.md) | Go development and golangci-lint |
| [rust](docs/templates/rust.md) | Cargo, rustc, and rustup |
| [java](docs/templates/java.md) | Maven, Gradle, Java, and JVM development |
| [dotnet](docs/templates/dotnet.md) | dotnet CLI, NuGet, MSBuild |
| [ruby](docs/templates/ruby.md) | Ruby, Bundler, Rails, and Rake |
| [php](docs/templates/php.md) | PHP, Composer, and Laravel Artisan |
| [ios](docs/templates/ios.md) | Xcode, Swift, CocoaPods, and iOS development |
| [android](docs/templates/android.md) | Gradle, ADB, and Android development |
| [flutter](docs/templates/flutter.md) | Flutter SDK and Dart development |
| [docker](docs/templates/docker.md) | Docker, Docker Compose, and Buildx |
| [kubernetes](docs/templates/kubernetes.md) | kubectl, Helm, k9s, and Minikube |
| [terraform](docs/templates/terraform.md) | Terraform, Terragrunt, and tflint |
| [aws](docs/templates/aws.md) | AWS CLI, SAM, CDK, Amplify, and Elastic Beanstalk |
| [azure](docs/templates/azure.md) | Azure CLI, Functions, Bicep, and Azure Developer CLI |
| [gcp](docs/templates/gcp.md) | Google Cloud CLI, gsutil, Firebase, and BigQuery |
| [database](docs/templates/database.md) | PostgreSQL, MySQL, MongoDB, and Redis CLI tools |

Click any template to see the full list of commands at each level.

## Where permissions are saved

By default, permissions go to `.claude/settings.json` (project scope). You can change this:

```bash
# Personal defaults across all projects
cc-permissions --apply --scope user

# Project-specific overrides (gitignored)
cc-permissions --apply --scope local

# Custom file
cc-permissions --apply --output ./my-permissions.json
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
# Analyze project without applying
cc-permissions analyze

# List available templates
cc-permissions list

# Output as JSON only
cc-permissions template nodejs --format json

# Output with summary
cc-permissions template nodejs --format both
```

## Contributing templates

Templates live in `templates/` as `.jsonc` files. Each template defines commands for three levels:

```jsonc
{
  "name": "my-template",
  "description": "Brief description",
  "levels": {
    "restrictive": [
      { "command": "mytool status", "description": "Check status" }
    ],
    "standard": [
      { "command": "mytool build", "description": "Build project" }
    ],
    "permissive": [
      { "command": "mytool install *", "description": "Install packages" }
    ]
  }
}
```

After adding a template, run `node scripts/generate-template-docs.js` to update the documentation.

## License

0BSD
