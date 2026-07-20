# Infrastructure notes

`ControlPlaneStack` is long-lived and inexpensive at low usage. `RunStack` is
parameterized and must only be deployed by the Step Functions workflow or for a
validation run. It creates hourly-billed Transit Gateway and EC2 resources.

Required run context values are `runId`, `suite`, `commitSha`, `configCommit`,
`instanceType`, `amiId`, `availabilityZone`, `artifactKey`, and `configKey`.
The run stack reads the base VPC, subnet, security group, bucket, and table from
stage-specific SSM parameters.

Do not add an EC2 instance-type fallback, Spot capacity, a second Availability
Zone, or a floating AMI. Any of those changes creates a new performance
environment and must produce a new environment hash.

Control-plane source and identity contexts are `openDdsRepoUrl`,
`nightlyRepoUrl`, `dashboardRepoUrl`, `dashboardRef`,
`openDdsOidcSubject`, and `dashboardOidcSubject`. Repository URLs are restricted
to HTTPS GitHub URLs, refs are shell-safe, and OIDC subjects must use either a
repository-wide or branch-qualified GitHub subject. Keep fork and production
stages separate so a fork deployment cannot replace production trust policies.
