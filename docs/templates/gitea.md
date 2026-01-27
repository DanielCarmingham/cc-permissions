# gitea

Gitea CLI (tea) for repository and workflow management

**Category:** Version Control

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `tea --version` | Check tea CLI version |
| `tea --help` | Tea CLI help |
| `tea whoami` | Show current user |
| `tea login list` | List configured logins |
| `tea repos list` | List repositories |
| `tea repos search` | Search repositories |
| `tea issues list` | List issues |
| `tea issues` | List issues (alias) |
| `tea pulls list` | List pull requests |
| `tea pulls` | List pull requests (alias) |
| `tea releases list` | List releases |
| `tea releases` | List releases (alias) |
| `tea labels list` | List labels |
| `tea labels` | List labels (alias) |
| `tea milestones list` | List milestones |
| `tea milestones` | List milestones (alias) |
| `tea times list` | List tracked times |
| `tea times` | List tracked times (alias) |
| `tea orgs list` | List organizations |
| `tea orgs` | List organizations (alias) |
| `tea notifications list` | List notifications |
| `tea notifications` | List notifications (alias) |
| `gitea-mcp --version` | Check Gitea MCP version |
| `gitea-mcp --help` | Gitea MCP help |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `tea issues create` | Create issue |
| `tea issues edit` | Edit issue |
| `tea issues reopen` | Reopen issue |
| `tea pulls create` | Create pull request |
| `tea pulls checkout` | Checkout PR branch |
| `tea pulls approve` | Approve pull request |
| `tea pulls reject` | Reject pull request |
| `tea pulls review` | Review pull request |
| `tea releases create` | Create release |
| `tea releases edit` | Edit release |
| `tea labels create` | Create label |
| `tea labels update` | Update label |
| `tea milestones create` | Create milestone |
| `tea times add` | Add tracked time |
| `tea comment` | Add comment |
| `tea clone` | Clone repository |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `tea repos create` | Create repository |
| `tea repos fork` | Fork repository |
| `tea issues close` | Close issue |
| `tea pulls merge` | Merge pull request |
| `tea pulls close` | Close pull request |
| `tea pulls reopen` | Reopen pull request |
| `tea releases delete` | Delete release |
| `tea labels delete` | Delete label |
| `tea milestones close` | Close milestone |
| `tea milestones delete` | Delete milestone |
| `tea milestones reopen` | Reopen milestone |
| `tea times delete` | Delete tracked time |
| `tea times reset` | Reset tracked times |
| `tea notifications read` | Mark notifications as read |
