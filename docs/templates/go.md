# go

Go development and golangci-lint

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `go version` | Check Go version |
| `go env` | Show Go environment |
| `go help` | Go help |
| `go list` | List packages |
| `go list -m` | List modules |
| `go mod graph` | Show module graph |
| `go mod why` | Explain module dependency |
| `go mod verify` | Verify dependencies |
| `go doc` | Show documentation |
| `golangci-lint --version` | Check golangci-lint version |
| `golangci-lint version` | Check golangci-lint version |
| `golangci-lint linters` | List available linters |
| `golangci-lint help` | golangci-lint help |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `go build` | Build package |
| `go build -v` | Build with verbose |
| `go build -race` | Build with race detector |
| `go test` | Run tests |
| `go test -v` | Run tests verbose |
| `go test -race` | Run tests with race detector |
| `go test -cover` | Run tests with coverage |
| `go test -coverprofile` | Generate coverage profile |
| `go test -bench` | Run benchmarks |
| `go run` | Run Go program |
| `go fmt` | Format code |
| `gofmt` | Format code |
| `go vet` | Vet code |
| `go mod tidy` | Tidy modules |
| `go mod edit` | Edit go.mod |
| `go generate` | Run go generate |
| `golangci-lint run` | Run linters |
| `golangci-lint run --fix` | Run linters with fix |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `go install` | Install package |
| `go get` | Download dependencies |
| `go get -u` | Update dependencies |
| `go mod download` | Download modules |
| `go mod vendor` | Vendor dependencies |
| `go clean` | Clean build cache |
| `go clean -cache` | Clean build cache |
| `go clean -testcache` | Clean test cache |
| `go clean -modcache` | Clean module cache |
| `go work init` | Initialize workspace |
| `go work use` | Add module to workspace |
| `go work sync` | Sync workspace |
