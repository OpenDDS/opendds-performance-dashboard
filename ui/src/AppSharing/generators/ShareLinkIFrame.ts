import type {Sharable, ShareLinkOptions, ShareLinkGenerator} from './ShareLink';

export const ShareLinkGeneratorIFrame: ShareLinkGenerator = {
  generate(location, options: ShareLinkOptions = {}): Sharable {
    const label = 'iFrame';
    let additional = '&embed=iframe';
    if (options.text_color) {
      additional += `&text_color=${encodeURIComponent(options.text_color)}`;
    }
    const code = `<iframe style='width: 100%;min-height: 650px; border:none;'\nsrc="${location}${additional}">\n</iframe>`;
    return {label, code, truncate: false};
  }
};
