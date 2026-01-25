# github-mcp

GitHub MCP Server tools for repository and workflow management

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__github__get_me` | Get current user info |
| `mcp__github__get_file_contents` | Get file contents |
| `mcp__github__get_repository_tree` | Get repository tree structure |
| `mcp__github__get_commit` | Get commit details |
| `mcp__github__list_commits` | List commits |
| `mcp__github__list_branches` | List branches |
| `mcp__github__get_tag` | Get tag details |
| `mcp__github__list_tags` | List tags |
| `mcp__github__issue_read` | Read issue details |
| `mcp__github__list_issues` | List issues |
| `mcp__github__list_issue_types` | List issue types |
| `mcp__github__pull_request_read` | Read pull request details |
| `mcp__github__list_pull_requests` | List pull requests |
| `mcp__github__get_label` | Get label details |
| `mcp__github__list_label` | List labels |
| `mcp__github__get_latest_release` | Get latest release |
| `mcp__github__get_release_by_tag` | Get release by tag |
| `mcp__github__list_releases` | List releases |
| `mcp__github__get_workflow_run` | Get workflow run details |
| `mcp__github__get_workflow_run_logs` | Get workflow run logs |
| `mcp__github__get_workflow_run_usage` | Get workflow usage stats |
| `mcp__github__get_job_logs` | Get job logs |
| `mcp__github__list_workflows` | List workflows |
| `mcp__github__list_workflow_runs` | List workflow runs |
| `mcp__github__list_workflow_jobs` | List workflow jobs |
| `mcp__github__list_workflow_run_artifacts` | List workflow artifacts |
| `mcp__github__download_workflow_run_artifact` | Download workflow artifact |
| `mcp__github__get_code_scanning_alert` | Get code scanning alert |
| `mcp__github__list_code_scanning_alerts` | List code scanning alerts |
| `mcp__github__get_secret_scanning_alert` | Get secret scanning alert |
| `mcp__github__list_secret_scanning_alerts` | List secret scanning alerts |
| `mcp__github__get_dependabot_alert` | Get Dependabot alert |
| `mcp__github__list_dependabot_alerts` | List Dependabot alerts |
| `mcp__github__get_global_security_advisory` | Get global security advisory |
| `mcp__github__list_global_security_advisories` | List global security advisories |
| `mcp__github__list_repository_security_advisories` | List repository security advisories |
| `mcp__github__list_org_repository_security_advisories` | List org repository security advisories |
| `mcp__github__get_discussion` | Get discussion details |
| `mcp__github__get_discussion_comments` | Get discussion comments |
| `mcp__github__list_discussions` | List discussions |
| `mcp__github__list_discussion_categories` | List discussion categories |
| `mcp__github__get_gist` | Get gist details |
| `mcp__github__list_gists` | List gists |
| `mcp__github__get_project` | Get project details |
| `mcp__github__get_project_field` | Get project field |
| `mcp__github__get_project_item` | Get project item |
| `mcp__github__list_projects` | List projects |
| `mcp__github__list_project_fields` | List project fields |
| `mcp__github__list_project_items` | List project items |
| `mcp__github__get_teams` | Get organization teams |
| `mcp__github__get_team_members` | Get team members |
| `mcp__github__get_notification_details` | Get notification details |
| `mcp__github__list_notifications` | List notifications |
| `mcp__github__list_starred_repositories` | List starred repositories |
| `mcp__github__search_code` | Search code |
| `mcp__github__search_issues` | Search issues |
| `mcp__github__search_pull_requests` | Search pull requests |
| `mcp__github__search_repositories` | Search repositories |
| `mcp__github__search_users` | Search users |
| `mcp__github__search_orgs` | Search organizations |
| `mcp__github__get_copilot_space` | Get Copilot space details |
| `mcp__github__list_copilot_spaces` | List Copilot spaces |
| `mcp__github__github_support_docs_search` | Search GitHub support docs |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__github__create_branch` | Create branch |
| `mcp__github__create_or_update_file` | Create or update file |
| `mcp__github__push_files` | Push multiple files |
| `mcp__github__issue_write` | Create/update issues |
| `mcp__github__add_issue_comment` | Add issue comment |
| `mcp__github__sub_issue_write` | Create/update sub-issues |
| `mcp__github__create_pull_request` | Create pull request |
| `mcp__github__update_pull_request` | Update pull request |
| `mcp__github__update_pull_request_branch` | Update PR branch |
| `mcp__github__add_comment_to_pending_review` | Add comment to pending review |
| `mcp__github__pull_request_review_write` | Submit PR review |
| `mcp__github__merge_pull_request` | Merge pull request |
| `mcp__github__label_write` | Create/update labels |
| `mcp__github__create_gist` | Create gist |
| `mcp__github__update_gist` | Update gist |
| `mcp__github__add_project_item` | Add project item |
| `mcp__github__update_project_item` | Update project item |
| `mcp__github__dismiss_notification` | Dismiss notification |
| `mcp__github__mark_all_notifications_read` | Mark all notifications read |
| `mcp__github__manage_notification_subscription` | Manage notification subscription |
| `mcp__github__manage_repository_notification_subscription` | Manage repo notification subscription |
| `mcp__github__star_repository` | Star repository |
| `mcp__github__unstar_repository` | Unstar repository |
| `mcp__github__assign_copilot_to_issue` | Assign Copilot to issue |
| `mcp__github__create_pull_request_with_copilot` | Create PR with Copilot |
| `mcp__github__request_copilot_review` | Request Copilot review |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__github__create_repository` | Create repository |
| `mcp__github__fork_repository` | Fork repository |
| `mcp__github__delete_file` | Delete file |
| `mcp__github__delete_project_item` | Delete project item |
| `mcp__github__run_workflow` | Trigger workflow run |
| `mcp__github__cancel_workflow_run` | Cancel workflow run |
| `mcp__github__rerun_workflow_run` | Rerun entire workflow |
| `mcp__github__rerun_failed_jobs` | Rerun failed jobs |
| `mcp__github__delete_workflow_run_logs` | Delete workflow logs |
