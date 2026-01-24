# github

GitHub CLI (gh) for repository and workflow management

**Category:** Version Control

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `gh --version` | Check GitHub CLI version |
| `gh version` | Check GitHub CLI version |
| `gh help` | GitHub CLI help |
| `gh auth status` | Check authentication status |
| `gh config list` | List GitHub CLI config |
| `gh repo view` | View repository |
| `gh repo list` | List repositories |
| `gh repo clone` | Clone repository |
| `gh pr list` | List pull requests |
| `gh pr view` | View pull request |
| `gh pr status` | Show PR status |
| `gh pr diff` | View PR diff |
| `gh pr checks` | View PR checks |
| `gh pr comments` | View PR comments |
| `gh issue list` | List issues |
| `gh issue view` | View issue |
| `gh issue status` | Show issue status |
| `gh run list` | List workflow runs |
| `gh run view` | View workflow run |
| `gh run download` | Download run artifacts |
| `gh release list` | List releases |
| `gh release view` | View release |
| `gh release download` | Download release assets |
| `gh gist list` | List gists |
| `gh gist view` | View gist |
| `gh gist clone` | Clone gist |
| `gh api` | GitHub API calls |
| `gh search repos` | Search repositories |
| `gh search issues` | Search issues |
| `gh search prs` | Search pull requests |
| `gh search commits` | Search commits |
| `gh search code` | Search code |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `gh pr create` | Create pull request |
| `gh pr checkout` | Checkout PR branch |
| `gh pr edit` | Edit pull request |
| `gh pr comment` | Comment on PR |
| `gh pr review` | Review pull request |
| `gh pr ready` | Mark PR as ready |
| `gh issue create` | Create issue |
| `gh issue edit` | Edit issue |
| `gh issue comment` | Comment on issue |
| `gh issue develop` | Create branch for issue |
| `gh issue pin` | Pin issue |
| `gh issue unpin` | Unpin issue |
| `gh run watch` | Watch workflow run |
| `gh gist create` | Create gist |
| `gh gist edit` | Edit gist |
| `gh project list` | List projects |
| `gh project view` | View project |
| `gh project create` | Create project |
| `gh label list` | List labels |
| `gh label create` | Create label |
| `gh codespace list` | List codespaces |
| `gh codespace create` | Create codespace |
| `gh codespace code` | Open codespace in VS Code |
| `gh codespace ssh` | SSH to codespace |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `gh pr merge` | Merge pull request |
| `gh pr close` | Close pull request |
| `gh pr reopen` | Reopen pull request |
| `gh issue close` | Close issue |
| `gh issue reopen` | Reopen issue |
| `gh issue delete` | Delete issue |
| `gh issue transfer` | Transfer issue |
| `gh repo create` | Create repository |
| `gh repo delete` | Delete repository |
| `gh repo fork` | Fork repository |
| `gh repo rename` | Rename repository |
| `gh repo archive` | Archive repository |
| `gh repo edit` | Edit repository |
| `gh repo sync` | Sync repository |
| `gh release create` | Create release |
| `gh release delete` | Delete release |
| `gh release edit` | Edit release |
| `gh release upload` | Upload release assets |
| `gh run rerun` | Rerun workflow |
| `gh run cancel` | Cancel workflow run |
| `gh run delete` | Delete workflow run |
| `gh workflow run` | Run workflow |
| `gh workflow enable` | Enable workflow |
| `gh workflow disable` | Disable workflow |
| `gh gist delete` | Delete gist |
| `gh codespace delete` | Delete codespace |
| `gh codespace stop` | Stop codespace |
| `gh secret list` | List secrets |
| `gh secret set` | Set secret |
| `gh secret delete` | Delete secret |
| `gh variable list` | List variables |
| `gh variable set` | Set variable |
| `gh variable delete` | Delete variable |
