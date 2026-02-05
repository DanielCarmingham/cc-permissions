# docker-mcp

Docker MCP Server tools for container management

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__docker__list-containers` | List all Docker containers |
| `mcp__docker__get-logs` | Get container logs |
| `mcp__mcp-server-docker__list_containers` | List all Docker containers |
| `mcp__mcp-server-docker__fetch_container_logs` | Get container logs |
| `mcp__mcp-server-docker__list_images` | List Docker images |
| `mcp__mcp-server-docker__list_networks` | List Docker networks |
| `mcp__mcp-server-docker__list_volumes` | List Docker volumes |
| `mcp__mcp-server-docker__docker_info` | Get Docker system information |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__docker__create-container` | Create a Docker container |
| `mcp__mcp-server-docker__create_container` | Create a Docker container |
| `mcp__mcp-server-docker__run_container` | Create and start a container |
| `mcp__mcp-server-docker__start_container` | Start a stopped container |
| `mcp__mcp-server-docker__stop_container` | Stop a running container |
| `mcp__mcp-server-docker__recreate_container` | Recreate a container |
| `mcp__mcp-server-docker__pull_image` | Pull image from registry |
| `mcp__mcp-server-docker__build_image` | Build image from Dockerfile |
| `mcp__mcp-server-docker__create_network` | Create a Docker network |
| `mcp__mcp-server-docker__create_volume` | Create a Docker volume |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__docker__deploy-compose` | Deploy Docker Compose stack |
| `mcp__mcp-server-docker__remove_container` | Remove a container |
| `mcp__mcp-server-docker__push_image` | Push image to registry |
| `mcp__mcp-server-docker__remove_image` | Remove a Docker image |
| `mcp__mcp-server-docker__remove_network` | Remove a Docker network |
| `mcp__mcp-server-docker__remove_volume` | Remove a Docker volume |
