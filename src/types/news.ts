export interface ImageItem {
  id: string;
  url: string;
  order: number;
}

export interface NewsImage {
  id: string;
  news_id: string;
  image_url: string;
  order: number;
  created_at: string;
}

export interface NewsFormData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
  images: ImageItem[];
}