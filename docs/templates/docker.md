# docker

Docker, Docker Compose, and Buildx

**Category:** Container & Infrastructure

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `docker --version` | Check Docker version |
| `docker version` | Show Docker version details |
| `docker info` | Show Docker system info |
| `docker ps` | List running containers |
| `docker container ls` | List containers |
| `docker container inspect` | Inspect container |
| `docker logs` | View container logs |
| `docker top` | Show container processes |
| `docker stats` | Show container stats |
| `docker port` | Show port mappings |
| `docker diff` | Show container changes |
| `docker images` | List images |
| `docker image ls` | List images |
| `docker image inspect` | Inspect image |
| `docker image history` | Show image history |
| `docker search` | Search Docker Hub |
| `docker network ls` | List networks |
| `docker network inspect` | Inspect network |
| `docker volume ls` | List volumes |
| `docker volume inspect` | Inspect volume |
| `docker-compose --version` | Check Compose version |
| `docker-compose version` | Check Compose version |
| `docker compose version` | Check Compose v2 version |
| `docker-compose config` | Validate Compose config |
| `docker compose config` | Validate Compose v2 config |
| `docker-compose ps` | List Compose containers |
| `docker compose ps` | List Compose v2 containers |
| `docker buildx version` | Check Buildx version |
| `docker buildx ls` | List Buildx builders |
| `docker buildx inspect` | Inspect Buildx builder |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `docker build` | Build Docker image |
| `docker image build` | Build Docker image |
| `docker buildx build` | Build with Buildx |
| `docker buildx bake` | Build with Bake |
| `docker run` | Run container |
| `docker container run` | Run container |
| `docker start` | Start container |
| `docker stop` | Stop container |
| `docker restart` | Restart container |
| `docker exec` | Execute in container |
| `docker attach` | Attach to container |
| `docker cp` | Copy files to/from container |
| `docker-compose up` | Start Compose services |
| `docker compose up` | Start Compose v2 services |
| `docker-compose down` | Stop Compose services |
| `docker compose down` | Stop Compose v2 services |
| `docker-compose build` | Build Compose services |
| `docker compose build` | Build Compose v2 services |
| `docker-compose logs` | View Compose logs |
| `docker compose logs` | View Compose v2 logs |
| `docker-compose exec` | Execute in Compose service |
| `docker compose exec` | Execute in Compose v2 service |
| `docker-compose run` | Run Compose command |
| `docker compose run` | Run Compose v2 command |
| `docker buildx create` | Create Buildx builder |
| `docker buildx use` | Switch Buildx builder |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `docker push` | Push image to registry |
| `docker pull` | Pull image from registry |
| `docker login` | Login to registry |
| `docker logout` | Logout from registry |
| `docker tag` | Tag image |
| `docker rm` | Remove container |
| `docker container rm` | Remove container |
| `docker container prune` | Remove stopped containers |
| `docker kill` | Kill container |
| `docker rmi` | Remove image |
| `docker image rm` | Remove image |
| `docker image prune` | Remove unused images |
| `docker network create` | Create network |
| `docker network rm` | Remove network |
| `docker network prune` | Remove unused networks |
| `docker network connect` | Connect to network |
| `docker network disconnect` | Disconnect from network |
| `docker volume create` | Create volume |
| `docker volume rm` | Remove volume |
| `docker volume prune` | Remove unused volumes |
| `docker system prune` | Remove unused data |
| `docker builder prune` | Remove build cache |
| `docker buildx rm` | Remove Buildx builder |
| `docker buildx prune` | Remove Buildx cache |
