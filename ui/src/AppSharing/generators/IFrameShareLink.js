import {ShareLink} from './ShareLink';

export class IFrameShareLink extends ShareLink {
  static generate(location) {
    const label = 'iFrame';
    const code = `<iframe style='width: 100%;min-height: 650px; border:none;'\nsrc="${location}&embed=iframe">\n</iframe>`;
    return new this({label, code, truncate: false});
  }
}
