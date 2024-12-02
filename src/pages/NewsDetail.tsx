import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNewsStore } from '../store/news';
import { ArrowLeft, User } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { news, fetchNews } = useNewsStore();

  useEffect(() => {
    if (news.length === 0) {
      fetchNews();
    }
  }, [news, fetchNews]);

  const selectedNews = news.find((item) => item.id.toString() === id);

  if (!selectedNews) {
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

  // Create a temporary div to parse HTML content
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = selectedNews.content;
  const cleanContent = contentDiv.textContent || contentDiv.innerText;

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
            <span className="text-red-600 font-semibold">{selectedNews.category}</span>
            <span>•</span>
            <time>{formatDate(selectedNews.created_at)}</time>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{selectedNews.title}</h1>
        </header>

        <img
          src={selectedNews.cover_image_url || '/default-image.jpg'}
          alt={selectedNews.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-image.jpg';
          }}
        />

        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedNews.content }}
          />
        </div>

        {selectedNews.author && (
          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span className="font-medium">Por {selectedNews.author}</span>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};

export default NewsDetail;