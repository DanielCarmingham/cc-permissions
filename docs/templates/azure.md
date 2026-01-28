# azure

Azure CLI, Functions, Bicep, and Azure Developer CLI

**Category:** Cloud Providers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `az --version` | Check Azure CLI version |
| `az account show` | Show current account |
| `az account list` | List Azure accounts |
| `az configure --list-defaults` | List default config |
| `az group list` | List resource groups |
| `az group show` | Show resource group details |
| `az resource list` | List resources |
| `az resource show` | Show resource details |
| `az storage account list` | List storage accounts |
| `az storage account show` | Show storage account details |
| `az storage blob list` | List blobs |
| `az storage blob show` | Show blob properties |
| `az storage container list` | List containers |
| `az storage container show` | Show container properties |
| `az storage table list` | List storage tables |
| `az storage queue list` | List storage queues |
| `az storage share list` | List file shares |
| `az sql server list` | List SQL servers |
| `az sql server show` | Show SQL server details |
| `az sql db list` | List SQL databases |
| `az sql db show` | Show SQL database details |
| `az sql elastic-pool list` | List elastic pools |
| `az sql elastic-pool show` | Show elastic pool details |
| `az sql server firewall-rule list` | List SQL firewall rules |
| `az webapp list` | List web apps |
| `az webapp show` | Show web app details |
| `az functionapp list` | List function apps |
| `az functionapp show` | Show function app details |
| `func --version` | Check Azure Functions Core Tools version |
| `az acr list` | List container registries |
| `az aks list` | List AKS clusters |
| `az bicep version` | Check Bicep version |
| `azd version` | Check Azure Developer CLI version |
| `azd config list` | List azd config |
| `azd env list` | List azd environments |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `func start` | Start Functions locally |
| `func new` | Create new function |
| `func init` | Initialize Functions project |
| `func extensions install` | Install function extensions |
| `az bicep build` | Build Bicep file |
| `az bicep decompile` | Decompile ARM to Bicep |
| `az bicep format` | Format Bicep file |
| `az bicep lint` | Lint Bicep file |
| `azd init` | Initialize azd project |
| `azd env new` | Create azd environment |
| `azd env set` | Set azd environment variable |
| `azd env get-values` | Get environment values |
| `azd restore` | Restore dependencies |
| `azd build` | Build application |
| `az storage blob download` | Download blob |
| `az storage blob download-batch` | Download blobs batch |
| `az sql db audit-policy show` | Show SQL audit policy |
| `az sql db tde show` | Show SQL TDE status |
| `az sql db list-editions` | List SQL database editions |
| `az webapp log tail` | Tail webapp logs |
| `az functionapp log tail` | Tail function logs |
| `az monitor log-analytics query` | Query logs |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `az group create` | Create resource group |
| `az deployment group create` | Create resource group deployment |
| `az deployment sub create` | Create subscription deployment |
| `az deployment group delete` | Delete deployment |
| `az webapp deploy` | Deploy to web app |
| `az webapp create` | Create web app |
| `az webapp delete` | Delete web app |
| `az webapp up` | Quick deploy web app |
| `func azure functionapp publish` | Publish to Azure Functions |
| `az functionapp create` | Create function app |
| `az functionapp delete` | Delete function app |
| `azd up` | Provision and deploy with azd |
| `azd deploy` | Deploy with azd |
| `azd provision` | Provision Azure resources |
| `azd down` | Delete azd resources |
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
| `az sql server create` | Create SQL server |
| `az sql server delete` | Delete SQL server |
| `az sql db create` | Create SQL database |
| `az sql db delete` | Delete SQL database |
| `az sql db update` | Update SQL database |
| `az sql elastic-pool create` | Create elastic pool |
| `az sql elastic-pool delete` | Delete elastic pool |
| `az sql server firewall-rule create` | Create SQL firewall rule |
| `az sql server firewall-rule delete` | Delete SQL firewall rule |
| `az group delete` | Delete resource group |
| `az acr build` | Build with ACR |
| `az acr login` | Login to ACR |
