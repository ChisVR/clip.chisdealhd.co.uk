export interface Clips {
  contentObjects: Clip[];
}

export interface Clip {
  contentId: string;
  contentTitle: string;
  contentViews: string;
  contentThumbnail: string;
  createdTimestamp: string;
  directClipUrl: string;
}
