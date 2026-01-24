# git

Git version control

**Category:** Version Control

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `git status` | Check working tree status |
| `git log` | View commit history |
| `git diff` | View changes |
| `git branch` | List branches |
| `git remote -v` | List remotes |
| `git show` | Show commit details |
| `git blame` | Show line-by-line authorship |
| `git config --list` | List git configuration |
| `git describe` | Describe commit with tags |
| `git shortlog` | Summarize git log |
| `git rev-parse` | Parse git revisions |
| `git ls-files` | List tracked files |
| `git ls-tree` | List tree contents |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `git add` | Stage changes |
| `git commit` | Create commits |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git fetch` | Fetch from remote |
| `git checkout` | Switch branches or restore files |
| `git switch` | Switch branches |
| `git restore` | Restore working tree files |
| `git merge` | Merge branches |
| `git stash` | Stash changes |
| `git tag` | Create tags |
| `git branch -d` | Delete merged branch |
| `git worktree` | Manage worktrees |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `git rebase` | Rebase branches |
| `git reset` | Reset changes |
| `git cherry-pick` | Cherry-pick commits |
| `git revert` | Revert commits |
| `git clean` | Clean untracked files |
| `git branch -D` | Force delete branch |
| `git push --force-with-lease` | Force push safely |
| `git reflog` | View reference logs |
| `git gc` | Garbage collection |
