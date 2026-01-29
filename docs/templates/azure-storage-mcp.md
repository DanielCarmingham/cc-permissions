# azure-storage-mcp

Azure Storage MCP Server tools (azmcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_storage_account_get` | Get storage account details |
| `mcp__azmcp__azmcp_storage_container_get` | Get container details |
| `mcp__azmcp__azmcp_storage_blob_get` | Get blob details |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_storage_account_create` | Create storage account |
| `mcp__azmcp__azmcp_storage_container_create` | Create storage container |
| `mcp__azmcp__azmcp_storage_blob_upload` | Upload blob |
