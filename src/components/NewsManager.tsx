import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash, Edit } from 'lucide-react';
import { useNewsStore } from '../store/news';
import NewsEditor from './NewsEditor';
import toast from 'react-hot-toast';
import type { ImageItem } from './NewsEditor';
import { createNews, updateNews, deleteNews } from '../services/newsService';

interface NewsFormData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
  images?: ImageItem[];
}

const initialFormData: NewsFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  cover_image_url: '',
  highlighted: false,
  homepage_highlight: false,
  images: [],
};

const NewsManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const { news, fetchNews } = useNewsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImagesChange = (images: ImageItem[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.content || !formData.category || !formData.cover_image_url) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      if (isEditing && formData.id) {
        await updateNews(formData.id, formData);
        toast.success('Notícia atualizada com sucesso!');
      } else {
        await createNews(formData);
        toast.success('Notícia criada com sucesso!');
      }

      setFormData(initialFormData);
      setIsEditing(false);
      fetchNews();
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast.error('Erro ao salvar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await deleteNews(id);
        toast.success('Notícia excluída com sucesso!');
        fetchNews();
      } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        toast.error('Erro ao excluir notícia');
      }
    }
  };

  const handleEdit = (newsItem: NewsFormData) => {
    setFormData(newsItem);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Notícia
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Resumo
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <NewsEditor
              content={formData.content}
              onChange={handleContentChange}
              onImagesChange={handleImagesChange}
              initialImages={formData.images}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Cidade">Cidade</option>
              <option value="Economia">Economia</option>
              <option value="Cultura">Cultura</option>
              <option value="Esporte">Esporte</option>
              <option value="Política">Política</option>
            </select>
          </div>

          <div>
            <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700">
              URL da Imagem de Capa
            </label>
            <input
              type="url"
              id="cover_image_url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlighted"
                name="highlighted"
                checked={formData.highlighted}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="highlighted" className="ml-2 block text-sm text-gray-700">
                Destacar no Slider Principal
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="homepage_highlight"
                name="homepage_highlight"
                checked={formData.homepage_highlight}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="homepage_highlight" className="ml-2 block text-sm text-gray-700">
                Destacar na Página Inicial
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Notícia' : 'Adicionar Notícia'}
          </button>
        </div>
      </form>

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
                      onClick={() => handleEdit(newsItem)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => newsItem.id && handleDelete(newsItem.id)}
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
    </div>
  );
};

export default NewsManager;