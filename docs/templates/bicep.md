# bicep

Azure Bicep infrastructure-as-code CLI

**Category:** Cloud Providers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `az bicep version` | Check Bicep CLI version |
| `az bicep list-versions` | List available Bicep versions |
| `az deployment group validate` | Validate a Bicep deployment |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `az bicep build` | Compile Bicep to ARM JSON |
| `az bicep build-params` | Build Bicep parameters file |
| `az bicep decompile` | Decompile ARM JSON to Bicep |
| `az bicep decompile-params` | Decompile parameters to .bicepparam |
| `az bicep format` | Format Bicep file |
| `az bicep lint` | Lint Bicep file |
| `az bicep generate-params` | Generate parameters file from Bicep |
| `az bicep restore` | Restore external modules |
| `az deployment group what-if` | Preview deployment changes |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `az bicep install` | Install Bicep CLI |
| `az bicep upgrade` | Upgrade Bicep CLI |
| `az bicep publish` | Publish module to registry |
| `az deployment group create` | Deploy Bicep template |
