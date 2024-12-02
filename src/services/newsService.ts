import { supabase } from '../lib/supabase';
import { logError } from '../utils/errorHandler';

export interface NewsItem {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
  created_at?: string;
}

export async function createNews(news: Omit<NewsItem, 'id' | 'created_at'>): Promise<NewsItem> {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        category: news.category,
        cover_image_url: news.cover_image_url,
        highlighted: news.highlighted,
        homepage_highlight: news.homepage_highlight
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logError('NewsService.createNews', error);
    throw error;
  }
}

export async function updateNews(id: number, updates: Partial<NewsItem>): Promise<NewsItem> {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logError('NewsService.updateNews', error);
    throw error;
  }
}

export async function deleteNews(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    logError('NewsService.deleteNews', error);
    throw error;
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logError('NewsService.fetchNews', error);
    throw error;
  }
}