import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type PDFEdition = Database['public']['Tables']['pdf_editions']['Row'];

interface EditionsState {
  editions: PDFEdition[];
  loading: boolean;
  fetchEditions: () => Promise<void>;
  addEdition: (edition: Omit<PDFEdition, 'id' | 'created_at'>, file: File) => Promise<void>;
  deleteEdition: (id: string) => Promise<void>;
  updateEdition: (id: string, updates: Partial<PDFEdition>) => Promise<void>;
}

const uploadPDF = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('pdf-editions')
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('pdf-editions')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

export const useEditionsStore = create<EditionsState>((set, get) => ({
  editions: [],
  loading: false,

  fetchEditions: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('pdf_editions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ editions: data ?? [] });
    } catch (error) {
      console.error('Error fetching editions:', error);
      set({ editions: [] });
    } finally {
      set({ loading: false });
    }
  },

  addEdition: async (edition, file) => {
    set({ loading: true });
    try {
      const pdfUrl = await uploadPDF(file);

      const { data, error } = await supabase
        .from('pdf_editions')
        .insert([{
          ...edition,
          pdf_url: pdfUrl,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      set({ editions: [data, ...get().editions] });
    } catch (error) {
      console.error('Error adding edition:', error);
    } finally {
      set({ loading: false });
    }
  },

  deleteEdition: async (id) => {
    set({ loading: true });
    try {
      const edition = get().editions.find(e => e.id === id);
      if (edition?.pdf_url) {
        const fileName = edition.pdf_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('pdf-editions').remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('pdf_editions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({ editions: get().editions.filter(e => e.id !== id) });
    } catch (error) {
      console.error('Error deleting edition:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateEdition: async (id, updates) => {
    set({ loading: true });
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
    } finally {
      set({ loading: false });
    }
  },
}));