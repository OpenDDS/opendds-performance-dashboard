export const configParamMap: Record<string, string> = {
  'RTPS Multicast': 'rtps',
  InfoRepo: 'repo',
  RtpsRelay: 'relay'
};

export const baseScenarioParamMap: Record<string, string[]> = {
  b1_latency: ['rtps', 'tcp', 'udp'],
  disco: ['rtps', 'relay', 'repo'],
  // disco: ['info-repo', 'rtps', 'rtps-multicast', 'rtps-relay', 'relay', 'repo'],
  echo: ['rtps', 'tcp'],
  fan: ['rtps', 'tcp'],
  showtime_mixed: ['showtime_mixed']
};

export const sizeParamMap: Record<string, string> = {
  b1_latency: 'Bytes',
  disco: 'Participants',
  echo: 'Bytes',
  fan: 'Bytes',
  showtime_mixed: 'Nodes'
};
