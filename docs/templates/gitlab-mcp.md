# gitlab-mcp

GitLab MCP Server tools for repository and workflow management (zereight/gitlab-mcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__gitlab__search` | Search GitLab |
| `mcp__gitlab__search_code` | Semantic code search |
| `mcp__gitlab__get_project` | Get project details |
| `mcp__gitlab__list_projects` | List projects |
| `mcp__gitlab__search_repositories` | Search repositories |
| `mcp__gitlab__get_file_contents` | Get file or directory contents |
| `mcp__gitlab__get_repository_tree` | Get repository file tree |
| `mcp__gitlab__list_commits` | List commits |
| `mcp__gitlab__get_commit` | Get commit details |
| `mcp__gitlab__get_commit_diff` | Get commit diff |
| `mcp__gitlab__get_issue` | Get issue details |
| `mcp__gitlab__list_issues` | List issues |
| `mcp__gitlab__my_issues` | List issues assigned to me |
| `mcp__gitlab__list_issue_links` | List issue links |
| `mcp__gitlab__get_issue_link` | Get issue link details |
| `mcp__gitlab__list_issue_discussions` | List issue discussions |
| `mcp__gitlab__get_merge_request` | Get merge request details |
| `mcp__gitlab__list_merge_requests` | List merge requests |
| `mcp__gitlab__get_merge_request_diffs` | Get MR diffs |
| `mcp__gitlab__list_merge_request_diffs` | List MR diffs |
| `mcp__gitlab__get_branch_diffs` | Get branch diffs |
| `mcp__gitlab__mr_discussions` | Get MR discussions |
| `mcp__gitlab__get_merge_request_approval_state` | Get MR approval state |
| `mcp__gitlab__get_draft_note` | Get draft note |
| `mcp__gitlab__list_draft_notes` | List draft notes |
| `mcp__gitlab__list_namespaces` | List namespaces |
| `mcp__gitlab__get_namespace` | Get namespace details |
| `mcp__gitlab__verify_namespace` | Verify namespace existence |
| `mcp__gitlab__list_labels` | List project labels |
| `mcp__gitlab__get_label` | Get label details |
| `mcp__gitlab__list_project_members` | List project members |
| `mcp__gitlab__get_users` | Get user information |
| `mcp__gitlab__list_group_projects` | List projects in a group |
| `mcp__gitlab__list_group_iterations` | List group iterations |
| `mcp__gitlab__list_pipelines` | List pipelines |
| `mcp__gitlab__get_pipeline` | Get pipeline details |
| `mcp__gitlab__list_pipeline_jobs` | List pipeline jobs |
| `mcp__gitlab__list_pipeline_trigger_jobs` | List pipeline trigger jobs |
| `mcp__gitlab__get_pipeline_job` | Get pipeline job details |
| `mcp__gitlab__get_pipeline_job_output` | Get pipeline job output |
| `mcp__gitlab__list_milestones` | List milestones |
| `mcp__gitlab__get_milestone` | Get milestone details |
| `mcp__gitlab__get_milestone_issue` | Get milestone issues |
| `mcp__gitlab__get_milestone_merge_requests` | Get milestone merge requests |
| `mcp__gitlab__get_milestone_burndown_events` | Get milestone burndown events |
| `mcp__gitlab__list_wiki_pages` | List wiki pages |
| `mcp__gitlab__get_wiki_page` | Get wiki page |
| `mcp__gitlab__list_releases` | List releases |
| `mcp__gitlab__get_release` | Get release details |
| `mcp__gitlab__download_release_asset` | Download release asset |
| `mcp__gitlab__list_events` | List events |
| `mcp__gitlab__get_project_events` | Get project events |
| `mcp__gitlab__download_attachment` | Download attachment |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__gitlab__create_branch` | Create branch |
| `mcp__gitlab__create_or_update_file` | Create or update file |
| `mcp__gitlab__push_files` | Push multiple files |
| `mcp__gitlab__create_issue` | Create issue |
| `mcp__gitlab__update_issue` | Update issue |
| `mcp__gitlab__create_issue_note` | Comment on issue |
| `mcp__gitlab__update_issue_note` | Update issue comment |
| `mcp__gitlab__create_issue_link` | Create issue link |
| `mcp__gitlab__create_merge_request` | Create merge request |
| `mcp__gitlab__update_merge_request` | Update merge request |
| `mcp__gitlab__create_merge_request_note` | Comment on MR |
| `mcp__gitlab__update_merge_request_note` | Update MR comment |
| `mcp__gitlab__create_merge_request_thread` | Create MR discussion thread |
| `mcp__gitlab__create_note` | Create note on issue or MR |
| `mcp__gitlab__approve_merge_request` | Approve merge request |
| `mcp__gitlab__unapprove_merge_request` | Unapprove merge request |
| `mcp__gitlab__create_draft_note` | Create draft note |
| `mcp__gitlab__update_draft_note` | Update draft note |
| `mcp__gitlab__publish_draft_note` | Publish draft note |
| `mcp__gitlab__bulk_publish_draft_notes` | Publish all draft notes |
| `mcp__gitlab__create_label` | Create label |
| `mcp__gitlab__update_label` | Update label |
| `mcp__gitlab__create_milestone` | Create milestone |
| `mcp__gitlab__edit_milestone` | Edit milestone |
| `mcp__gitlab__promote_milestone` | Promote milestone to group |
| `mcp__gitlab__create_wiki_page` | Create wiki page |
| `mcp__gitlab__update_wiki_page` | Update wiki page |
| `mcp__gitlab__create_release` | Create release |
| `mcp__gitlab__update_release` | Update release |
| `mcp__gitlab__create_release_evidence` | Create release evidence |
| `mcp__gitlab__create_pipeline` | Create pipeline |
| `mcp__gitlab__retry_pipeline` | Retry pipeline |
| `mcp__gitlab__retry_pipeline_job` | Retry pipeline job |
| `mcp__gitlab__play_pipeline_job` | Play manual pipeline job |
| `mcp__gitlab__upload_markdown` | Upload markdown attachment |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__gitlab__create_repository` | Create repository |
| `mcp__gitlab__fork_repository` | Fork repository |
| `mcp__gitlab__delete_branch` | Delete branch |
| `mcp__gitlab__merge_merge_request` | Merge merge request |
| `mcp__gitlab__delete_issue` | Delete issue |
| `mcp__gitlab__delete_issue_link` | Delete issue link |
| `mcp__gitlab__delete_draft_note` | Delete draft note |
| `mcp__gitlab__delete_label` | Delete label |
| `mcp__gitlab__delete_milestone` | Delete milestone |
| `mcp__gitlab__delete_wiki_page` | Delete wiki page |
| `mcp__gitlab__delete_release` | Delete release |
| `mcp__gitlab__cancel_pipeline` | Cancel pipeline |
| `mcp__gitlab__cancel_pipeline_job` | Cancel pipeline job |
