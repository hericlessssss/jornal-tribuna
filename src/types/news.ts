export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}