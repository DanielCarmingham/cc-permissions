# mongodb

MongoDB CLI tools (mongosh, mongodump, mongorestore)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mongosh --version` | Check mongosh version |
| `mongo --version` | Check mongo version |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mongosh --eval "db.getCollectionNames()"` | List MongoDB collections |
| `mongosh --eval 'db.getCollectionNames()'` | List MongoDB collections |
| `mongosh --eval "db.stats()"` | MongoDB database stats |
| `mongosh --eval 'db.stats()'` | MongoDB database stats |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mongosh --eval "db.` | MongoDB write operations |
| `mongosh --eval 'db.` | MongoDB write operations |
| `mongodump` | Dump MongoDB database |
| `mongorestore` | Restore MongoDB database |
