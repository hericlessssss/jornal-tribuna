import { supabase } from '../lib/supabase';
import { logError } from '../utils/errorHandler';
import type { ImageItem } from '../components/NewsEditor';
import type { Database } from '../types/database';

type News = Database['public']['Tables']['news']['Row'];
type NewsImage = Database['public']['Tables']['news_images']['Row'];

export interface NewsItem extends Omit<News, 'id'> {
  id?: string;
  images?: ImageItem[];
}

export async function createNews(news: Omit<NewsItem, 'id' | 'created_at'>): Promise<NewsItem> {
  try {
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .insert([{
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        category: news.category,
        cover_image_url: news.cover_image_url,
        highlighted: news.highlighted,
        homepage_highlight: news.homepage_highlight,
        author: news.author
      }])
      .select()
      .single();

    if (newsError) throw newsError;
    if (!newsData) throw new Error('No data returned after news creation');

    if (news.images && news.images.length > 0) {
      const newsImages = news.images.map((img, index) => ({
        news_id: newsData.id,
        image_url: img.url,
        order: index
      }));

      const { error: imagesError } = await supabase
        .from('news_images')
        .insert(newsImages);

      if (imagesError) {
        await supabase.from('news').delete().eq('id', newsData.id);
        throw imagesError;
      }
    }

    return {
      ...newsData,
      images: news.images
    };
  } catch (error) {
    logError('NewsService.createNews', error);
    throw error;
  }
}

export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem> {
  try {
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .update({
        title: updates.title,
        content: updates.content,
        excerpt: updates.excerpt,
        category: updates.category,
        cover_image_url: updates.cover_image_url,
        highlighted: updates.highlighted,
        homepage_highlight: updates.homepage_highlight,
        author: updates.author
      })
      .eq('id', id)
      .select()
      .single();

    if (newsError) throw newsError;
    if (!newsData) throw new Error('No data returned after news update');

    if (updates.images !== undefined) {
      await supabase
        .from('news_images')
        .delete()
        .eq('news_id', id);

      if (updates.images.length > 0) {
        const newsImages = updates.images.map((img, index) => ({
          news_id: id,
          image_url: img.url,
          order: index
        }));

        const { error: imagesError } = await supabase
          .from('news_images')
          .insert(newsImages);

        if (imagesError) throw imagesError;
      }
    }

    return {
      ...newsData,
      images: updates.images
    };
  } catch (error) {
    logError('NewsService.updateNews', error);
    throw error;
  }
}

export async function deleteNews(id: string): Promise<void> {
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
      .select(`
        *,
        news_images (
          id,
          image_url,
          order
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(news => ({
      ...news,
      images: news.news_images?.map((img: NewsImage) => ({
        id: img.id,
        url: img.image_url,
        order: img.order
      })) || []
    })) || [];
  } catch (error) {
    logError('NewsService.fetchNews', error);
    throw error;
  }
}