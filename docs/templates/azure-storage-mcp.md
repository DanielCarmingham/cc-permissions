# azure-storage-mcp

Azure Storage MCP Server tools (azmcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_storage_account_list` | List storage accounts |
| `mcp__azmcp__azmcp_storage_account_details` | Get storage account details |
| `mcp__azmcp__azmcp_storage_blob_container_list` | List blob containers |
| `mcp__azmcp__azmcp_storage_blob_container_details` | Get blob container details |
| `mcp__azmcp__azmcp_storage_blob_list` | List blobs in container |
| `mcp__azmcp__azmcp_storage_blob_details` | Get blob details |
| `mcp__azmcp__azmcp_storage_datalake_file_system_list_paths` | List Data Lake file system paths |
| `mcp__azmcp__azmcp_storage_table_list` | List storage tables |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_storage_blob_batch_set_tier` | Batch set blob access tier |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__azmcp__azmcp_storage_account_create` | Create storage account |
| `mcp__azmcp__azmcp_storage_blob_container_create` | Create blob container |
| `mcp__azmcp__azmcp_storage_blob_upload` | Upload blob |
| `mcp__azmcp__azmcp_storage_datalake_directory_create` | Create Data Lake directory |
