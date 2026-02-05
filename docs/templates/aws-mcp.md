# aws-mcp

AWS MCP Server tools for cloud infrastructure and serverless development (awslabs/mcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__aws__suggest_aws_commands` | Generate AWS CLI suggestions |
| `mcp__aws__get_execution_plan` | Get step-by-step task guidance |
| `mcp__aws__read_documentation` | Fetch AWS docs as markdown |
| `mcp__aws__search_documentation` | Search AWS documentation |
| `mcp__aws__recommend` | Get documentation recommendations |
| `mcp__aws__get_available_services` | List available AWS services |
| `mcp__aws__validate_cloudformation_template` | Validate CloudFormation template syntax |
| `mcp__aws__check_cloudformation_template_compliance` | Check CloudFormation security compliance |
| `mcp__aws__troubleshoot_cloudformation_deployment` | Analyze failed CloudFormation stacks |
| `mcp__aws__search_cloudformation_documentation` | Search CloudFormation docs |
| `mcp__aws__get_cloudformation_pre_deploy_validation_instructions` | Get pre-deploy validation commands |
| `mcp__aws__search_cdk_documentation` | Search CDK documentation |
| `mcp__aws__search_cdk_samples_and_constructs` | Find CDK code examples |
| `mcp__aws__cdk_best_practices` | Get CDK best practices |
| `mcp__aws__read_iac_documentation_page` | Read IaC documentation page |
| `mcp__aws__CDKGeneralGuidance` | Get prescriptive CDK advice |
| `mcp__aws__GetAwsSolutionsConstructPattern` | Find architecture patterns |
| `mcp__aws__SearchGenAICDKConstructs` | Discover GenAI CDK constructs |
| `mcp__aws__GenerateBedrockAgentSchema` | Create OpenAPI schemas for Bedrock |
| `mcp__aws__LambdaLayerDocumentationProvider` | Get Lambda layer documentation |
| `mcp__aws__ExplainCDKNagRule` | Get CDK Nag rule guidance |
| `mcp__aws__CheckCDKNagSuppressions` | Validate CDK Nag suppressions |
| `mcp__aws__get_resource` | Get AWS resource details |
| `mcp__aws__list_resources` | List AWS resources |
| `mcp__aws__get_resource_schema_information` | Get resource schema info |
| `mcp__aws__get_request_status` | Get mutation request status |
| `mcp__aws__get_iac_guidance` | Get IaC platform recommendations |
| `mcp__aws__get_lambda_guidance` | Get Lambda suitability guidance |
| `mcp__aws__get_lambda_event_schemas` | Get Lambda event schemas |
| `mcp__aws__get_serverless_templates` | Get SAM template examples |
| `mcp__aws__deploy_serverless_app_help` | Get deployment instructions |
| `mcp__aws__webapp_deployment_help` | Get web app deployment help |
| `mcp__aws__list_registries` | List schema registries |
| `mcp__aws__search_schema` | Search schemas |
| `mcp__aws__describe_schema` | Get schema definitions |
| `mcp__aws__esm_guidance` | Get ESM setup guidance |
| `mcp__aws__esm_kafka_troubleshoot` | Troubleshoot Kafka ESM |
| `mcp__aws__esm_optimize` | Optimize event source mappings |
| `mcp__aws__sam_logs` | Fetch CloudWatch logs |
| `mcp__aws__get_metrics` | Get CloudWatch metrics |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__aws__sam_init` | Initialize SAM application |
| `mcp__aws__sam_build` | Build Lambda code |
| `mcp__aws__sam_local_invoke` | Run Lambda function locally |
| `mcp__aws__create_template` | Create CloudFormation template |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__aws__call_aws` | Execute AWS CLI commands |
| `mcp__aws__create_resource` | Create CloudFormation resource |
| `mcp__aws__update_resource` | Update CloudFormation resource |
| `mcp__aws__delete_resource` | Delete CloudFormation resource |
| `mcp__aws__sam_deploy` | Deploy application to AWS |
| `mcp__aws__deploy_webapp` | Deploy web application |
| `mcp__aws__configure_domain` | Configure custom domain |
| `mcp__aws__update_webapp_frontend` | Update frontend assets |
