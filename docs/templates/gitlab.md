# gitlab

GitLab CLI (glab) for repository and workflow management

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
