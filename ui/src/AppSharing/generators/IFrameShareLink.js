import {ShareLink} from './ShareLink';

export class IFrameShareLink extends ShareLink {
  static generate(location, options = {}) {
    const label = 'iFrame';
    let additional = '&embed=iframe';
    if (options.color) {
      additional += `&text_color=${encodeURIComponent(options.color)}`;
    }
    const code = `<iframe style='width: 100%;min-height: 650px; border:none;'\nsrc="${location}${additional}">\n</iframe>`;
    return new this({label, code, truncate: false});
  }
}
