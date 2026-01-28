# redis

Redis CLI tools (redis-cli)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `redis-cli --version` | Check redis-cli version |
| `redis-cli -v` | Check redis-cli version |
| `redis-cli ping` | Ping Redis server |
| `redis-cli info` | Get Redis info |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
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

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
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
