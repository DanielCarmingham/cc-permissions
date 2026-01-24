# playwright

Playwright testing framework

**Category:** Testing

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `npx playwright --version` | Check Playwright version |
| `npx playwright --help` | Playwright help |
| `playwright --version` | Check Playwright version |
| `npx playwright test --list` | List tests without running |
| `npx playwright show-report` | Display test report |
| `npx playwright show-trace` | View trace file |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run Playwright tests |
| `playwright test` | Run Playwright tests |
| `npx playwright test --headed` | Run tests with visible browser |
| `npx playwright test --debug` | Debug tests with Inspector |
| `npx playwright test --ui` | Interactive test UI mode |
| `npx playwright test --ui-port` | UI mode on custom port |
| `npx playwright test --project` | Run specific project |
| `npx playwright test --grep` | Filter tests by pattern |
| `npx playwright test --update-snapshots` | Update test snapshots |
| `npx playwright test --trace` | Record trace |
| `npx playwright test --reporter` | Use custom reporter |
| `npx playwright codegen` | Generate test code |
| `playwright codegen` | Generate test code |
| `npx playwright screenshot` | Take screenshot |
| `npx playwright pdf` | Generate PDF |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `npx playwright install` | Install browsers |
| `npx playwright install chromium` | Install Chromium |
| `npx playwright install firefox` | Install Firefox |
| `npx playwright install webkit` | Install WebKit |
| `npx playwright install msedge` | Install Edge |
| `npx playwright install --with-deps` | Install browsers with system deps |
| `playwright install` | Install browsers |
| `npx playwright uninstall` | Uninstall browsers |
| `playwright uninstall` | Uninstall browsers |
