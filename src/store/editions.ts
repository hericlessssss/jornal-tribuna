import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type PDFEdition = Database['public']['Tables']['pdf_editions']['Row'];

interface EditionsState {
  editions: PDFEdition[];
  loading: boolean;
  fetchEditions: () => Promise<void>;
  addEdition: (edition: Omit<PDFEdition, 'id' | 'created_at'>) => Promise<void>;
  deleteEdition: (id: string) => Promise<void>;
  updateEdition: (id: string, updates: Partial<PDFEdition>) => Promise<void>;
}

export const useEditionsStore = create<EditionsState>((set, get) => ({
  editions: [],
  loading: false,
  fetchEditions: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('pdf_editions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ editions: data });
    } catch (error) {
      console.error('Error fetching editions:', error);
    } finally {
      set({ loading: false });
    }
  },
  addEdition: async (edition) => {
    try {
      const { data, error } = await supabase
        .from('pdf_editions')
        .insert([edition])
        .select()
        .single();

      if (error) throw error;
      set({ editions: [data, ...get().editions] });
    } catch (error) {
      console.error('Error adding edition:', error);
    }
  },
  deleteEdition: async (id) => {
    try {
      const { error } = await supabase
        .from('pdf_editions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ editions: get().editions.filter(edition => edition.id !== id) });
    } catch (error) {
      console.error('Error deleting edition:', error);
    }
  },
  updateEdition: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('pdf_editions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set({
        editions: get().editions.map(edition =>
          edition.id === id ? { ...edition, ...data } : edition
        ),
      });
    } catch (error) {
      console.error('Error updating edition:', error);
    }
  },
}));