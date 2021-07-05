export interface ShareLinkGenerator {
  generate(location: string, options: ShareLinkOptions): Sharable;
}

export type Sharable = {
  label: string;
  code: string;
  truncate?: boolean;
};

export type ShareLinkOptions = {
  text_color?: string;
  embed?: 'iframe';
};
