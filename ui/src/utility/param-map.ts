export const configParamMap: Record<string, string> = {
  'RTPS Multicast': 'rtps',
  InfoRepo: 'repo',
  RtpsRelay: 'relay'
};

// TODO: remove this and derive base scenario options from base
export const baseScenarioParamMap: Record<string, string[]> = {
  b1_latency: ['rtps', 'tcp', 'udp'],
  disco: ['rtps', 'relay', 'repo'],
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
