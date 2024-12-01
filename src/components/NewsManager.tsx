import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  highlighted: boolean;
  homepage_highlight: boolean;
}

const initialFormData: NewsFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  image: '',
  highlighted: false,
  homepage_highlight: false,
};

const NewsManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [newsList, setNewsList] = useState<NewsFormData[]>([]);

  // Função para buscar as notícias do banco de dados
  const fetchNews = async () => {
    const { data, error } = await supabase.from('news').select('*');
    if (error) {
      console.error('Erro ao buscar notícias:', error);
    } else {
      setNewsList(data ?? []);
    }
  };

  // Buscar as notícias quando o componente for montado
  useEffect(() => {
    fetchNews();
  }, []);

  // Função para enviar dados ao banco de dados
  const addNews = async (newsData: NewsFormData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: newsData.title,
          excerpt: newsData.excerpt,
          content: newsData.content,
          category: newsData.category,
          image_url: newsData.image,
          highlighted: newsData.highlighted,
          homepage_highlight: newsData.homepage_highlight,
        }])
        .single();

      if (error) throw error;

      console.log('Notícia adicionada com sucesso:', data);
      fetchNews(); // Atualiza a lista de notícias após a adição
    } catch (error) {
      console.error('Erro ao adicionar notícia:', error);
    }
  };

  // Função para atualizar uma notícia
  const updateNews = async (id: string, newsData: NewsFormData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update({
          title: newsData.title,
          excerpt: newsData.excerpt,
          content: newsData.content,
          category: newsData.category,
          image_url: newsData.image,
          highlighted: newsData.highlighted,
          homepage_highlight: newsData.homepage_highlight,
        })
        .eq('id', id);

      if (error) throw error;

      console.log('Notícia atualizada com sucesso:', data);
      fetchNews(); // Atualiza a lista de notícias após a atualização
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error);
    }
  };

  // Função para excluir uma notícia
  const deleteNews = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Notícia excluída com sucesso:', data);
      fetchNews(); // Atualiza a lista de notícias após a exclusão
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
    }
  };

  // Função para capturar mudanças nos campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para capturar mudanças nos campos checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Função de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.image) {
      alert('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    if (isEditing) {
      // Atualizar a notícia
      await updateNews(formData.id, formData);
    } else {
      // Adicionar nova notícia
      await addNews(formData);
    }

    setFormData(initialFormData); // Resetando o formulário após a adição ou atualização
    setIsEditing(false); // Finaliza o modo de edição após submissão
  };

  return (
    <div className="space-y-8">
      {/* Formulário para Adicionar ou Editar Notícias */}
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
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
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL da Imagem
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="highlighted" className="block text-sm font-medium text-gray-700">
              Destacar Notícia
            </label>
            <input
              type="checkbox"
              id="highlighted"
              name="highlighted"
              checked={formData.highlighted}
              onChange={handleCheckboxChange}
              className="mt-1 block"
            />
          </div>

          <div>
            <label htmlFor="homepage_highlight" className="block text-sm font-medium text-gray-700">
              Destacar na Página Inicial
            </label>
            <input
              type="checkbox"
              id="homepage_highlight"
              name="homepage_highlight"
              checked={formData.homepage_highlight}
              onChange={handleCheckboxChange}
              className="mt-1 block"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {isEditing ? 'Atualizar Notícia' : 'Adicionar Notícia'}
          </button>
        </div>
      </form>

      {/* Lista de Notícias */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news) => (
                <tr key={news.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{news.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{news.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setFormData(news);
                        setIsEditing(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNews(news.id)}
                      className="text-red-600 hover:text-red-800"
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
