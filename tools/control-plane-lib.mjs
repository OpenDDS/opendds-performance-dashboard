export function outputMap(stack) {
  return Object.fromEntries((stack.Outputs ?? []).map(
    ({OutputKey, OutputValue}) => [OutputKey, OutputValue],
  ));
}

export function activeRunStacks(summaries) {
  return summaries.filter(({StackName, StackStatus}) =>
    StackName.startsWith('OpenDdsPerformanceRun-') && StackStatus !== 'DELETE_COMPLETE');
}

export function assertSafeToDestroy(executions, stacks) {
  if (executions.length || stacks.length) {
    throw new Error(
      `refusing destroy: ${executions.length} running execution(s), ${stacks.length} run stack(s)`,
    );
  }
}

export function auditHasActiveResources(audit) {
  return Boolean(
    audit.executions.length || audit.runStacks.length ||
    audit.instances.length || audit.transitGateways.length,
  );
}
