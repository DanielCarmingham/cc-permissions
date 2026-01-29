# selenium

Selenium testing framework CLI tools

**Category:** Testing

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `selenium-side-runner --version` | Check runner version |
| `selenium-manager --help` | Selenium Manager help |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `selenium-side-runner` | Run .side test files |
| `selenium-side-runner --server` | Run tests on remote Grid |
| `selenium-side-runner -w` | Set parallel workers |
| `selenium-side-runner --base-url` | Override base URL |
| `selenium-side-runner --filter` | Filter tests by pattern |
| `selenium-side-runner --output-directory` | Set output directory |
| `selenium-side-runner --output-format` | Set output format |
| `selenium-side-runner --config-file` | Use custom config file |
| `selenium-side-runner --proxy-type` | Configure proxy type |
| `selenium-side-runner --proxy-options` | Configure proxy options |
| `selenium-side-runner --params` | Pass parameters to tests |
| `selenium-manager --browser` | Resolve and download browser driver |
| `selenium-manager --driver` | Resolve specific driver version |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `java -jar selenium-server standalone` | Start Grid standalone |
| `java -jar selenium-server hub` | Start Grid Hub |
| `java -jar selenium-server node` | Start Grid Node |
| `selenium-manager --grid` | Download Selenium Grid jar |
| `selenium-manager --clear-cache` | Clear driver cache |
| `selenium-manager --clear-metadata` | Clear metadata cache |
| `selenium-manager --force-browser-download` | Force browser download |
