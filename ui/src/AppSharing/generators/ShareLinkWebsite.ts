import type {Sharable, ShareLinkGenerator} from './ShareLink';

export const ShareLinkGeneratorWebsite: ShareLinkGenerator = {
  generate(location: string): Sharable {
    const label = 'Share Link';
    const code = location;
    return {label, code};
  }
};
