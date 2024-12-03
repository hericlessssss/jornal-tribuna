import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Ad {
  id: string;
  title: string;
  image_url: string;
  redirect_url: string;
  created_at?: string;
}

interface AdsState {
  ads: Ad[];
  loading: boolean;
  fetchAds: () => Promise<void>;
  addAd: (ad: Omit<Ad, 'id' | 'created_at'>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
}

export const useAdsStore = create<AdsState>((set, get) => ({
  ads: [],
  loading: false,

  fetchAds: async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ ads: data || [] });
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      toast.error('Não foi possível carregar os anúncios');
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
      toast.success('Anúncio adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar anúncio:', error);
      toast.error('Não foi possível adicionar o anúncio');
    }
  },

  deleteAd: async (id) => {
    const loadingToast = toast.loading('Excluindo anúncio...');
    
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .match({ id });

      if (error) throw error;

      set({ ads: get().ads.filter(ad => ad.id !== id) });
      toast.success('Anúncio excluído com sucesso!', { id: loadingToast });
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
      toast.error('Não foi possível excluir o anúncio', { id: loadingToast });
    }
  }
}));