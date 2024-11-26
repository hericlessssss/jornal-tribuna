import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Ad = Database['public']['Tables']['ads']['Row'];

interface AdsState {
  ads: Ad[];
  loading: boolean;
  fetchAds: () => Promise<void>;
  addAd: (ad: Omit<Ad, 'id' | 'created_at'>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  updateAd: (id: string, updates: Partial<Ad>) => Promise<void>;
}

export const useAdsStore = create<AdsState>((set, get) => ({
  ads: [],
  loading: false,

  fetchAds: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ ads: data });
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      set({ loading: false });
    }
  },

  addAd: async (ad) => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .insert([ad])
        .select()
        .single();

      if (error) throw error;
      set({ ads: [data, ...get().ads] });
    } catch (error) {
      console.error('Error adding ad:', error);
    }
  },

  deleteAd: async (id) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ ads: get().ads.filter((ad) => ad.id !== id) });
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  },

  updateAd: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set({
        ads: get().ads.map((ad) => (ad.id === id ? { ...ad, ...data } : ad)),
      });
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  },
}));
