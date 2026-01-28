# mariadb

MariaDB CLI tools (mariadb, mariadb-dump, mariadb-admin)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mariadb --version` | Check MariaDB version |
| `mariadb -V` | Check MariaDB version |
| `mariadb-admin version` | Check MariaDB admin version |
| `mariadb-admin ping` | Ping MariaDB server |
| `mariadb-admin status` | Check MariaDB status |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mariadb -e "SELECT` | Run MariaDB SELECT query |
| `mariadb -e 'SELECT` | Run MariaDB SELECT query |
| `mariadb -e "SHOW` | MariaDB SHOW command |
| `mariadb -e 'SHOW` | MariaDB SHOW command |
| `mariadb -e "DESCRIBE` | MariaDB DESCRIBE |
| `mariadb -e 'DESCRIBE` | MariaDB DESCRIBE |
| `mariadb -e "EXPLAIN` | Explain MariaDB query |
| `mariadb -e 'EXPLAIN` | Explain MariaDB query |
| `mariadb-dump --no-data` | Dump MariaDB schema only |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mariadb -e "INSERT` | MariaDB INSERT |
| `mariadb -e 'INSERT` | MariaDB INSERT |
| `mariadb -e "UPDATE` | MariaDB UPDATE |
| `mariadb -e 'UPDATE` | MariaDB UPDATE |
| `mariadb -e "DELETE` | MariaDB DELETE |
| `mariadb -e 'DELETE` | MariaDB DELETE |
| `mariadb -e "CREATE` | MariaDB CREATE |
| `mariadb -e 'CREATE` | MariaDB CREATE |
| `mariadb -e "DROP` | MariaDB DROP |
| `mariadb -e 'DROP` | MariaDB DROP |
| `mariadb -e "ALTER` | MariaDB ALTER |
| `mariadb -e 'ALTER` | MariaDB ALTER |
| `mariadb -e "TRUNCATE` | MariaDB TRUNCATE |
| `mariadb -e 'TRUNCATE` | MariaDB TRUNCATE |
| `mariadb-dump` | Dump MariaDB database |
| `mariadb-admin create` | Create MariaDB database |
| `mariadb-admin drop` | Drop MariaDB database |
