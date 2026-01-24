# shell

Basic shell and filesystem commands

**Category:** General

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cat` | View file contents |
| `head` | View file beginning |
| `tail` | View file end |
| `less` | Page through file |
| `more` | Page through file |
| `grep` | Search file contents |
| `find` | Find files |
| `wc` | Count lines/words/chars |
| `tree` | Display directory tree |
| `pwd` | Print working directory |
| `which` | Locate a command |
| `whereis` | Locate binary/source/manual |
| `type` | Describe command type |
| `file` | Determine file type |
| `stat` | Display file status |
| `du` | Disk usage |
| `df` | Disk free space |
| `echo` | Print text |
| `printf` | Format and print |
| `env` | View environment variables |
| `printenv` | Print environment variables |
| `date` | Display date/time |
| `whoami` | Print current user |
| `uname` | System information |
| `hostname` | Show hostname |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mkdir` | Create directories |
| `touch` | Create empty files |
| `cp` | Copy files |
| `mv` | Move/rename files |
| `ln` | Create links |
| `chmod` | Change file permissions |
| `chown` | Change file owner |
| `tar` | Archive files |
| `zip` | Compress files |
| `unzip` | Extract zip files |
| `gzip` | Compress files |
| `gunzip` | Decompress files |
| `curl` | Transfer data from URLs |
| `wget` | Download files |
| `diff` | Compare files |
| `sort` | Sort lines |
| `uniq` | Filter duplicate lines |
| `cut` | Cut sections from lines |
| `awk` | Pattern processing |
| `sed` | Stream editor |
| `xargs` | Build command lines |
| `tee` | Read and write to files |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `rm` | Remove files |
| `rmdir` | Remove directories |
| `kill` | Terminate processes |
| `pkill` | Kill processes by name |
| `killall` | Kill processes by name |
