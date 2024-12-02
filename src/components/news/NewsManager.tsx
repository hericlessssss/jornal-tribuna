import React, { useState, useEffect } from 'react';
import { useNewsStore } from '../../store/news';
import NewsForm from './NewsForm';
import NewsList from './NewsList';
import toast from 'react-hot-toast';
import { createNews, updateNews, deleteNews } from '../../services/newsService';

interface NewsFormData {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
}

const initialFormData: NewsFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  cover_image_url: '',
  highlighted: false,
  homepage_highlight: false,
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

  const handleDelete = async (id: number) => {
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
      <NewsForm
        formData={formData}
        isEditing={isEditing}
        loading={loading}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCheckboxChange={handleCheckboxChange}
      />
      <NewsList
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsManager;