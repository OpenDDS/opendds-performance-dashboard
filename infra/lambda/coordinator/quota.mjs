export const STANDARD_ON_DEMAND_QUOTA_CODE = 'L-1216C47A';

export function requiredFleetVcpus(instanceVcpus, topology) {
  if (!Number.isInteger(instanceVcpus) || instanceVcpus <= 0) {
    throw new Error(`Invalid instance vCPU count: ${instanceVcpus}`);
  }
  if (!Number.isInteger(topology?.legCount) || topology.legCount <= 0) {
    throw new Error(`Invalid leg count: ${topology?.legCount}`);
  }
  // Every run has one controller in addition to its configured legs, all using
  // the same instance type. EC2 quotas count the instance type's default vCPUs,
  // even when CpuOptions disables simultaneous multithreading.
  return instanceVcpus * (topology.legCount + 1);
}
