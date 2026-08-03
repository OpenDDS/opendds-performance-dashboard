import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
import {CopyObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {createHash} from 'node:crypto';
import {CloudFormationClient, DeleteStackCommand, DescribeStacksCommand} from '@aws-sdk/client-cloudformation';
import {DescribeInstanceTypesCommand, EC2Client} from '@aws-sdk/client-ec2';
import {GetServiceQuotaCommand, ServiceQuotasClient} from '@aws-sdk/client-service-quotas';
import {requiredFleetVcpus, STANDARD_ON_DEMAND_QUOTA_CODE} from './quota.mjs';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const cloudformation = new CloudFormationClient({});
const ec2 = new EC2Client({});
const serviceQuotas = new ServiceQuotasClient({});
const tableName = process.env.RUN_TABLE_NAME;
const artifactBucket = process.env.ARTIFACT_BUCKET;
const publicBucket = process.env.PUBLIC_BUCKET;
const stage = process.env.STAGE ?? 'dev';
const hardBudget = Number(process.env.HARD_BUDGET_USD ?? 100);
const bundleVersion = process.env.BUNDLE_VERSION;
const topologies = {
  validation: {legCount: 3, coresPerLeg: 1},
  'large-message': {legCount: 3, coresPerLeg: 1},
  'relay-diagnostic': {legCount: 3, coresPerLeg: 1},
  'fan-diagnostic': {legCount: 12, coresPerLeg: 4},
  standard: {legCount: 6, coresPerLeg: 2},
  core: {legCount: 12, coresPerLeg: 4},
  full: {legCount: 30, coresPerLeg: 4},
};

const monthKey = () => new Date().toISOString().slice(0, 7);
const environmentHash = input => createHash('sha256')
  .update(JSON.stringify({
    region: process.env.AWS_REGION,
    instanceType: input.instanceType,
    amiId: input.amiId,
    topology: input.topology,
    configCommit: input.configCommit,
    multicastRegistration: input.dynamicMulticastRegistration ? 'dynamic' : 'static',
  }))
  .digest('hex').slice(0, 32);

async function bodyAsJson(body) {
  return JSON.parse(await body.transformToString());
}

async function acquire(input) {
  const expectedTopology = topologies[input.suite];
  if (!expectedTopology) throw new Error(`Unsupported suite: ${input.suite}`);
  if (JSON.stringify(input.topology) !== JSON.stringify(expectedTopology)) {
    throw new Error(`Topology for ${input.suite} must be ${JSON.stringify(expectedTopology)}`);
  }
  if (input.repeatNonce && !/^[A-Za-z0-9_-]{1,64}$/.test(input.repeatNonce)) {
    throw new Error('repeatNonce contains unsupported characters');
  }
  const runKey = [
    input.commitSha, input.configCommit, input.suite, input.repeatNonce,
  ].filter(Boolean).join(':');
  const existing = await ddb.send(new GetCommand({TableName: tableName, Key: {pk: 'DEDUP', sk: runKey}}));
  if (existing.Item) return {...input, shouldRun: false, reason: 'duplicate', runId: existing.Item.runId};

  const [instanceTypes, standardQuota] = await Promise.all([
    ec2.send(new DescribeInstanceTypesCommand({InstanceTypes: [input.instanceType]})),
    serviceQuotas.send(new GetServiceQuotaCommand({
      ServiceCode: 'ec2',
      QuotaCode: STANDARD_ON_DEMAND_QUOTA_CODE,
    })),
  ]);
  const instanceVcpus = instanceTypes.InstanceTypes?.[0]?.VCpuInfo?.DefaultVCpus;
  const quotaVcpus = standardQuota.Quota?.Value;
  if (!Number.isFinite(quotaVcpus)) {
    throw new Error('Could not determine the applied On-Demand Standard vCPU quota');
  }
  const requiredVcpus = requiredFleetVcpus(instanceVcpus, input.topology);
  if (requiredVcpus > quotaVcpus) {
    return {
      ...input,
      shouldRun: false,
      reason: 'quota',
      requiredVcpus,
      quotaVcpus,
    };
  }

  const month = monthKey();
  const budget = await ddb.send(new GetCommand({TableName: tableName, Key: {pk: 'BUDGET', sk: month}}));
  const estimatedCost = Number(input.estimatedCostUsd ?? 0);
  const reserved = Number(budget.Item?.reservedUsd ?? 0);
  if (!input.manualOverride && reserved + estimatedCost > hardBudget) {
    return {...input, shouldRun: false, reason: 'budget', projectedUsd: reserved + estimatedCost};
  }

  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '+0000');
  const hash = environmentHash(input);
  const runId = `${timestamp}_${input.commitSha}_${hash}`;
  const leaseExpires = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
  try {
    await ddb.send(new PutCommand({
      TableName: tableName,
      Item: {pk: 'LOCK', sk: stage, runId, leaseExpires},
      ConditionExpression: 'attribute_not_exists(pk) OR leaseExpires < :now',
      ExpressionAttributeValues: {':now': Math.floor(Date.now() / 1000)},
    }));
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return {...input, shouldRun: false, reason: 'busy'};
    }
    throw error;
  }
  await ddb.send(new PutCommand({TableName: tableName, Item: {pk: 'DEDUP', sk: runKey, runId}}));
  await ddb.send(new PutCommand({
    TableName: tableName,
    Item: {
      pk: 'RUN', sk: runId, runId, date: timestamp, commit: input.commitSha,
      configCommit: input.configCommit, suite: input.suite, topology: input.topology,
      multicastRegistration: input.dynamicMulticastRegistration ? 'dynamic' : 'static',
      hash, era: 'aws', status: 'QUEUED', errors: 0, estimatedCostUsd: estimatedCost,
    },
  }));
  await ddb.send(new UpdateCommand({
    TableName: tableName,
    Key: {pk: 'BUDGET', sk: month},
    UpdateExpression: 'ADD reservedUsd :cost',
    ExpressionAttributeValues: {':cost': estimatedCost},
  }));
  return {...input, shouldRun: true, runId, environmentHash: hash};
}

