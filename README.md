# OpenDDS Performance Dashboard

This repository contains the public OpenDDS Bench dashboard and the AWS
infrastructure used to build OpenDDS, create an isolated performance-test fleet
on demand, execute Bench scenarios, and publish summarized results.

## Architecture

The persistent CDK stack contains private S3 buckets, CloudFront, a DynamoDB
run ledger and lease, CodeBuild projects, a Standard Step Functions workflow,
GitHub OIDC roles, and an isolated VPC. Each benchmark execution creates a
separate CDK stack containing EC2 instances, a cluster placement group, and an
IGMPv2 Transit Gateway multicast domain. The execution stack is deleted after
results are staged, including on test failures.

Instances have no public IP, SSH key, Internet route, or NAT Gateway. They use
free S3 and DynamoDB gateway endpoints for artifacts and status. An hourly
reaper deletes run stacks older than twelve hours as a backstop.

The supported automatic topologies are:

| Suite | Legs | Physical cores per leg | Scenarios |
| --- | ---: | ---: | ---: |
| validation | 3 | 2 | 3 |
| core | 12 | 4 | 15 |
| full | 30 | 4 | 81 |

The historical 120-leg topology is intentionally unsupported because the
controller plus legs would exceed AWS's limit of 100 receivers in one Transit
Gateway multicast group. Legacy OpenDDS UDP and multicast transports removed
in 2024 remain historical-only; RTPS multicast discovery and `rtps_udp` remain
part of the active suites.

## Local development

```sh
npm ci --prefix ui
npm test --prefix ui -- --runInBand
npm run dev --prefix ui
```

The optional local proxy in `server/` remains available for archived datasets,
but production reads the same-origin static contract directly from CloudFront:

- `bench2/run_index.json`
- `bench2/stat_properties.json`
- `bench2/raw/<run-id>/results.json`

Validate or import recovered data with:

```sh
node tools/validate-contracts.mjs path/to/run_index.json path/to/results.json
node tools/import-centipede.mjs path/to/recovered/bench2 path/to/output/bench2
```

## Deploying the control plane

CDK deliberately has no default region, AMI, Availability Zone, or EC2 type.
Choose a region that supports Transit Gateway multicast and confirm the
instance type accepts the configured CPU options before enabling schedules.
The release bundle is built on Amazon Linux 2023 and smoke-tested for missing
shared libraries. Use the full AWS-maintained Amazon Linux 2023 x86-64 AMI,
which includes AWS CLI v2, and pin the concrete AMI ID returned in the target
region:

```sh
aws ssm get-parameter \
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
  --region "$CDK_DEFAULT_REGION" \
  --query Parameter.Value \
  --output text
```

The release CodeBuild project uses the Linux `LARGE` class. This keeps an
occasional build inexpensive and uses the standard account quota, at the cost
of a longer compile than the `2XLARGE` class.

```sh
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-2
npm ci --prefix infra
npm run build --prefix infra
npm run synth --prefix infra -- -c stage=dev
npx --prefix infra cdk bootstrap aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION
npx --prefix infra cdk deploy OpenDdsPerformance-dev -c stage=dev
```

Configure the OpenDDS repository variables from the stack outputs:

- `PERFORMANCE_AWS_ROLE_ARN`
- `PERFORMANCE_AWS_REGION`
- `PERFORMANCE_STATE_MACHINE_ARN`
- `PERFORMANCE_VALIDATION_INSTANCE_TYPE` (`c7i.xlarge` for the fork)
- `PERFORMANCE_CORE_INSTANCE_TYPE` (`c7i.2xlarge`)
- `PERFORMANCE_FULL_INSTANCE_TYPE` (`c7i.2xlarge`)
- `PERFORMANCE_AMI_ID`
- `PERFORMANCE_AVAILABILITY_ZONE`

Configure this repository's deployment variables with
`DashboardDeployRoleArn`, `DashboardBucketName`, and
`CloudFrontDistributionId`, plus `AWS_REGION`.

### Fork validation

Repository URLs, the dashboard branch, and GitHub OIDC subjects are CDK
contexts. This allows an isolated control plane to build commits that exist
only in forks without broadening the production role trust policy. For the
current `simpsont-oci` forks, deploy with:

```sh
npx --prefix infra cdk deploy OpenDdsPerformance-fork \
  -c stage=fork \
  -c openDdsRepoUrl=https://github.com/simpsont-oci/OpenDDS.git \
  -c nightlyRepoUrl=https://github.com/OpenDDS/nightly.git \
  -c dashboardRepoUrl=https://github.com/simpsont-oci/opendds-performance-dashboard.git \
  -c dashboardRef=aws-performance-testing \
  -c 'openDdsOidcSubject=repo:simpsont-oci@32278075/OpenDDS@1307039839:*' \
  -c 'dashboardOidcSubject=repo:simpsont-oci@32278075/opendds-performance-dashboard@1307044731:ref:refs/heads/aws-performance-testing'
```

The numeric values are GitHub's immutable owner and repository IDs for these
forks. If GitHub reports the legacy OIDC subject format for a workflow token,
use `repo:simpsont-oci/OpenDDS:*` and the corresponding branch-qualified
dashboard subject instead.

Fork OpenDDS workflows are manual-only by default. Set
`PERFORMANCE_AUTOMATIC_RUNS=true` only after the validation suite has completed
and cleaned up successfully. `PERFORMANCE_NIGHTLY_REPOSITORY_URL` and
`PERFORMANCE_NIGHTLY_REF` are optional and default to the upstream nightly
repository's `master` branch.

Automatic runs reserve an estimated amount in the monthly ledger. They pause
before exceeding $100; the infrastructure budget is also set to $100. Manual
workflow dispatch can explicitly override the ledger gate. Before production,
add account notification subscribers at $50, $80, and $100 because email/SNS
destinations are intentionally not embedded in portable infrastructure.

## Comparable result eras

Run-index entries include `era`, environment hash, suite, topology, and status.
The UI limits a chart selection to one environment key so recovered centipede
results and AWS measurements are preserved without implying direct hardware or
network comparability.
