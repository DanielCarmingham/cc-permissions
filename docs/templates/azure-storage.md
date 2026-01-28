# azure-storage

Azure Storage CLI tools (az storage) for blobs, tables, queues, and file shares

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `az storage account list` | List storage accounts |
| `az storage account show` | Show storage account details |
| `az storage blob list` | List blobs |
| `az storage blob show` | Show blob properties |
| `az storage container list` | List containers |
| `az storage container show` | Show container properties |
| `az storage table list` | List storage tables |
| `az storage queue list` | List storage queues |
| `az storage share list` | List file shares |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `az storage blob download` | Download blob |
| `az storage blob download-batch` | Download blobs batch |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `az storage account create` | Create storage account |
| `az storage account delete` | Delete storage account |
| `az storage blob upload` | Upload blob |
| `az storage blob upload-batch` | Upload blobs batch |
| `az storage blob delete` | Delete blob |
| `az storage container create` | Create storage container |
| `az storage container delete` | Delete storage container |
| `az storage share create` | Create file share |
| `az storage share delete` | Delete file share |
| `az storage table create` | Create storage table |
| `az storage table delete` | Delete storage table |
| `az storage queue create` | Create storage queue |
| `az storage queue delete` | Delete storage queue |
