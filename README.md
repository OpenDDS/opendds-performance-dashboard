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

Before starting Bench, every instance enables `chronyd` and waits until its
system clock is within 1 ms of the Amazon Time Sync Service with a frequency
skew estimate at or below 100 ppm. A node that cannot satisfy both conditions
within two minutes fails initialization. The source, offset, clock status, and
service status are retained with the run under
`logs/<run-id>/clock-diagnostics/`; tracking and source state are sampled every
30 seconds throughout the suite.

The supported automatic topologies are:

| Suite | Legs | Physical cores per leg | Scenarios |
| --- | ---: | ---: | ---: |
| validation | 3 | 1 | 2 |
| large-message | 3 | 1 | 2 |
| relay-diagnostic | 3 | 1 | 1 |
| fan-diagnostic | 12 | 4 | 1 |
| standard | 6 | 2 | 7 |
| core | 12 | 4 | 11 |
| full | 30 | 4 | 69 |

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

Release bundles are built in the OpenDDS GitHub Actions workflow inside an
Amazon Linux 2023 container and uploaded through GitHub OIDC. AWS CodeBuild is
used only for the short-lived CDK deployment and teardown jobs.

```sh
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-2
npm ci --prefix infra
npm run build --prefix infra
npm run synth --prefix infra -- -c stage=dev
npx --prefix infra cdk bootstrap aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION
npx --prefix infra cdk deploy OpenDdsPerformance-dev -c stage=dev
```

For a reproducible account bootstrap, use the lifecycle helper instead. It
derives immutable GitHub owner/repository IDs, bootstraps CDK, deploys the
stack, reads its outputs, and can install the resulting GitHub Actions
Variables in both repositories:

```sh
node tools/control-plane.mjs deploy \
  --stage fork \
  --region us-east-2 \
  --opendds-repo simpsont-oci/OpenDDS \
  --opendds-ref aws-performance-testing \
  --dashboard-repo simpsont-oci/opendds-performance-dashboard \
  --dashboard-ref aws-performance-testing \
  --nightly-repo OpenDDS/nightly \
  --nightly-ref master \
  --nightly-oidc-subject 'repo:OpenDDS/nightly:ref:refs/heads/master' \
  --environment-name aws-bench-v1 \
  --nightly-commit FULL_40_CHARACTER_NIGHTLY_SHA \
  --availability-zone us-east-2a \
  --budget-usd 100 \
  --budget-email performance-operator@example.com \
  --configure-github
```

This requires authenticated `aws` and `gh` CLIs. The OpenDDS role is restricted
to `--opendds-ref`; the dashboard role is restricted to `--dashboard-ref`.
Rerun `configure-github` without deploying when only repository Variables need
to be repaired:

```sh
node tools/control-plane.mjs configure-github \
  --stage fork \
  --region us-east-2 \
  --opendds-repo simpsont-oci/OpenDDS \
  --opendds-ref aws-performance-testing \
  --dashboard-repo simpsont-oci/opendds-performance-dashboard \
  --dashboard-ref aws-performance-testing
```

Audit the control plane without changing AWS:

```sh
node tools/control-plane.mjs status \
  --stage fork \
  --region us-east-2
```

The report includes the persistent stack, running Step Functions executions,
non-deleted run stacks, tagged EC2 instances, and tagged Transit Gateways.
`--fail-on-active` exits with status 2 when any ephemeral resource is present,
which is useful after a run should have completed. The manually dispatched
`Audit Performance Infrastructure` workflow performs this check using
short-lived GitHub OIDC credentials.

Configure the OpenDDS repository variables from the stack outputs:

- `PERFORMANCE_AWS_ROLE_ARN`
- `PERFORMANCE_AWS_REGION`
- `PERFORMANCE_STATE_MACHINE_ARN`
- `PERFORMANCE_VALIDATION_INSTANCE_TYPE` (`c7i.large` for the fork)
- `PERFORMANCE_STANDARD_INSTANCE_TYPE` (`c7i.xlarge`)
- `PERFORMANCE_CORE_INSTANCE_TYPE` (`c7i.2xlarge`)
- `PERFORMANCE_FULL_INSTANCE_TYPE` (`c7i.2xlarge`)
- `PERFORMANCE_AMI_ID`
- `PERFORMANCE_AVAILABILITY_ZONE`
- `PERFORMANCE_ARTIFACT_BUCKET`
- `PERFORMANCE_BUNDLE_VERSION` (`al2023-xerces-3.2.5-v5`)
- `PERFORMANCE_ENVIRONMENT_NAME` (for example, `aws-bench-v1`)
- `PERFORMANCE_NIGHTLY_COMMIT` (set only when `--nightly-commit` is supplied)

Configure this repository's deployment variables with
`DashboardDeployRoleArn`, `DashboardBucketName`, and
`CloudFrontDistributionId`, plus `AWS_REGION`.

