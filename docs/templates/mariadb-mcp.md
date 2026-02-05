# mariadb-mcp

MariaDB MCP Server tools for database management (MariaDB/mcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__mariadb__list_databases` | List all accessible databases |
| `mcp__mariadb__list_tables` | List tables in a database |
| `mcp__mariadb__get_table_schema` | Get table schema (columns, types, keys) |
| `mcp__mariadb__get_table_schema_with_relations` | Get table schema with foreign key relations |
| `mcp__mariadb__execute_sql` | Execute read-only SQL (SELECT, SHOW, DESCRIBE) |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__mariadb__list_vector_stores` | List vector stores |
| `mcp__mariadb__search_vector_store` | Search vector store |
| `mcp__mariadb__insert_docs_vector_store` | Insert documents into vector store |
| `mcp__mariadb__create_vector_store` | Create a vector store |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__mariadb__create_database` | Create a new database |
| `mcp__mariadb__delete_vector_store` | Delete a vector store |
