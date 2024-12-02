import { supabase } from '../lib/supabase';
import { logError } from '../utils/errorHandler';
import type { ImageItem } from '../components/NewsEditor';

export interface NewsItem {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
  author: string;
  created_at?: string;
  images?: ImageItem[];
}

export async function createNews(news: Omit<NewsItem, 'id' | 'created_at'>): Promise<NewsItem> {
  try {
    // First, insert the news article
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
        author: news.author,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (newsError) throw newsError;
    if (!newsData) throw new Error('No data returned after news creation');

    // If there are images, insert them with the correct news_id
    if (news.images && news.images.length > 0) {
      const newsImages = news.images.map(img => ({
        news_id: newsData.id, // Using the UUID from the newly created news
        image_url: img.url,
        order: img.order
      }));

      const { error: imagesError } = await supabase
        .from('news_images')
        .insert(newsImages);

      if (imagesError) {
        // If image insertion fails, we should probably delete the news article
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
      // Delete existing images
      await supabase
        .from('news_images')
        .delete()
        .eq('news_id', id);

      if (updates.images.length > 0) {
        const newsImages = updates.images.map(img => ({
          news_id: id,
          image_url: img.url,
          order: img.order
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
    // Images will be automatically deleted due to foreign key constraint
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
      images: news.news_images?.map((img: any) => ({
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