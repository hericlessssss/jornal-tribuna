import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsData } from '../data/mockNews';
import { ArrowLeft } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const news = newsData.find(n => n.id === Number(id));

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h2>
          <Link
            to="/noticias"
            className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para notícias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/noticias"
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para notícias
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="text-red-600 font-semibold">{news.category}</span>
            <span>•</span>
            <time>{news.date}</time>
            <span>•</span>
            <span>Por {news.author}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{news.title}</h1>
        </header>

        <img
          src={news.image}
          alt={news.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div className="prose prose-lg max-w-none">
          {news.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;