### Fork validation

Repository URLs, the dashboard branch, and GitHub OIDC subjects are CDK
contexts. This allows an isolated control plane to build commits that exist
only in forks without broadening the production role trust policy. For the
current `simpsont-oci` forks, deploy with:

```sh
cd infra
npx cdk deploy OpenDdsPerformance-fork \
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
dashboard or nightly subject instead. The explicit `--nightly-oidc-subject`
option supports private repositories whose workflow tokens still use GitHub's
legacy repository-name subject.

Fork OpenDDS workflows are manual-only by default. Set
`PERFORMANCE_AUTOMATIC_RUNS=true` only after the validation suite has completed
and cleaned up successfully. `PERFORMANCE_NIGHTLY_REPOSITORY_URL` and
`PERFORMANCE_NIGHTLY_REF` are optional and default to the upstream nightly
repository's `master` branch. When nightly is private, set
`PERFORMANCE_NIGHTLY_COMMIT` to a revision already published by nightly's
`Publish Bench Config` workflow. The workflow stores
`configs/<commit>/config.tar.gz` in the private artifact bucket, and CodeBuild
reuses that immutable snapshot without requiring a GitHub token. Promotion is
deliberately separate from publication so publishing a config does not change
the comparable performance environment.

AWS runs statically register multicast membership by default so Transit
Gateway join convergence doesn't become part of OpenDDS discovery timing.
The workflow's `dynamic_multicast_registration` input opts into IGMP-only
membership for cloud-network diagnostics. Static runs derive explicit group
addresses from the pinned Bench configuration bundle and add OpenDDS's
implicit default SPDP group. The selected mode is part of the environment hash,
published run metadata, and dashboard environment filter.

Automatic runs reserve an estimated amount in the monthly ledger. They pause
before exceeding the configured `--budget-usd`; the AWS Budget uses the same
monthly limit. Manual workflow dispatch can explicitly override the ledger
gate. When `--budget-email` is supplied, AWS sends actual-spend notifications
at 50%, 80%, and 100% of the limit. The address is deployment configuration and
is not embedded in the portable CDK defaults.

Before reserving budget or deploying a run stack, the coordinator reads the
selected instance type's default vCPU count and the Region's applied
`Running On-Demand Standard` EC2 quota. Runs requiring more vCPUs than the
applied quota are skipped without creating ephemeral infrastructure. The
calculation includes the controller as well as every leg and uses default
instance vCPUs because EC2 quota accounting is unaffected by `CpuOptions`.

### Safe teardown and redeployment

Destroy the persistent control plane with:

```sh
node tools/control-plane.mjs destroy \
  --stage fork \
  --region us-east-2 \
  --yes
```

The helper refuses to proceed while the state machine has a running execution
or an ephemeral `OpenDdsPerformanceRun-*` stack exists. Before deletion it
records stack outputs and retained physical resource IDs under
`infra/.state/`. That directory is ignored by Git.

The public dashboard bucket, private artifact bucket, and DynamoDB run table
have CloudFormation `Retain` policies. Safe teardown therefore removes the
control plane, networking, CloudFront distribution, IAM roles, and
orchestration, but does not erase benchmark history or build artifacts.
Deleting retained data is intentionally not implemented by the helper.

Running `deploy` again creates a fresh control plane and fresh data stores, then
updates GitHub Variables when `--configure-github` is supplied. The retained
stores are not automatically adopted by a new stack. Keep the teardown
manifest if later migration or explicit recovery of historical data is
required. Finally, dispatch the dashboard repository's `Deploy Dashboard`
workflow to publish the UI into the new bucket.

## Comparable result eras

Run-index entries include `era`, a named environment version, environment
hash, suite, topology, and status. The name describes an intentionally frozen
testbed contract; the hash still separates exact infrastructure/configuration
combinations within it. Changing an input that can affect measurements should
normally introduce the next environment name instead of silently redefining an
existing baseline. The environment name is deliberately excluded from the
hash: renaming metadata cannot make unlike runs comparable.

The first AWS baseline is `aws-bench-v1`. It fixes Amazon Linux 2023 AMI
`ami-06dd88604c99ec11f` in `us-east-2a`, static multicast registration by
default, one Bench worker thread per allocated core, the suite topology and
instance-type mappings listed above, and a full immutable nightly commit.
Its initial nightly configuration revision is
`6ad28a4aa83148cf99f506f7037c7d012ebacdbd`; the deployed pin is the
`PERFORMANCE_NIGHTLY_COMMIT` GitHub variable.
Dynamic multicast runs remain diagnostics and receive a distinct hash.

The UI limits a chart selection to one environment key so recovered centipede
results and AWS measurements are preserved without implying direct hardware or
network comparability.
