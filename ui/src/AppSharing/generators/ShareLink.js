export class ShareLink {
  constructor({label, code}) {
    this.label = label;
    this.code = code;
  }

  static generate(location) {
    throw new Error('generate() Must Be Implemented - ' + location);
  }
}
