# cc-permissions

**Thoughtful permission configs for Claude Code without the container overhead.**

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

## Usage

### Generate Permissions from a Template

```bash
# Generate standard web development permissions
cc-permissions template web --level standard

# Combine multiple templates
cc-permissions template web,python --level standard

# Apply directly to .claude/settings.json (creates backup)
cc-permissions template web --level standard --apply

# Work offline (use cached templates only)
cc-permissions template web --level standard --offline
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

### Update Templates

Templates are fetched from a remote CDN and cached locally. Update to get the latest templates:

```bash
cc-permissions update
```

On first run, templates are automatically fetched. Subsequent runs use the local cache, with automatic background checks for updates (daily).

### Manage Template Cache

```bash
# Show cache information
cc-permissions cache info

# Clear the cache (forces re-download on next run)
cc-permissions cache clear
```

### Offline Mode

Use `--offline` to work without network access (uses cached templates):

```bash
cc-permissions template web --level standard --offline
cc-permissions list --offline
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
| `general` | Git and common CLI tools (ls, cat, grep, find, etc.) |
| `web` | Node.js, npm, and common frontend tooling |
| `python` | pip, python, venv, pytest, and common data tools |
| `dotnet` | dotnet CLI, NuGet, MSBuild |

Combine templates with commas: `cc-permissions template general,web,python`

## Output Formats

```bash
# JSON only (default) - pipe to .claude/settings.json
cc-permissions template web --format json

# Human-readable summary
cc-permissions template web --format summary

# Both JSON and summary
cc-permissions template web --format both
```

## Template Architecture

Templates are fetched from a remote CDN and cached locally for offline use:

```
~/.cc-permissions/
├── templates/           # Cached template files
│   ├── general.jsonc
│   ├── web.jsonc
│   ├── python.jsonc
│   └── dotnet.jsonc
└── cache-meta.json      # Cache metadata (version, last updated)
```

**How it works:**
1. First run: Fetches templates from CDN, caches locally
2. Subsequent runs: Uses cache, checks for updates in background (daily)
3. Offline: Uses cached templates
4. `cc-permissions update`: Forces refresh from CDN

The tool also includes bundled templates as a fallback if both remote fetch and cache fail.

## Who This Is For

- Developers who prefer native execution over containers
- Users tired of repetitive permission prompts
- Teams wanting consistent permission policies across projects

## Contributing Templates

Templates are maintained in a separate repository: [cc-permissions-templates](https://github.com/DanielCarmingham/cc-permissions-templates)

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
