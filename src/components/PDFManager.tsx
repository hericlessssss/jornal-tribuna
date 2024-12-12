import React, { useState } from 'react';
import { Trash2, Edit, Eye, Download, Plus } from 'lucide-react';
import PDFUploader from './PDFUploader';
import PDFViewer from './PDFViewer';
import toast from 'react-hot-toast';

interface PDFEdition {
  id: number;
  title: string;
  date: string;
  description: string;
  pdf_url: string;
  cover_image_url: string;
}

interface PDFManagerProps {
  editions: PDFEdition[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<PDFEdition>) => Promise<void>;
  onUpload: (file: File | null, metadata: any) => Promise<void>;
}

const PDFManager: React.FC<PDFManagerProps> = ({
  editions,
  onDelete,
  onEdit,
  onUpload,
}) => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PDFEdition>>({});

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta edição?')) {
      try {
        const loadingToast = toast.loading('Excluindo edição...');
        await onDelete(id);
        toast.success('Edição excluída com sucesso!', { id: loadingToast });
      } catch (error) {
        console.error('Error deleting edition:', error);
        toast.error('Erro ao excluir edição');
      }
    }
  };

  const handleEdit = (id: number) => {
    const edition = editions.find(e => e.id === id);
    if (edition) {
      setEditForm({
        title: edition.title,
        date: edition.date,
        description: edition.description,
      });
      setEditingId(id);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && editForm) {
      try {
        const loadingToast = toast.loading('Atualizando edição...');
        await onEdit(editingId, editForm);
        toast.success('Edição atualizada com sucesso!', { id: loadingToast });
        setEditingId(null);
        setEditForm({});
      } catch (error) {
        console.error('Error updating edition:', error);
        toast.error('Erro ao atualizar edição');
      }
    }
  };

  const handleUpload = async (file: File | null, metadata: any) => {
    try {
      const loadingToast = toast.loading('Enviando edição...');
      await onUpload(file, metadata);
      toast.success('Edição adicionada com sucesso!', { id: loadingToast });
      setShowUploader(false);
    } catch (error) {
      console.error('Error uploading edition:', error);
      toast.error('Erro ao adicionar edição');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Edições</h2>
        <button
          onClick={() => setShowUploader(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Edição
        </button>
      </div>

      {showUploader && (
        <PDFUploader
          onUpload={handleUpload}
          onCancel={() => setShowUploader(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((edition) => (
          <div
            key={edition.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative bg-gray-100 aspect-[1/1.4]">
              {edition.cover_image_url ? (
                <img
                  src={edition.cover_image_url}
                  alt={edition.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Sem capa</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
              <p className="text-gray-600 mb-2">{edition.date}</p>
              {edition.description && (
                <p className="text-gray-500 text-sm mb-4">{edition.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPDF(edition.pdf_url)}
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <a
                  href={edition.pdf_url}
                  download
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(edition.id)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edition.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                value={editForm.date || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditForm({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      )}

      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};

export default PDFManager;