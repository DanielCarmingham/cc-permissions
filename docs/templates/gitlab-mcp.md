# gitlab-mcp

GitLab MCP Server tools for repository and workflow management

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
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
| `mcp__gitlab__create_project` | Create project |
| `mcp__gitlab__fork_project` | Fork project |
| `mcp__gitlab__delete_branch` | Delete branch |
| `mcp__gitlab__merge_merge_request` | Merge merge request |
| `mcp__gitlab__close_merge_request` | Close merge request |
| `mcp__gitlab__close_issue` | Close issue |
