import { create } from 'zustand';
import { getVisitorCount, incrementVisitorCount } from '../services/visitorService';

interface VisitorState {
  count: number;
  loading: boolean;
  fetchCount: () => Promise<void>;
  increment: () => Promise<void>;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  count: 0,
  loading: false,

  fetchCount: async () => {
    set({ loading: true });
    try {
      const count = await getVisitorCount();
      set({ count });
    } catch (error) {
      console.error('Error fetching visitor count:', error);
    } finally {
      set({ loading: false });
    }
  },

  increment: async () => {
    try {
      const newCount = await incrementVisitorCount();
      set({ count: newCount });
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
    }
  },
}));