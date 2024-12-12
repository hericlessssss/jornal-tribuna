import { create } from 'zustand';
import { PDFEdition } from '../types/editions';
import { getErrorMessage } from '../utils/errors';
import toast from 'react-hot-toast';
import { 
  uploadPDFEdition, 
  deleteEdition, 
  updateEdition, 
  fetchEditions 
} from '../services/editionService';

interface EditionsState {
  editions: PDFEdition[];
  loading: boolean;
  fetchEditions: () => Promise<void>;
  addEdition: (metadata: { title: string; description?: string; external_url: string }) => Promise<void>;
  deleteEdition: (id: number) => Promise<void>;
  updateEdition: (id: number, updates: Partial<PDFEdition>) => Promise<void>;
}

export const useEditionsStore = create<EditionsState>((set, get) => ({
  editions: [],
  loading: false,

  fetchEditions: async () => {
    set({ loading: true });
    try {
      const data = await fetchEditions();
      set({ editions: data });
    } catch (error) {
      console.error('Error fetching editions:', error);
      toast.error('Erro ao carregar edições');
    } finally {
      set({ loading: false });
    }
  },

  addEdition: async (metadata) => {
    set({ loading: true });
    try {
      const newEdition = await uploadPDFEdition(metadata);
      set({ editions: [newEdition, ...get().editions] });
      toast.success('Edição adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding edition:', error);
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEdition: async (id) => {
    try {
      await deleteEdition(id);
      set({ editions: get().editions.filter(e => e.id !== id) });
      toast.success('Edição excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting edition:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  },

  updateEdition: async (id, updates) => {
    try {
      const updatedEdition = await updateEdition(id, updates);
      set({
        editions: get().editions.map(edition =>
          edition.id === id ? updatedEdition : edition
        ),
      });
      toast.success('Edição atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating edition:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  },
}));