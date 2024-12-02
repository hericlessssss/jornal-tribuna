import React from 'react';
import { Edit, Trash } from 'lucide-react';
import type { NewsItem } from '../../services/newsService';

interface NewsListProps {
  news: NewsItem[];
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destaques
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {news.map((newsItem) => (
              <tr key={newsItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {newsItem.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {newsItem.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {newsItem.highlighted && <span className="mr-2">🎯</span>}
                  {newsItem.homepage_highlight && <span>⭐</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(newsItem)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => newsItem.id && onDelete(newsItem.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsList;