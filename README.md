# cc-permissions

**Thoughtful permission configs for Claude Code without the container overhead.**

## Contents

- [The Problem](#the-problem)
- [Installation](#installation)
- [Usage](#usage)
- [Available Templates](#available-templates)
- [Permission Levels](#permission-levels)
- [Apply Options](#apply-options)
- [Contributing Templates](#contributing-templates)

## The Problem

Claude Code users face a frustrating choice:

- **Docker sandbox + `--dangerously-skip-permissions`**: Safe and convenient, but requires container setup and deals with overhead
- **Native execution**: No containers, but constant permission prompts interrupt your workflow

Neither option is ideal for users who want native performance with intentional control.

## Our Solution

A middle ground: generate thoughtful permission configurations that reduce prompt fatigue while maintaining deliberate control over what Claude Code can do.

**Important**: This approach is inherently less safe than a fully isolated environment—there's no sandbox. Users accept this tradeoff in exchange for avoiding container overhead while having more control than `--dangerously-skip-permissions` alone.

## Installation

```bash
# Run directly with npx (no install needed)
npx cc-permissions

# Or install globally
npm install -g cc-permissions
```

### Claude Code Plugin

Install as a Claude Code plugin for integrated slash commands:

```bash
# Step 1: Add the GitHub repo as a marketplace
/plugin marketplace add DanielCarmingham/cc-permissions

# Step 2: Install the plugin
/plugin install cc-permissions@danielcarmingham-cc-permissions
```

Or use the interactive plugin manager:
```
/plugin
```
Then navigate to **Discover**, find cc-permissions, and install.

Once installed, use the following slash commands:
- `/cc-permissions:analyze` - Scan project and recommend templates
- `/cc-permissions:template nodejs,python` - Generate from specific templates
- `/cc-permissions:list` - List available templates
- `/cc-permissions:apply` - Apply permissions to settings

## Usage

### Quick Start

```bash
# Analyze your project and apply recommended permissions
cc-permissions --apply

# Or be more specific
cc-permissions --apply --level permissive
```

### Generate Permissions from a Template

```bash
# Generate standard web development permissions
cc-permissions template nodejs --level standard

# Combine multiple templates
cc-permissions template nodejs,python --level standard

# Apply directly to .claude/settings.json (creates backup)
cc-permissions template nodejs --apply
```

### Analyze Your Project

Scan your project and get template recommendations:

```bash
cc-permissions analyze
cc-permissions analyze ./path/to/project
```

### List Available Templates

```bash
cc-permissions list
```

### Check Version

```bash
cc-permissions -v   # or --version
```

## Permission Levels

Levels are cumulative—each level includes everything from the previous level:

| Level | Description | Use Case |
|-------|-------------|----------|
| `restrictive` | Read-only operations (git status, npm list, etc.) | Code review, exploration |
| `standard` | Dev workflow (+ git commit/push, npm run/build/test) | Day-to-day development |
| `permissive` | Few guardrails (+ npm install, most commands except banned) | Trusted projects, greenfield |

## Available Templates

| Template | Description |
|----------|-------------|
| `shell` | Basic shell and filesystem commands |
| `git` | Git version control |
| `github` | GitHub CLI (gh) for repository and workflow management |
| `nodejs` | Node.js, npm, pnpm, yarn, and bun |
| `python` | pip, python, venv, pytest, and common data tools |
| `go` | Go development and golangci-lint |
| `rust` | Cargo, rustc, and rustup |
| `java` | Maven, Gradle, Java, and JVM development |
| `dotnet` | dotnet CLI, NuGet, MSBuild |
| `ruby` | Ruby, Bundler, Rails, and Rake |
| `php` | PHP, Composer, and Laravel Artisan |
| `ios` | Xcode, Swift, CocoaPods, and iOS development |
| `android` | Gradle, ADB, and Android development |
| `flutter` | Flutter SDK and Dart development |
| `docker` | Docker, Docker Compose, and Buildx |
| `kubernetes` | kubectl, Helm, k9s, and Minikube |
| `terraform` | Terraform, Terragrunt, and tflint |
| `aws` | AWS CLI, SAM, CDK, Amplify, and Elastic Beanstalk |
| `azure` | Azure CLI, Functions, Bicep, and Azure Developer CLI |
| `gcp` | Google Cloud CLI, gsutil, Firebase, and BigQuery |
| `database` | PostgreSQL, MySQL, MongoDB, and Redis CLI tools |

Combine templates with commas: `cc-permissions template shell,nodejs,python`

Run `cc-permissions list` to see all available templates.

## Apply Options

Control where permissions are written with `--scope` or `--output`:

```bash
# Project settings (default) - .claude/settings.json
cc-permissions --apply --scope project

# User/global settings - ~/.claude/settings.json
cc-permissions --apply --scope user

# Local settings (gitignored) - .claude/settings.local.json
cc-permissions --apply --scope local

# Custom file path
cc-permissions --apply --output ./my-permissions.json
```

| Scope | File | Use Case |
|-------|------|----------|
| `project` | `.claude/settings.json` | Shared team settings (commit to repo) |
| `user` / `global` | `~/.claude/settings.json` | Personal defaults across all projects |
| `local` | `.claude/settings.local.json` | Personal overrides (gitignored) |

**Tip:** Options support prefix matching—use `-l r` for `--level restrictive` or `-s u` for `--scope user`.

## Output Formats

```bash
# JSON only (default) - pipe to .claude/settings.json
cc-permissions template nodejs --format json

# Human-readable summary
cc-permissions template nodejs --format summary

# Both JSON and summary
cc-permissions template nodejs --format both
```

## Who This Is For

- Developers who prefer native execution over containers
- Users tired of repetitive permission prompts
- Teams wanting consistent permission policies across projects

## Contributing Templates

Templates are located in the `templates/` directory.

### Template Structure

Each template is a `.jsonc` file with comments allowed:

```jsonc
{
  "$schema": "./template.schema.json",
  "name": "my-template",
  "description": "Brief description of what this template covers",
  "levels": {
    "restrictive": [
      // Read-only commands (exploration, status checks)
      { "command": "mytool status", "description": "Check status" }
    ],
    "standard": [
      // Dev workflow commands (builds, tests, commits)
      { "command": "mytool build", "description": "Build project" }
    ],
    "permissive": [
      // Commands with broader access (installs, publishes)
      { "command": "mytool install *", "description": "Install packages" }
    ]
  }
}
```

### Permission Level Guidelines

| Level | Purpose | Examples |
|-------|---------|----------|
| `restrictive` | Read-only, safe to run anytime | `git status`, `npm list`, `cargo check` |
| `standard` | Normal dev workflow | `git commit`, `npm test`, `cargo build` |
| `permissive` | Broader access, use with caution | `npm install`, `cargo publish` |

Each level is cumulative—`standard` includes everything from `restrictive`, and `permissive` includes everything from `standard`.

## Safety

All generated configs include a deny list of dangerous patterns:
- `rm -rf` - Recursive force delete
- `sudo` - Privilege escalation
- `curl | bash` / `wget | sh` - Remote code execution
- And more...

## Publishing (for maintainers)

Version management is done through npm scripts:

```bash
npm run version:show         # Show current version
npm run version:bump patch   # 0.1.0 → 0.1.1
npm run version:bump minor   # 0.1.0 → 0.2.0
npm run version:bump major   # 0.1.0 → 1.0.0
npm run version:set 2.0.0    # Set exact version
```

To publish:

```bash
npm login                     # first time only
npm run version:bump patch    # bump version (also: minor, major)
npm publish                   # publishes to npm
```

A prepublish check automatically prevents publishing a version that already exists on npm.

## License

0BSD
