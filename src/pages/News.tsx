import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
  category: string;
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar notícias:', error);
    } else {
      setNewsData(data ?? []);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = [
    { id: 1, name: 'Cidade', slug: 'cidade' },
    { id: 2, name: 'Economia', slug: 'economia' },
    { id: 3, name: 'Cultura', slug: 'cultura' },
    { id: 4, name: 'Esporte', slug: 'esporte' },
    { id: 5, name: 'Política', slug: 'politica' },
  ];

  const filteredNews = selectedCategory
    ? newsData.filter((news) => news.category.toLowerCase() === selectedCategory.toLowerCase())
    : newsData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Últimas Notícias</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === '' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <NewsCard
                key={news.id}
                news={{
                  id: news.id.toString(),
                  title: news.title,
                  excerpt: news.excerpt,
                  cover_image_url: news.cover_image_url,
                  created_at: news.created_at,
                  category: news.category,
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">Nenhuma notícia encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;