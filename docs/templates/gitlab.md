# gitlab

GitLab CLI (glab) and MCP server for repository and workflow management

**Category:** Version Control

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `glab --version` | Check glab CLI version |
| `glab version` | Check glab CLI version |
| `glab --help` | Glab CLI help |
| `glab auth status` | Check authentication status |
| `glab config list` | List glab config |
| `glab check-update` | Check for CLI updates |
| `glab repo view` | View repository |
| `glab repo list` | List repositories |
| `glab repo clone` | Clone repository |
| `glab repo search` | Search repositories |
| `glab mr list` | List merge requests |
| `glab mr view` | View merge request |
| `glab mr diff` | View MR diff |
| `glab mr checkout` | Checkout MR branch |
| `glab issue list` | List issues |
| `glab issue view` | View issue |
| `glab ci list` | List CI pipelines |
| `glab ci view` | View CI pipeline |
| `glab ci status` | Show CI status |
| `glab ci trace` | Trace CI pipeline logs |
| `glab job list` | List CI jobs |
| `glab job view` | View CI job |
| `glab job trace` | Trace CI job logs |
| `glab job artifact` | Download job artifacts |
| `glab release list` | List releases |
| `glab release view` | View release |
| `glab release download` | Download release assets |
| `glab label list` | List labels |
| `glab milestone list` | List milestones |
| `glab variable list` | List CI/CD variables |
| `glab variable get` | Get variable value |
| `glab schedule list` | List pipeline schedules |
| `glab snippet list` | List snippets |
| `glab snippet view` | View snippet |
| `glab user list` | List users |
| `glab api` | GitLab API calls |
| `glab duo ask` | Ask GitLab Duo questions |
| `mcp__gitlab__search` | Search GitLab |
| `mcp__gitlab__search_code` | Semantic code search |
| `mcp__gitlab__get_project` | Get project details |
| `mcp__gitlab__list_projects` | List projects |
| `mcp__gitlab__search_projects` | Search projects |
| `mcp__gitlab__get_file_contents` | Get file contents |
| `mcp__gitlab__get_directory_contents` | Get directory contents |
| `mcp__gitlab__get_issue` | Get issue details |
| `mcp__gitlab__list_issues` | List issues |
| `mcp__gitlab__get_merge_request` | Get merge request details |
| `mcp__gitlab__list_merge_requests` | List merge requests |
| `mcp__gitlab__get_merge_request_commits` | Get MR commits |
| `mcp__gitlab__get_merge_request_diffs` | Get MR diffs |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `glab mr create` | Create merge request |
| `glab mr update` | Update merge request |
| `glab mr note` | Comment on MR |
| `glab mr approve` | Approve merge request |
| `glab mr revoke` | Revoke MR approval |
| `glab mr rebase` | Rebase merge request |
| `glab mr todo` | Add MR to todo list |
| `glab issue create` | Create issue |
| `glab issue update` | Update issue |
| `glab issue note` | Comment on issue |
| `glab issue subscribe` | Subscribe to issue |
| `glab issue unsubscribe` | Unsubscribe from issue |
| `glab ci run` | Run CI pipeline |
| `glab ci retry` | Retry CI pipeline |
| `glab job retry` | Retry CI job |
| `glab job play` | Play manual CI job |
| `glab release create` | Create release |
| `glab release upload` | Upload release assets |
| `glab label create` | Create label |
| `glab milestone create` | Create milestone |
| `glab snippet create` | Create snippet |
| `glab schedule create` | Create pipeline schedule |
| `glab schedule run` | Run scheduled pipeline |
| `mcp__gitlab__create_branch` | Create branch |
| `mcp__gitlab__create_file` | Create file |
| `mcp__gitlab__update_file` | Update file |
| `mcp__gitlab__push_files` | Push multiple files |
| `mcp__gitlab__create_issue` | Create issue |
| `mcp__gitlab__update_issue` | Update issue |
| `mcp__gitlab__create_issue_note` | Comment on issue |
| `mcp__gitlab__create_merge_request` | Create merge request |
| `mcp__gitlab__update_merge_request` | Update merge request |
| `mcp__gitlab__create_merge_request_note` | Comment on MR |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `glab mr merge` | Merge merge request |
| `glab mr close` | Close merge request |
| `glab mr reopen` | Reopen merge request |
| `glab mr delete` | Delete merge request branch |
| `glab issue close` | Close issue |
| `glab issue reopen` | Reopen issue |
| `glab issue delete` | Delete issue |
| `glab ci cancel` | Cancel CI pipeline |
| `glab ci delete` | Delete CI pipeline |
| `glab job cancel` | Cancel CI job |
| `glab repo create` | Create repository |
| `glab repo fork` | Fork repository |
| `glab repo delete` | Delete repository |
| `glab repo archive` | Archive repository |
| `glab repo transfer` | Transfer repository |
| `glab release delete` | Delete release |
| `glab label delete` | Delete label |
| `glab milestone close` | Close milestone |
| `glab milestone delete` | Delete milestone |
| `glab variable set` | Set CI/CD variable |
| `glab variable update` | Update CI/CD variable |
| `glab variable delete` | Delete CI/CD variable |
| `glab schedule delete` | Delete pipeline schedule |
| `glab snippet delete` | Delete snippet |
| `glab deploy-key list` | List deploy keys |
| `glab deploy-key create` | Create deploy key |
| `glab deploy-key delete` | Delete deploy key |
| `mcp__gitlab__create_project` | Create project |
| `mcp__gitlab__fork_project` | Fork project |
| `mcp__gitlab__delete_branch` | Delete branch |
| `mcp__gitlab__merge_merge_request` | Merge merge request |
| `mcp__gitlab__close_merge_request` | Close merge request |
| `mcp__gitlab__close_issue` | Close issue |
