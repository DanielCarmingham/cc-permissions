# database

PostgreSQL, MySQL, MongoDB, and Redis CLI tools

**Category:** Utilities

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `psql --version` | Check psql version |
| `psql -V` | Check psql version |
| `pg_config --version` | Check PostgreSQL config |
| `pg_isready` | Check PostgreSQL connection |
| `mysql --version` | Check MySQL version |
| `mysql -V` | Check MySQL version |
| `mysqladmin version` | Check MySQL admin version |
| `mysqladmin ping` | Ping MySQL server |
| `mysqladmin status` | Check MySQL status |
| `mongosh --version` | Check mongosh version |
| `mongo --version` | Check mongo version |
| `redis-cli --version` | Check redis-cli version |
| `redis-cli -v` | Check redis-cli version |
| `redis-cli ping` | Ping Redis server |
| `redis-cli info` | Get Redis info |
| `sqlite3 --version` | Check SQLite version |
| `sqlite3 -version` | Check SQLite version |

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
| `mysql -e "SELECT` | Run MySQL SELECT query |
| `mysql -e 'SELECT` | Run MySQL SELECT query |
| `mysql -e "SHOW` | MySQL SHOW command |
| `mysql -e 'SHOW` | MySQL SHOW command |
| `mysql -e "DESCRIBE` | MySQL DESCRIBE |
| `mysql -e 'DESCRIBE` | MySQL DESCRIBE |
| `mysql -e "EXPLAIN` | Explain MySQL query |
| `mysql -e 'EXPLAIN` | Explain MySQL query |
| `mysqldump --no-data` | Dump MySQL schema only |
| `mongosh --eval "db.getCollectionNames()"` | List MongoDB collections |
| `mongosh --eval 'db.getCollectionNames()'` | List MongoDB collections |
| `mongosh --eval "db.stats()"` | MongoDB database stats |
| `mongosh --eval 'db.stats()'` | MongoDB database stats |
| `redis-cli GET` | Redis GET key |
| `redis-cli KEYS` | Redis list keys |
| `redis-cli SCAN` | Redis scan keys |
| `redis-cli TYPE` | Redis get key type |
| `redis-cli TTL` | Redis get TTL |
| `redis-cli EXISTS` | Redis check key exists |
| `redis-cli HGETALL` | Redis get hash |
| `redis-cli LRANGE` | Redis get list range |
| `redis-cli SMEMBERS` | Redis get set members |
| `redis-cli ZRANGE` | Redis get sorted set range |
| `redis-cli DBSIZE` | Redis get database size |
| `sqlite3` | SQLite CLI |

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
| `mongosh --eval "db.` | MongoDB write operations |
| `mongosh --eval 'db.` | MongoDB write operations |
| `mongodump` | Dump MongoDB database |
| `mongorestore` | Restore MongoDB database |
| `redis-cli SET` | Redis SET key |
| `redis-cli DEL` | Redis DELETE key |
| `redis-cli HSET` | Redis set hash field |
| `redis-cli HDEL` | Redis delete hash field |
| `redis-cli LPUSH` | Redis push to list |
| `redis-cli RPUSH` | Redis push to list |
| `redis-cli SADD` | Redis add to set |
| `redis-cli SREM` | Redis remove from set |
| `redis-cli ZADD` | Redis add to sorted set |
| `redis-cli ZREM` | Redis remove from sorted set |
| `redis-cli FLUSHDB` | Redis flush database |
| `redis-cli FLUSHALL` | Redis flush all databases |
