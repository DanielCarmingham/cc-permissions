# cc-permission-generator

**Thoughtful permission configs for Claude Code without the container overhead.**

## The Problem

Claude Code users face a frustrating choice:

- **Docker sandbox + `--dangerously-skip-permissions`**: Safe and convenient, but requires container setup and deals with overhead
- **Native execution**: No containers, but constant permission prompts interrupt your workflow

Neither option is ideal for users who want native performance with intentional control.

## Our Solution

A middle ground: generate thoughtful permission configurations that reduce prompt fatigue while maintaining deliberate control over what Claude Code can do.

**Important**: This approach is inherently less safe than a fully isolated environment—there's no sandbox. Users accept this tradeoff in exchange for avoiding container overhead while having more control than `--dangerously-skip-permissions` alone.

## Core Features

### Permission Generation
Create permission configurations tailored to your workflow. Define what Claude Code can and cannot do, then use those configs consistently across sessions.

### Permission Analysis
Scan your codebase and common workflows to suggest permissions you'll likely need. Stop discovering missing permissions mid-task.

### Permission Templates
Start from pre-built templates for common setups (web development, data science, DevOps, etc.) and customize from there.

## Who This Is For

- Developers who prefer native execution over containers
- Users tired of repetitive permission prompts
- Teams wanting consistent permission policies across projects

## Constraints

- **Lean footprint**: Fast, simple installation via npm
- **Cross-platform**: Must work on Windows, macOS, and Linux
- **Minimal dependencies**: Keep the dependency tree small for security and speed

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Distribution**: npm package (CLI tool)

## Development Notes

- After updating templates in `templates/*.jsonc`, regenerate docs: `node scripts/generate-template-docs.js`
- When adding, removing, or renaming templates, also update `README.md`:
  - Add/remove the template in its technology category section (e.g., Database, Cloud Providers)
  - If it's an MCP template, also add/remove it in the dedicated "MCP Servers" section
  - Keep entries sorted alphabetically within each section