async function status(input) {
  const result = await ddb.send(new GetCommand({TableName: tableName, Key: {pk: 'RUN', sk: input.runId}}));
  const state = result.Item?.status ?? 'PROVISIONING';
  return {...input, runStatus: state, done: ['SUCCEEDED', 'FAILED', 'TIMED_OUT'].includes(state)};
}

async function artifact(input) {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: artifactBucket,
      Key: `builds/${bundleVersion}/${input.commitSha}/bench.tar.gz`,
    }));
    return {...input, bundleExists: true};
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return {...input, bundleExists: false};
    }
    throw error;
  }
}

async function publish(input) {
  const key = `staging/${input.runId}/results.json`;
  await s3.send(new HeadObjectCommand({Bucket: artifactBucket, Key: key}));
  const object = await s3.send(new GetObjectCommand({Bucket: artifactBucket, Key: key}));
  const results = await bodyAsJson(object.Body);
  if (!results || typeof results !== 'object' || Array.isArray(results)) throw new Error('results.json must contain an object');

  await s3.send(new CopyObjectCommand({
    Bucket: publicBucket,
    Key: `bench2/raw/${input.runId}/results.json`,
    CopySource: encodeURIComponent(`${artifactBucket}/${key}`),
    ContentType: 'application/json',
    CacheControl: 'public,max-age=31536000,immutable',
    MetadataDirective: 'REPLACE',
  }));
  const runItems = [];
  let exclusiveStartKey;
  do {
    const runs = await ddb.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: 'pk = :pk AND #status = :status',
      ExpressionAttributeNames: {'#status': 'status'},
      ExpressionAttributeValues: {':pk': 'RUN', ':status': 'SUCCEEDED'},
      ExclusiveStartKey: exclusiveStartKey,
    }));
    runItems.push(...(runs.Items ?? []));
    exclusiveStartKey = runs.LastEvaluatedKey;
  } while (exclusiveStartKey);
  const index = runItems.map(({
    runId: key, date, commit, hash, errors, era, suite, topology, status,
    multicastRegistration, staticMulticastRegistration,
  }) => ({
    key, date, commit, hash, errors, era, suite, topology, status,
    multicastRegistration: multicastRegistration ??
      (era === 'aws' ? (staticMulticastRegistration ? 'static' : 'dynamic') : undefined),
  }))
    .sort((a, b) => a.date.localeCompare(b.date));
  await s3.send(new PutObjectCommand({
    Bucket: publicBucket,
    Key: 'bench2/run_index.json',
    Body: JSON.stringify(index, null, 2),
    ContentType: 'application/json',
    CacheControl: 'public,max-age=60',
  }));
  return {...input, published: true};
}

async function release(input) {
  await ddb.send(new DeleteCommand({TableName: tableName, Key: {pk: 'LOCK', sk: stage}}));
  if (input.runId && input.commitSha && input.configCommit && input.suite) {
    const run = await ddb.send(new GetCommand({TableName: tableName, Key: {pk: 'RUN', sk: input.runId}}));
    if (run.Item?.status !== 'SUCCEEDED') {
      if (!['FAILED', 'TIMED_OUT'].includes(run.Item?.status)) {
        await ddb.send(new UpdateCommand({
          TableName: tableName,
          Key: {pk: 'RUN', sk: input.runId},
          UpdateExpression: 'SET #status = :status',
          ExpressionAttributeNames: {'#status': 'status'},
          ExpressionAttributeValues: {':status': 'FAILED'},
        }));
      }
      await ddb.send(new DeleteCommand({
        TableName: tableName,
        Key: {
          pk: 'DEDUP',
          sk: [input.commitSha, input.configCommit, input.suite, input.repeatNonce]
            .filter(Boolean).join(':'),
        },
      }));
    }
  }
  return input;
}

async function reap() {
  const allStacks = [];
  let nextToken;
  do {
    const page = await cloudformation.send(new DescribeStacksCommand({NextToken: nextToken}));
    allStacks.push(...(page.Stacks ?? []));
    nextToken = page.NextToken;
  } while (nextToken);
  const cutoff = Date.now() - 12 * 60 * 60 * 1000;
  const stale = allStacks.filter(stack =>
    stack.StackName?.startsWith('OpenDdsPerformanceRun-') &&
    stack.CreationTime?.getTime() < cutoff &&
    !['DELETE_IN_PROGRESS', 'DELETE_COMPLETE'].includes(stack.StackStatus));
  for (const stack of stale) {
    await cloudformation.send(new DeleteStackCommand({StackName: stack.StackName}));
  }
  return {deleted: stale.map(stack => stack.StackName)};
}

export async function handler(event) {
  const {action, ...input} = event;
  if (action === 'acquire') return acquire(input);
  if (action === 'artifact') return artifact(input);
  if (action === 'status') return status(input);
  if (action === 'publish') return publish(input);
  if (action === 'release') return release(input);
  if (action === 'reap') return reap();
  throw new Error(`Unsupported action: ${action}`);
}
