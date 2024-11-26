import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types/news';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/noticias/${news.id}`}>
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-red-600 font-semibold">{news.category}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-500">{news.date}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Por {news.author}</span>
            <span className="text-red-600 font-semibold hover:text-red-700">
              Leia mais →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;