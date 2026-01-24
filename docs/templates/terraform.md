# terraform

Terraform, Terragrunt, and tflint

**Category:** Container & Infrastructure

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `terraform version` | Check Terraform version |
| `terraform -version` | Check Terraform version |
| `terraform providers` | List providers |
| `terraform providers schema` | Show provider schema |
| `terraform fmt -check` | Check formatting |
| `terraform fmt -diff` | Show format diff |
| `terraform validate` | Validate configuration |
| `terraform show` | Show state or plan |
| `terraform output` | Show outputs |
| `terraform graph` | Generate graph |
| `terraform state list` | List state resources |
| `terraform state show` | Show state resource |
| `terraform workspace list` | List workspaces |
| `terraform workspace show` | Show current workspace |
| `terragrunt --version` | Check Terragrunt version |
| `terragrunt graph-dependencies` | Show dependency graph |
| `terragrunt output` | Show Terragrunt outputs |
| `terragrunt validate` | Validate Terragrunt config |
| `tflint --version` | Check tflint version |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `terraform fmt` | Format configuration |
| `terraform init` | Initialize configuration |
| `terraform init -upgrade` | Upgrade providers |
| `terraform get` | Download modules |
| `terraform plan` | Create execution plan |
| `terraform plan -out` | Save plan to file |
| `terraform plan -target` | Plan specific resource |
| `terraform workspace select` | Select workspace |
| `terraform workspace new` | Create workspace |
| `terraform console` | Interactive console |
| `terragrunt init` | Initialize Terragrunt |
| `terragrunt plan` | Plan with Terragrunt |
| `terragrunt plan-all` | Plan all modules |
| `terragrunt run-all plan` | Plan all modules |
| `terragrunt fmt` | Format Terragrunt config |
| `tflint` | Run tflint |
| `tflint --init` | Initialize tflint plugins |
| `tflint --fix` | Fix tflint issues |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `terraform apply` | Apply changes |
| `terraform apply -auto-approve` | Apply without prompt |
| `terraform apply -target` | Apply specific resource |
| `terraform destroy` | Destroy infrastructure |
| `terraform destroy -auto-approve` | Destroy without prompt |
| `terraform destroy -target` | Destroy specific resource |
| `terraform state mv` | Move state resource |
| `terraform state rm` | Remove from state |
| `terraform state pull` | Pull remote state |
| `terraform state push` | Push state |
| `terraform state replace-provider` | Replace provider |
| `terraform import` | Import resource |
| `terraform taint` | Mark resource for recreation |
| `terraform untaint` | Unmark resource |
| `terraform workspace delete` | Delete workspace |
| `terraform refresh` | Refresh state |
| `terragrunt apply` | Apply with Terragrunt |
| `terragrunt destroy` | Destroy with Terragrunt |
| `terragrunt apply-all` | Apply all modules |
| `terragrunt destroy-all` | Destroy all modules |
| `terragrunt run-all apply` | Apply all modules |
| `terragrunt run-all destroy` | Destroy all modules |
