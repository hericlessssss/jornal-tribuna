import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { supabase } from '../lib/supabase'; // Certifique-se de configurar o Supabase corretamente

// Defina uma interface para as notícias
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  date: string;
  category: string;
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newsData, setNewsData] = useState<NewsItem[]>([]); // Armazenar notícias do banco de dados

  // Função para buscar notícias do banco de dados
  const fetchNews = async () => {
    const { data, error } = await supabase.from('news').select('*');
    if (error) {
      console.error('Erro ao buscar notícias:', error);
    } else {
      console.log(data); // Verifique os dados no console
      setNewsData(data ?? []);
    }
  };

  // Efeito para carregar as notícias ao montar o componente
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

  // Filtra as notícias com base na categoria selecionada
  const filteredNews = selectedCategory
    ? newsData.filter((news) => news.category.toLowerCase() === selectedCategory.toLowerCase())
    : newsData;

  // Formatar a data (caso queira exibir a data de forma mais amigável)
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  console.log('Categoria selecionada:', selectedCategory); // Verifique a categoria selecionada

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Últimas Notícias</h1>

        {/* Filtro de Categorias */}
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

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <NewsCard
                key={news.id}
                news={{
                  id: news.id.toString(), // Garantir que id seja string para compatibilidade com a URL
                  title: news.title,
                  excerpt: news.excerpt, // Certifique-se de que a notícia tenha um resumo (excerpt)
                  image_url: news.image_url || '/default-image.jpg', // Usar imagem padrão caso não tenha
                  date: formatDate(news.date), // Exibir a data formatada
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
