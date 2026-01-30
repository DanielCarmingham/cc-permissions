/**
 * Shared formatting utilities for consistent CLI output.
 * Provides both raw colors and semantic formatting functions.
 */

// ANSI color codes
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

/**
 * Check if colors should be used (TTY and not piped).
 */
export function useColors(): boolean {
  // Respect NO_COLOR environment variable (https://no-color.org/)
  if (process.env.NO_COLOR !== undefined) return false;
  // Respect FORCE_COLOR for testing
  if (process.env.FORCE_COLOR !== undefined) return true;
  return process.stdout.isTTY ?? false;
}

/**
 * Apply color codes to text if terminal supports it.
 */
export function color(text: string, ...codes: string[]): string {
  if (!useColors()) return text;
  return codes.join("") + text + colors.reset;
}

/**
 * Semantic formatting functions for consistent CLI output.
 * Each function applies appropriate styling for its semantic meaning.
 */
export const fmt = {
  // === Headers & Structure ===

  /** Main title/program name - bold cyan. Optionally adds underline of same length. */
  title: (text: string, underline?: string) => {
    const styled = color(text, colors.bold, colors.cyan);
    if (underline) {
      return styled + "\n" + color(underline.repeat(text.length), colors.cyan);
    }
    return styled;
  },

  /** Section headers like "Usage:", "Commands:" - bold */
  section: (text: string) => color(text, colors.bold),

  /** Horizontal rule/divider - dim */
  divider: (char = "─", length = 60) => color(char.repeat(length), colors.dim),

  // === Commands & Syntax ===

  /** Command names and syntax - cyan */
  command: (text: string) => color(text, colors.cyan),

  /** Subcommand names - cyan */
  subcommand: (text: string) => color(text, colors.cyan),

  /** Option flags like "-h, --help" - yellow */
  option: (text: string) => color(text, colors.yellow),

  /** Required arguments like "<name>" - green */
  arg: (text: string) => color(text, colors.green),

  /** Optional arguments like "[options]" - dim green */
  optionalArg: (text: string) => color(text, colors.dim, colors.green),

  /** Values/literals like "restrictive", "standard" - magenta */
  value: (text: string) => color(text, colors.magenta),

  /** Default value indicator - dim */
  defaultValue: (text: string) => color(`(default: ${text})`, colors.dim),

  // === Content ===

  /** Description text - no color (normal) */
  desc: (text: string) => text,

  /** Example commands - green */
  example: (text: string) => color(text, colors.green),

  /** Hints and suggestions - dim */
  hint: (text: string) => color(text, colors.dim),

  /** URLs - blue underline */
  url: (text: string) => color(text, colors.blue, colors.underline),

  /** File paths - cyan */
  path: (text: string) => color(text, colors.cyan),

  /** Dimmed/secondary text */
  dim: (text: string) => color(text, colors.dim),

  // === Status Messages ===

  /** Error messages - bold red */
  error: (text: string) => color(text, colors.bold, colors.red),

  /** Error prefix "Error:" */
  errorPrefix: () => color("Error:", colors.bold, colors.red),

  /** Success messages - green */
  success: (text: string) => color(text, colors.green),

  /** Warning messages - yellow */
  warning: (text: string) => color(text, colors.yellow),

  /** Warning prefix with emoji */
  warningPrefix: () => color("Warning:", colors.bold, colors.yellow),

  /** Info messages - blue */
  info: (text: string) => color(text, colors.blue),

  // === List/Table Elements ===

  /** Category headers in lists - bold */
  category: (text: string) => color(text, colors.bold),

  /** Item names (like template names) - cyan */
  item: (text: string) => color(text, colors.cyan),

  /** Item description - no color */
  itemDesc: (text: string) => text,

  // === Detection Types (for analyze output) ===

  /** File detection indicator - green */
  fileDetection: (text: string) => color(text, colors.green),

  /** Directory detection indicator - green */
  dirDetection: (text: string) => color(text, colors.green),

  /** Content pattern detection - yellow */
  contentDetection: (text: string) => color(text, colors.yellow),

  /** MCP server detection - magenta */
  mcpDetection: (text: string) => color(text, colors.magenta),

  /** Ancestor file detection indicator - dim green */
  ancestorFileDetection: (text: string) => color(text, colors.dim, colors.green),

  /** Ancestor directory detection indicator - dim green */
  ancestorDirDetection: (text: string) => color(text, colors.dim, colors.green),

  /** Repo file detection indicator - dim cyan */
  repoFileDetection: (text: string) => color(text, colors.dim, colors.cyan),

  /** Git remote detection - blue */
  remoteDetection: (text: string) => color(text, colors.blue),

  /** Always included - gray */
  alwaysDetection: (text: string) => color(text, colors.gray),
};

/**
 * Format a usage line with proper coloring.
 * Example: formatUsage("cc-permissions", "apply", "[templates]", "[options]")
 */
export function formatUsage(program: string, command?: string, ...args: string[]): string {
  const parts = [fmt.command(program)];
  if (command) parts.push(fmt.subcommand(command));
  for (const arg of args) {
    if (arg.startsWith("[")) {
      parts.push(fmt.optionalArg(arg));
    } else if (arg.startsWith("<")) {
      parts.push(fmt.arg(arg));
    } else {
      parts.push(arg);
    }
  }
  return parts.join(" ");
}

/**
 * Format an option line for help output.
 * Example: formatOption("-l, --level", "Permission level", "standard")
 */
export function formatOption(flags: string, description: string, defaultVal?: string): string {
  const flagPart = fmt.option(flags.padEnd(16));
  const descPart = description;
  const defaultPart = defaultVal ? " " + fmt.defaultValue(defaultVal) : "";
  return `  ${flagPart}  ${descPart}${defaultPart}`;
}

/**
 * Format an example line.
 */
export function formatExample(command: string, description?: string): string {
  const cmdPart = fmt.example(command);
  if (description) {
    return `  ${cmdPart.padEnd(40)}  ${fmt.dim(description)}`;
  }
  return `  ${cmdPart}`;
}

/**
 * Format an error message with prefix.
 */
export function formatError(message: string): string {
  return `${fmt.errorPrefix()} ${message}`;
}

/**
 * Format a hint/suggestion.
 */
export function formatHint(message: string): string {
  return fmt.hint(message);
}

/**
 * Safety warning about trading sandbox protection for convenience.
 * Used in help output and analyze results.
 */
export function formatSafetyWarning(): string {
  return [
    fmt.divider("─", 75),
    `${fmt.warningPrefix()} This approach is inherently less safe than a fully`,
    `   isolated environment. You're trading sandbox protection for convenience.`,
  ].join("\n");
}
