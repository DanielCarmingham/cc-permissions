# cc-permissions Plugin

Generate thoughtful permission configs for Claude Code.

## Installation

1. Ensure Node.js is installed
2. Install plugin: `/plugin install cc-permissions`

## Commands

- `/cc-permissions:analyze` - Scan project and recommend templates
- `/cc-permissions:template <names>` - Generate from specific templates
- `/cc-permissions:list` - List available templates
- `/cc-permissions:apply` - Apply permissions to settings

## Permission Levels

- `restrictive` - Read-only operations
- `standard` - Development workflow (commits, builds, tests)
- `permissive` - Package installations
