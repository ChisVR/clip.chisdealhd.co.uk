export interface Clips {
  data: Clip[];
}

export interface Clip {
  id: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
}
