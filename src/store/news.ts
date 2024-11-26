import create from 'zustand';
import { fetchNews, addNews, updateNews, deleteNews } from '../api/fetchNews';

export const useNewsStore = create((set) => ({
  news: [] as NewsItem[],
  loading: false,

  fetchNews: async () => {
    set({ loading: true });
    try {
      const news = await fetchNews();
      set({ news });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  addNews: async (news: Partial<NewsItem>) => {
    try {
      const newNews = await addNews(news);
      set((state) => ({ news: [newNews, ...state.news] }));
    } catch (error) {
      console.error(error);
    }
  },

  updateNews: async (id: number, updates: Partial<NewsItem>) => {
    try {
      const updatedNews = await updateNews(id, updates);
      set((state) => ({
        news: state.news.map((item) => (item.id === id ? updatedNews : item)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteNews: async (id: number) => {
    try {
      await deleteNews(id);
      set((state) => ({ news: state.news.filter((item) => item.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },
}));
