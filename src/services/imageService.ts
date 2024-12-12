import { supabase } from '../lib/supabase';
import type { ImageItem } from '../types/news';

export const uploadImages = async (files: File[]): Promise<ImageItem[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

    return {
      id: fileName,
      url: publicUrl,
      order: 0
    };
  });

  return Promise.all(uploadPromises);
};

export const deleteImage = async (imageId: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('news-images')
    .remove([imageId]);

  if (error) throw error;
};

export const getNewsImages = async (newsId: string): Promise<ImageItem[]> => {
  const { data, error } = await supabase
    .from('news_images')
    .select('*')
    .eq('news_id', newsId)
    .order('order');

  if (error) throw error;
  return data || [];
};