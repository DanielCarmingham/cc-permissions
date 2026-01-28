# sqlite-mcp

SQLite MCP Server tools for database operations

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__sqlite__read_query` | Execute SELECT queries |
| `mcp__sqlite__list_tables` | List database tables |
| `mcp__sqlite__describe_table` | Get table schema |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__sqlite__write_query` | Execute INSERT/UPDATE/DELETE queries |
| `mcp__sqlite__create_table` | Create new database table |
| `mcp__sqlite__append_insight` | Add business insight to memo |
