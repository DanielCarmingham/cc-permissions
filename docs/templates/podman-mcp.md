# podman-mcp

Podman MCP Server tools for container management

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__podman__container_list` | List all Podman containers |
| `mcp__podman__container_inspect` | Inspect a Podman container |
| `mcp__podman__container_logs` | Get container logs |
| `mcp__podman__image_list` | List Podman images |
| `mcp__podman__network_list` | List Podman networks |
| `mcp__podman__volume_list` | List Podman volumes |
| `mcp__podman-mcp__list-containers` | List all Podman containers |
| `mcp__podman-mcp__get-logs` | Get container logs |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__podman__container_run` | Run a Podman container |
| `mcp__podman__container_stop` | Stop a Podman container |
| `mcp__podman__image_build` | Build container image |
| `mcp__podman__image_pull` | Pull image from registry |
| `mcp__podman-mcp__create-container` | Create a Podman container |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__podman__container_remove` | Remove a Podman container |
| `mcp__podman__image_push` | Push image to registry |
| `mcp__podman__image_remove` | Remove a Podman image |
| `mcp__podman-mcp__deploy-compose` | Deploy Podman Compose stack |
