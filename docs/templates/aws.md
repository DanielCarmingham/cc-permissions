# aws

AWS CLI, SAM, CDK, Amplify, and Elastic Beanstalk

**Category:** Cloud Providers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `aws --version` | Check AWS CLI version |
| `aws sts get-caller-identity` | Get current AWS identity |
| `aws configure list` | List AWS configuration |
| `aws configure get` | Get AWS config values |
| `aws s3 ls` | List S3 buckets/objects |
| `aws s3api list-buckets` | List S3 buckets |
| `aws s3api get-bucket-location` | Get bucket location |
| `aws ec2 describe-instances` | Describe EC2 instances |
| `aws ec2 describe-vpcs` | Describe VPCs |
| `aws ec2 describe-security-groups` | Describe security groups |
| `aws ec2 describe-subnets` | Describe subnets |
| `aws iam list-users` | List IAM users |
| `aws iam list-roles` | List IAM roles |
| `aws iam list-policies` | List IAM policies |
| `aws iam get-user` | Get IAM user details |
| `aws iam get-role` | Get IAM role details |
| `aws lambda list-functions` | List Lambda functions |
| `aws lambda get-function` | Get Lambda function details |
| `aws cloudformation list-stacks` | List CloudFormation stacks |
| `aws cloudformation describe-stacks` | Describe CF stacks |
| `sam --version` | Check SAM CLI version |
| `sam --info` | SAM CLI info |
| `cdk --version` | Check CDK version |
| `cdk doctor` | CDK environment check |
| `cdk list` | List CDK stacks |
| `amplify --version` | Check Amplify version |
| `amplify status` | Amplify project status |
| `amplify env list` | List Amplify environments |
| `eb --version` | Check EB CLI version |
| `eb status` | Elastic Beanstalk status |
| `eb list` | List EB environments |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `aws s3 cp` | Copy to/from S3 |
| `aws s3 sync` | Sync with S3 |
| `aws s3 mv` | Move in S3 |
| `aws s3 presign` | Generate presigned URL |
| `aws logs describe-log-groups` | Describe log groups |
| `aws logs filter-log-events` | Filter log events |
| `aws logs tail` | Tail log group |
| `sam build` | Build SAM application |
| `sam local invoke` | Invoke Lambda locally |
| `sam local start-api` | Start local API Gateway |
| `sam local start-lambda` | Start local Lambda |
| `sam validate` | Validate SAM template |
| `cdk synth` | Synthesize CDK stack |
| `cdk diff` | Diff CDK stack changes |
| `cdk context` | Manage CDK context |
| `amplify mock` | Mock Amplify locally |
| `amplify codegen` | Generate Amplify code |
| `eb local run` | Run EB locally |
| `eb logs` | View EB logs |
| `eb health` | Check EB health |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `aws s3 rm` | Remove from S3 |
| `aws s3 rb` | Remove S3 bucket |
| `aws s3api delete-object` | Delete S3 object |
| `aws lambda update-function-code` | Update Lambda code |
| `aws lambda create-function` | Create Lambda function |
| `aws lambda delete-function` | Delete Lambda function |
| `sam deploy` | Deploy SAM application |
| `sam delete` | Delete SAM application |
| `sam package` | Package SAM application |
| `cdk deploy` | Deploy CDK stack |
| `cdk destroy` | Destroy CDK stack |
| `cdk bootstrap` | Bootstrap CDK environment |
| `amplify push` | Push Amplify changes |
| `amplify publish` | Publish Amplify app |
| `amplify delete` | Delete Amplify resources |
| `amplify pull` | Pull Amplify backend |
| `eb deploy` | Deploy to Elastic Beanstalk |
| `eb create` | Create EB environment |
| `eb terminate` | Terminate EB environment |
| `aws cloudformation create-stack` | Create CF stack |
| `aws cloudformation update-stack` | Update CF stack |
| `aws cloudformation delete-stack` | Delete CF stack |
