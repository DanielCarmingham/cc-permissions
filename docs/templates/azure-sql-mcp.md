# azure-sql-mcp

Azure SQL Database MCP Server tools (azmcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_sql_server_list` | List SQL servers |
| `mcp__azmcp__azmcp_sql_server_show` | Show SQL server details |
| `mcp__azmcp__azmcp_sql_server_auth_list_entra_admins` | List SQL server Entra admins |
| `mcp__azmcp__azmcp_sql_firewall_list_rules` | List SQL firewall rules |
| `mcp__azmcp__azmcp_sql_db_list` | List SQL databases |
| `mcp__azmcp__azmcp_sql_db_show` | Show SQL database details |
| `mcp__azmcp__azmcp_sql_elastic_pool_list` | List elastic pools |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_sql_db_update` | Update SQL database |
| `mcp__azmcp__azmcp_sql_db_rename` | Rename SQL database |
| `mcp__azmcp__azmcp_sql_firewall_create_rule` | Create SQL firewall rule |
| `mcp__azmcp__azmcp_sql_firewall_delete_rule` | Delete SQL firewall rule |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_sql_db_create` | Create SQL database |
| `mcp__azmcp__azmcp_sql_db_delete` | Delete SQL database |
| `mcp__azmcp__azmcp_sql_server_create` | Create SQL server |
| `mcp__azmcp__azmcp_sql_server_delete` | Delete SQL server |
