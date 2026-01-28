# docker-mcp

Docker MCP Server tools for container management

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__docker__list-containers` | List all Docker containers |
| `mcp__docker__get-logs` | Get container logs |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__docker__create-container` | Create a Docker container |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__docker__deploy-compose` | Deploy Docker Compose stack |
