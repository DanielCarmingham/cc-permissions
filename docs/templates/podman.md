# podman

Podman, Podman Compose, and Podman Machine

**Category:** Container & Infrastructure

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `podman --version` | Check Podman version |
| `podman version` | Show Podman version details |
| `podman info` | Show Podman system info |
| `podman ps` | List running containers |
| `podman container ls` | List containers |
| `podman container inspect` | Inspect container |
| `podman logs` | View container logs |
| `podman top` | Show container processes |
| `podman stats` | Show container stats |
| `podman port` | Show port mappings |
| `podman diff` | Show container changes |
| `podman images` | List images |
| `podman image ls` | List images |
| `podman image inspect` | Inspect image |
| `podman image history` | Show image history |
| `podman search` | Search container registries |
| `podman network ls` | List networks |
| `podman network inspect` | Inspect network |
| `podman volume ls` | List volumes |
| `podman volume inspect` | Inspect volume |
| `podman-compose --version` | Check Podman Compose version |
| `podman-compose version` | Check Podman Compose version |
| `podman-compose config` | Validate Compose config |
| `podman-compose ps` | List Compose containers |
| `podman machine list` | List Podman machines |
| `podman machine info` | Show Podman machine info |
| `podman machine inspect` | Inspect Podman machine |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `podman build` | Build container image |
| `podman image build` | Build container image |
| `podman run` | Run container |
| `podman container run` | Run container |
| `podman start` | Start container |
| `podman stop` | Stop container |
| `podman restart` | Restart container |
| `podman exec` | Execute in container |
| `podman attach` | Attach to container |
| `podman cp` | Copy files to/from container |
| `podman-compose up` | Start Compose services |
| `podman-compose down` | Stop Compose services |
| `podman-compose build` | Build Compose services |
| `podman-compose logs` | View Compose logs |
| `podman-compose exec` | Execute in Compose service |
| `podman-compose run` | Run Compose command |
| `podman machine start` | Start Podman machine |
| `podman machine stop` | Stop Podman machine |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `podman push` | Push image to registry |
| `podman pull` | Pull image from registry |
| `podman login` | Login to registry |
| `podman logout` | Logout from registry |
| `podman tag` | Tag image |
| `podman rm` | Remove container |
| `podman container rm` | Remove container |
| `podman container prune` | Remove stopped containers |
| `podman kill` | Kill container |
| `podman rmi` | Remove image |
| `podman image rm` | Remove image |
| `podman image prune` | Remove unused images |
| `podman network create` | Create network |
| `podman network rm` | Remove network |
| `podman network prune` | Remove unused networks |
| `podman network connect` | Connect to network |
| `podman network disconnect` | Disconnect from network |
| `podman volume create` | Create volume |
| `podman volume rm` | Remove volume |
| `podman volume prune` | Remove unused volumes |
| `podman system prune` | Remove unused data |
| `podman system reset` | Reset Podman storage |
| `podman machine rm` | Remove Podman machine |
