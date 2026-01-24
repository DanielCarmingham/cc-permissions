# gitea

Gitea MCP server for repository and workflow management

**Category:** Version Control

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `gitea-mcp --version` | Check Gitea MCP version |
| `gitea-mcp --help` | Gitea MCP help |
| `mcp__gitea__get_gitea_mcp_server_version` | Get MCP server version |
| `mcp__gitea__get_my_user_info` | Get authenticated user info |
| `mcp__gitea__get_user_orgs` | Get user organizations |
| `mcp__gitea__search_users` | Search users |
| `mcp__gitea__list_my_repos` | List user repositories |
| `mcp__gitea__search_repos` | Search repositories |
| `mcp__gitea__get_repo` | Get repository details |
| `mcp__gitea__list_branches` | List branches |
| `mcp__gitea__get_branch` | Get branch details |
| `mcp__gitea__get_file_content` | Get file content |
| `mcp__gitea__get_dir_content` | List directory entries |
| `mcp__gitea__list_repo_commits` | List commits |
| `mcp__gitea__get_issue_by_index` | Get issue by index |
| `mcp__gitea__list_repo_issues` | List repository issues |
| `mcp__gitea__get_issue_comments_by_index` | Get issue comments |
| `mcp__gitea__get_pull_request_by_index` | Get pull request by index |
| `mcp__gitea__list_repo_pull_requests` | List pull requests |
| `mcp__gitea__list_pull_request_reviews` | List PR reviews |
| `mcp__gitea__get_pull_request_review` | Get PR review |
| `mcp__gitea__list_pull_request_review_comments` | List PR review comments |
| `mcp__gitea__get_release` | Get release |
| `mcp__gitea__get_latest_release` | Get latest release |
| `mcp__gitea__list_releases` | List releases |
| `mcp__gitea__get_tag` | Get tag |
| `mcp__gitea__list_tags` | List tags |
| `mcp__gitea__get_milestone` | Get milestone |
| `mcp__gitea__list_milestones` | List milestones |
| `mcp__gitea__search_org_teams` | Search organization teams |
| `mcp__gitea__list_org_labels` | List organization labels |
| `mcp__gitea__list_wiki_pages` | List wiki pages |
| `mcp__gitea__get_wiki_page` | Get wiki page |
| `mcp__gitea__get_wiki_revisions` | Get wiki revisions |
| `mcp__gitea__list_workflows` | List workflows |
| `mcp__gitea__list_workflow_runs` | List workflow runs |
| `mcp__gitea__get_workflow_run` | Get workflow run |
| `mcp__gitea__list_workflow_jobs` | List workflow jobs |
| `mcp__gitea__get_workflow_job_logs` | Get workflow job logs |
| `mcp__gitea__list_tracked_times` | List tracked times |
| `mcp__gitea__get_stopwatch` | Get stopwatch status |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__gitea__create_branch` | Create branch |
| `mcp__gitea__create_file` | Create file |
| `mcp__gitea__update_file` | Update file |
| `mcp__gitea__create_issue` | Create issue |
| `mcp__gitea__edit_issue` | Edit issue |
| `mcp__gitea__create_issue_comment` | Comment on issue |
| `mcp__gitea__edit_issue_comment` | Edit issue comment |
| `mcp__gitea__create_pull_request` | Create pull request |
| `mcp__gitea__create_pull_request_reviewer` | Add PR reviewer |
| `mcp__gitea__create_pull_request_review` | Create PR review |
| `mcp__gitea__submit_pull_request_review` | Submit PR review |
| `mcp__gitea__create_milestone` | Create milestone |
| `mcp__gitea__edit_milestone` | Edit milestone |
| `mcp__gitea__create_org_label` | Create organization label |
| `mcp__gitea__edit_org_label` | Edit organization label |
| `mcp__gitea__create_wiki_page` | Create wiki page |
| `mcp__gitea__update_wiki_page` | Update wiki page |
| `mcp__gitea__start_stopwatch` | Start time tracking |
| `mcp__gitea__stop_stopwatch` | Stop time tracking |
| `mcp__gitea__add_tracked_time` | Add tracked time |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__gitea__create_repo` | Create repository |
| `mcp__gitea__fork_repo` | Fork repository |
| `mcp__gitea__delete_branch` | Delete branch |
| `mcp__gitea__delete_file` | Delete file |
| `mcp__gitea__delete_pull_request_reviewer` | Remove PR reviewer |
| `mcp__gitea__delete_pull_request_review` | Delete PR review |
| `mcp__gitea__dismiss_pull_request_review` | Dismiss PR review |
| `mcp__gitea__create_release` | Create release |
| `mcp__gitea__delete_release` | Delete release |
| `mcp__gitea__create_tag` | Create tag |
| `mcp__gitea__delete_tag` | Delete tag |
| `mcp__gitea__delete_milestone` | Delete milestone |
| `mcp__gitea__delete_org_label` | Delete organization label |
| `mcp__gitea__delete_wiki_page` | Delete wiki page |
| `mcp__gitea__trigger_workflow` | Trigger workflow |
| `mcp__gitea__delete_tracked_time` | Delete tracked time |
