export class ShareLink {
  constructor({label, code, truncate = true}) {
    this.label = label;
    this.code = code;
    this.truncate = truncate;
  }

  static generate(location) {
    throw new Error('generate() Must Be Implemented - ' + location);
  }
}
