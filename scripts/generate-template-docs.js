#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(__dirname, '..', 'templates');
const docsDir = join(__dirname, '..', 'docs', 'templates');

// Ensure docs directory exists
mkdirSync(docsDir, { recursive: true });

// Strip JSONC comments
function stripComments(jsonc) {
  return jsonc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

// Get all template files
const templateFiles = readdirSync(templatesDir).filter(f => f.endsWith('.jsonc'));

for (const file of templateFiles) {
  const content = readFileSync(join(templatesDir, file), 'utf-8');
  const template = JSON.parse(stripComments(content));

  const lines = [
    `# ${template.name}`,
    '',
    template.description,
    '',
  ];

  if (template.category) {
    lines.push(`**Category:** ${template.category}`, '');
  }

  // Restrictive level
  if (template.levels.restrictive?.length) {
    lines.push('## Restrictive');
    lines.push('');
    lines.push('Read-only operations safe for exploration and code review.');
    lines.push('');
    lines.push('| Command | Description |');
    lines.push('|---------|-------------|');
    for (const cmd of template.levels.restrictive) {
      lines.push(`| \`${cmd.command}\` | ${cmd.description} |`);
    }
    lines.push('');
  }

  // Standard level
  if (template.levels.standard?.length) {
    lines.push('## Standard');
    lines.push('');
    lines.push('Day-to-day development commands. Includes all restrictive commands plus:');
    lines.push('');
    lines.push('| Command | Description |');
    lines.push('|---------|-------------|');
    for (const cmd of template.levels.standard) {
      lines.push(`| \`${cmd.command}\` | ${cmd.description} |`);
    }
    lines.push('');
  }

  // Permissive level
  if (template.levels.permissive?.length) {
    lines.push('## Permissive');
    lines.push('');
    lines.push('Broader access for trusted projects. Includes all standard commands plus:');
    lines.push('');
    lines.push('| Command | Description |');
    lines.push('|---------|-------------|');
    for (const cmd of template.levels.permissive) {
      lines.push(`| \`${cmd.command}\` | ${cmd.description} |`);
    }
    lines.push('');
  }

  const outputPath = join(docsDir, `${template.name}.md`);
  writeFileSync(outputPath, lines.join('\n'));
  console.log(`Generated ${template.name}.md`);
}

console.log(`\nGenerated ${templateFiles.length} template docs in docs/templates/`);
