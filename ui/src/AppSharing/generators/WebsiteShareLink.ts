import {ShareLink} from './ShareLink';

export class WebsiteShareLink extends ShareLink {
  static generate(location: string) {
    const label = 'Share Link';
    const code = location;
    return new this({label, code});
  }
}
