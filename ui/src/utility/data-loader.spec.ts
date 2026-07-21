import {resultPath} from './result-path';

describe('resultPath', () => {
  it('encodes timestamp offsets in run identifiers for CloudFront and S3', () => {
    expect(resultPath('2026-07-21T14:52:08+0000_commit_hash')).toBe(
      '/raw/2026-07-21T14%3A52%3A08%2B0000_commit_hash/results.json'
    );
  });
});
