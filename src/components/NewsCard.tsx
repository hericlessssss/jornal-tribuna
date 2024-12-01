import React from 'react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    date: string;
    category: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  const { id, title, excerpt, image_url, date, category } = news;

  // Função para formatar a data
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/noticias/${id}`}>
        <img
          src={image_url || '/default-image.jpg'} // Fallback para uma imagem padrão
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy" // Carregamento preguiçoso para otimizar o desempenho
        />
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
              {category}
            </span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 line-clamp-3">
            {excerpt}
          </p>
          <div className="mt-4">
            <span className="text-red-600 font-semibold hover:text-red-700">
              Ler mais →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
