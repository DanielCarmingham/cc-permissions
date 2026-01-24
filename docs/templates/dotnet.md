# dotnet

dotnet CLI, NuGet, MSBuild

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `dotnet --version` | Check .NET version |
| `dotnet --info` | Display .NET information |
| `dotnet --list-sdks` | List installed SDKs |
| `dotnet --list-runtimes` | List installed runtimes |
| `dotnet help` | Get .NET help |
| `dotnet list` | List project references |
| `dotnet list package` | List NuGet packages |
| `dotnet list reference` | List project references |
| `dotnet nuget list source` | List NuGet sources |
| `nuget list` | List NuGet packages |
| `nuget sources list` | List NuGet sources |
| `dotnet msbuild -version` | Check MSBuild version |
| `msbuild -version` | Check MSBuild version (direct) |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `dotnet build` | Build the project |
| `dotnet run` | Run the project |
| `dotnet watch` | Watch and rebuild |
| `dotnet clean` | Clean build output |
| `dotnet publish` | Publish the project |
| `dotnet test` | Run tests |
| `dotnet format` | Format code |
| `dotnet msbuild` | Run MSBuild |
| `msbuild` | Run MSBuild (direct) |
| `dotnet ef migrations` | EF Core migrations |
| `dotnet ef dbcontext` | EF Core DbContext commands |
| `dotnet user-secrets` | Manage user secrets |
| `dotnet pack` | Create NuGet package |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `dotnet add package` | Add NuGet package |
| `dotnet add reference` | Add project reference |
| `dotnet remove package` | Remove NuGet package |
| `dotnet remove reference` | Remove project reference |
| `dotnet restore` | Restore NuGet packages |
| `dotnet new` | Create new project/file |
| `dotnet sln` | Solution file operations |
| `dotnet tool install` | Install .NET tool |
| `dotnet tool uninstall` | Uninstall .NET tool |
| `dotnet tool update` | Update .NET tool |
| `dotnet tool restore` | Restore .NET tools |
| `dotnet nuget push` | Push NuGet package |
| `dotnet nuget delete` | Delete NuGet package |
| `dotnet nuget add source` | Add NuGet source |
| `dotnet nuget remove source` | Remove NuGet source |
| `dotnet ef database` | EF Core database operations |
| `dotnet workload install` | Install workload |
| `dotnet workload update` | Update workloads |
| `dotnet workload uninstall` | Uninstall workload |
