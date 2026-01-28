# mysql

MySQL CLI tools (mysql, mysqldump, mysqladmin)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mysql --version` | Check MySQL version |
| `mysql -V` | Check MySQL version |
| `mysqladmin version` | Check MySQL admin version |
| `mysqladmin ping` | Ping MySQL server |
| `mysqladmin status` | Check MySQL status |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mysql -e "SELECT` | Run MySQL SELECT query |
| `mysql -e 'SELECT` | Run MySQL SELECT query |
| `mysql -e "SHOW` | MySQL SHOW command |
| `mysql -e 'SHOW` | MySQL SHOW command |
| `mysql -e "DESCRIBE` | MySQL DESCRIBE |
| `mysql -e 'DESCRIBE` | MySQL DESCRIBE |
| `mysql -e "EXPLAIN` | Explain MySQL query |
| `mysql -e 'EXPLAIN` | Explain MySQL query |
| `mysqldump --no-data` | Dump MySQL schema only |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mysql -e "INSERT` | MySQL INSERT |
| `mysql -e 'INSERT` | MySQL INSERT |
| `mysql -e "UPDATE` | MySQL UPDATE |
| `mysql -e 'UPDATE` | MySQL UPDATE |
| `mysql -e "DELETE` | MySQL DELETE |
| `mysql -e 'DELETE` | MySQL DELETE |
| `mysql -e "CREATE` | MySQL CREATE |
| `mysql -e 'CREATE` | MySQL CREATE |
| `mysql -e "DROP` | MySQL DROP |
| `mysql -e 'DROP` | MySQL DROP |
| `mysql -e "ALTER` | MySQL ALTER |
| `mysql -e 'ALTER` | MySQL ALTER |
| `mysql -e "TRUNCATE` | MySQL TRUNCATE |
| `mysql -e 'TRUNCATE` | MySQL TRUNCATE |
| `mysqldump` | Dump MySQL database |
| `mysqladmin create` | Create MySQL database |
| `mysqladmin drop` | Drop MySQL database |
