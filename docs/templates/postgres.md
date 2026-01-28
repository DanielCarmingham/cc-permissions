# postgres

PostgreSQL CLI tools (psql, pg_dump, pg_restore)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `psql --version` | Check psql version |
| `psql -V` | Check psql version |
| `pg_config --version` | Check PostgreSQL config |
| `pg_isready` | Check PostgreSQL connection |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `psql -c "SELECT` | Run PostgreSQL SELECT query |
| `psql -c 'SELECT` | Run PostgreSQL SELECT query |
| `psql -c "\d` | PostgreSQL describe |
| `psql -c '\d` | PostgreSQL describe |
| `psql -c "\dt` | List PostgreSQL tables |
| `psql -c '\dt` | List PostgreSQL tables |
| `psql -c "\l` | List PostgreSQL databases |
| `psql -c '\l` | List PostgreSQL databases |
| `psql -c "EXPLAIN` | Explain PostgreSQL query |
| `psql -c 'EXPLAIN` | Explain PostgreSQL query |
| `pg_dump --schema-only` | Dump PostgreSQL schema |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `psql -c "INSERT` | PostgreSQL INSERT |
| `psql -c 'INSERT` | PostgreSQL INSERT |
| `psql -c "UPDATE` | PostgreSQL UPDATE |
| `psql -c 'UPDATE` | PostgreSQL UPDATE |
| `psql -c "DELETE` | PostgreSQL DELETE |
| `psql -c 'DELETE` | PostgreSQL DELETE |
| `psql -c "CREATE` | PostgreSQL CREATE |
| `psql -c 'CREATE` | PostgreSQL CREATE |
| `psql -c "DROP` | PostgreSQL DROP |
| `psql -c 'DROP` | PostgreSQL DROP |
| `psql -c "ALTER` | PostgreSQL ALTER |
| `psql -c 'ALTER` | PostgreSQL ALTER |
| `psql -c "TRUNCATE` | PostgreSQL TRUNCATE |
| `psql -c 'TRUNCATE` | PostgreSQL TRUNCATE |
| `psql -f` | Run PostgreSQL script |
| `pg_dump` | Dump PostgreSQL database |
| `pg_restore` | Restore PostgreSQL database |
| `createdb` | Create PostgreSQL database |
| `dropdb` | Drop PostgreSQL database |
