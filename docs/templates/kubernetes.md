# kubernetes

kubectl, Helm, k9s, and Minikube

**Category:** Container & Infrastructure

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `kubectl version` | Check kubectl version |
| `kubectl cluster-info` | Show cluster info |
| `kubectl config view` | View kubeconfig |
| `kubectl config current-context` | Show current context |
| `kubectl config get-contexts` | List contexts |
| `kubectl api-resources` | List API resources |
| `kubectl api-versions` | List API versions |
| `kubectl get` | Get resources |
| `kubectl describe` | Describe resources |
| `kubectl logs` | View pod logs |
| `kubectl top` | Show resource usage |
| `kubectl explain` | Explain resource fields |
| `helm version` | Check Helm version |
| `helm list` | List releases |
| `helm status` | Show release status |
| `helm history` | Show release history |
| `helm get` | Get release info |
| `helm show` | Show chart info |
| `helm search` | Search charts |
| `helm repo list` | List chart repos |
| `k9s version` | Check k9s version |
| `k9s info` | Show k9s info |
| `minikube version` | Check Minikube version |
| `minikube status` | Show Minikube status |
| `minikube profile list` | List Minikube profiles |
| `minikube ip` | Get Minikube IP |
| `minikube service list` | List services |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `kubectl apply` | Apply configuration |
| `kubectl create` | Create resources |
| `kubectl patch` | Patch resources |
| `kubectl label` | Label resources |
| `kubectl annotate` | Annotate resources |
| `kubectl exec` | Execute in pod |
| `kubectl port-forward` | Forward ports |
| `kubectl cp` | Copy files |
| `kubectl attach` | Attach to pod |
| `kubectl rollout status` | Check rollout status |
| `kubectl rollout history` | View rollout history |
| `kubectl rollout pause` | Pause rollout |
| `kubectl rollout resume` | Resume rollout |
| `kubectl rollout restart` | Restart rollout |
| `kubectl delete pod` | Delete pod (will restart) |
| `kubectl config use-context` | Switch context |
| `kubectl config set-context` | Set context |
| `helm template` | Render chart templates |
| `helm lint` | Lint chart |
| `helm dependency` | Manage dependencies |
| `helm diff` | Diff releases |
| `helm upgrade --dry-run` | Dry-run upgrade |
| `helm repo add` | Add chart repo |
| `helm repo update` | Update chart repos |
| `k9s` | Launch k9s UI |
| `minikube dashboard` | Open dashboard |
| `minikube tunnel` | Create tunnel |
| `minikube service` | Access service |
| `minikube logs` | View logs |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `kubectl delete` | Delete resources |
| `kubectl scale` | Scale resources |
| `kubectl autoscale` | Configure autoscaling |
| `kubectl edit` | Edit resources |
| `kubectl replace` | Replace resources |
| `kubectl set` | Set resource values |
| `kubectl rollout undo` | Undo rollout |
| `kubectl cordon` | Cordon node |
| `kubectl uncordon` | Uncordon node |
| `kubectl drain` | Drain node |
| `kubectl taint` | Taint node |
| `helm install` | Install chart |
| `helm upgrade` | Upgrade release |
| `helm uninstall` | Uninstall release |
| `helm rollback` | Rollback release |
| `helm repo remove` | Remove chart repo |
| `minikube start` | Start Minikube |
| `minikube stop` | Stop Minikube |
| `minikube delete` | Delete Minikube |
| `minikube addons enable` | Enable addon |
| `minikube addons disable` | Disable addon |
