# Contributing to cc-permissions

## Development Setup

```bash
# Clone the repository
git clone https://github.com/DanielCarmingham/cc-permissions.git
cd cc-permissions

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## Adding a New Template

### 1. Create the template file

Create `templates/<name>.jsonc` with this structure:

```jsonc
{
  "$schema": "../template.schema.json",
  "name": "my-template",
  "description": "Brief description of what this template covers",
  "category": "Category Name",
  "detection": {
    "files": ["config-file.json", "other-marker.yaml"],
    "contentPatterns": [
      { "file": "package.json", "contains": "some-package" }
    ]
  },
  "levels": {
    "restrictive": [
      // Read-only, safe operations
      { "command": "mytool --version", "description": "Check version" },
      { "command": "mytool status", "description": "Check status" }
    ],
    "standard": [
      // Day-to-day development commands
      { "command": "mytool build", "description": "Build project" },
      { "command": "mytool test", "description": "Run tests" }
    ],
    "permissive": [
      // Commands that modify system state or install things
      { "command": "mytool install", "description": "Install dependencies" }
    ]
  }
}
```

**Level guidelines:**
- **restrictive**: Read-only operations, version checks, help commands, listing without execution
- **standard**: Normal development workflow - running, building, testing, code generation
- **permissive**: Installing dependencies, modifying system state, publishing

**Detection:**
- `files`: Array of filenames that indicate this template applies
- `contentPatterns`: Check if specific files contain certain strings (useful for package.json dependencies)

### 2. Add category to cli.ts (if new category)

If your template uses a new category, add it to the `categoryOrder` array in `src/cli.ts`:

```typescript
const categoryOrder = [
  "General",
  "Version Control",
  "Languages & Runtimes",
  "Cloud Providers",
  "Container & Infrastructure",
  "Testing",  // Add new categories in logical order
  "Mobile Development",
  "Utilities",
  "Other",
];
```

### 3. Add to README.md

Add your template to the appropriate category section in README.md:

```markdown
### Category Name

| Template | Description |
|----------|-------------|
| [my-template](docs/templates/my-template.md) | Brief description |
```

### 4. Build and test

```bash
# Build the project
npm run build

# Verify template outputs permissions
node dist/cli.js template my-template

# Verify template appears in list
node dist/cli.js list

# Run full test suite
npm test
```

### 5. Regenerate documentation

```bash
node scripts/generate-template-docs.js
```

This creates/updates `docs/templates/<name>.md` automatically.

### 6. Test detection (optional but recommended)

```bash
# Create a test directory with marker files
mkdir -p /tmp/test-project
touch /tmp/test-project/config-file.json

# Verify detection works
node dist/cli.js analyze /tmp/test-project

# Clean up
rm -rf /tmp/test-project
```

## Existing Categories

- **General** - Basic utilities (shell)
- **Version Control** - Git, GitHub
- **Languages & Runtimes** - Programming languages and their package managers
- **Cloud Providers** - AWS, Azure, GCP
- **Container & Infrastructure** - Docker, Kubernetes, Terraform
- **Testing** - Testing frameworks (Playwright, etc.)
- **Mobile Development** - iOS, Android, Flutter
- **Utilities** - Database tools and other utilities

## Code Style

- Use TypeScript
- Follow existing patterns in the codebase
- Keep dependencies minimal

## Questions?

Open an issue on GitHub if you have questions or need help.
