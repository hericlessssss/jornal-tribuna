import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type News = Database['public']['Tables']['news']['Row'];
type NewsImage = Database['public']['Tables']['news_images']['Row'];

interface NewsState {
  news: News[];
  loading: boolean;
  fetchNews: () => Promise<void>;
  addNews: (news: Omit<News, 'id' | 'created_at'>, images: File[]) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  updateNews: (id: string, updates: Partial<News>, newImages?: File[]) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  loading: false,
  fetchNews: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_images (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ news: data });
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      set({ loading: false });
    }
  },
  addNews: async (news, images) => {
    try {
      // First, insert the news
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .insert([news])
        .select()
        .single();

      if (newsError) throw newsError;

      // Then, upload images and create news_images entries
      if (images.length > 0) {
        const imageUploads = await Promise.all(
          images.map(async (image, index) => {
            const fileExt = image.name.split('.').pop();
            const fileName = `${newsData.id}/${index}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('news-images')
              .upload(fileName, image);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('news-images')
              .getPublicUrl(fileName);

            return {
              news_id: newsData.id,
              image_url: publicUrl,
              order: index,
            };
          })
        );

        const { error: imagesError } = await supabase
          .from('news_images')
          .insert(imageUploads);

        if (imagesError) throw imagesError;
      }

      // Refresh the news list
      get().fetchNews();
    } catch (error) {
      console.error('Error adding news:', error);
    }
  },
  deleteNews: async (id) => {
    try {
      // Delete associated images from storage
      await supabase.storage
        .from('news-images')
        .remove([`${id}`]);

      // Delete the news entry
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ news: get().news.filter(item => item.id !== id) });
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  },
  updateNews: async (id, updates, newImages) => {
    try {
      // Update news data
      const { error: updateError } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Handle new images if provided
      if (newImages?.length) {
        const imageUploads = await Promise.all(
          newImages.map(async (image, index) => {
            const fileExt = image.name.split('.').pop();
            const fileName = `${id}/${Date.now()}-${index}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('news-images')
              .upload(fileName, image);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('news-images')
              .getPublicUrl(fileName);

            return {
              news_id: id,
              image_url: publicUrl,
              order: index,
            };
          })
        );

        const { error: imagesError } = await supabase
          .from('news_images')
          .insert(imageUploads);

        if (imagesError) throw imagesError;
      }

      // Refresh the news list
      get().fetchNews();
    } catch (error) {
      console.error('Error updating news:', error);
    }
  },
}));