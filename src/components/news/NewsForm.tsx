import React from 'react';
import { PlusCircle } from 'lucide-react';

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

interface NewsFormProps {
  formData: NewsFormData;
  isEditing: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({
  formData,
  isEditing,
  loading,
  onSubmit,
  onChange,
  onCheckboxChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-6">
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
              onChange={onCheckboxChange}
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
              onChange={onCheckboxChange}
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
  );
};

export default NewsForm;