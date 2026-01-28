# azure-sql

Azure SQL Database CLI tools (az sql)

**Category:** Database

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `az sql server list` | List SQL servers |
| `az sql server show` | Show SQL server details |
| `az sql server firewall-rule list` | List SQL firewall rules |
| `az sql db list` | List SQL databases |
| `az sql db show` | Show SQL database details |
| `az sql db list-editions` | List SQL database editions |
| `az sql db audit-policy show` | Show SQL audit policy |
| `az sql db tde show` | Show SQL TDE status |
| `az sql elastic-pool list` | List elastic pools |
| `az sql elastic-pool show` | Show elastic pool details |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `az sql server firewall-rule create` | Create SQL firewall rule |
| `az sql server firewall-rule delete` | Delete SQL firewall rule |
| `az sql db update` | Update SQL database |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `az sql server create` | Create SQL server |
| `az sql server delete` | Delete SQL server |
| `az sql db create` | Create SQL database |
| `az sql db delete` | Delete SQL database |
| `az sql elastic-pool create` | Create elastic pool |
| `az sql elastic-pool delete` | Delete elastic pool |
