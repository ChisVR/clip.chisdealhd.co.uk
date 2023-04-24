export interface Clips {
  data: Clip[];
}

export interface Clip {
  contentId: string;
  contentTitle: string;
  contentViews: number;
  contentThumbnail: string;
  createdTimestamp: number;
  directClipUrl: string;
}
