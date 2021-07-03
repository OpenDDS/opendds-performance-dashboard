export type Sharable = {
  label: string;
  code: string;
  truncate?: boolean;
};

export type ShareLinkOptions = {
  text_color?: string;
  embed?: 'iframe';
};

export class ShareLink implements Sharable {
  label: string;
  code: string;
  truncate = true;

  constructor({label, code, truncate = true}: Sharable) {
    this.label = label;
    this.code = code;
    this.truncate = truncate;
  }

  static generate(location: string, options: ShareLinkOptions = {}): ShareLink {
    throw new Error('generate() Must Be Implemented - ' + location);
  }
}
