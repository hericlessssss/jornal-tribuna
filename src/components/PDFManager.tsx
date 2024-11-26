import React, { useState } from 'react';
import { Trash2, Edit, Eye, Download, Plus } from 'lucide-react';
import PDFUploader from './PDFUploader';
import PDFViewer from './PDFViewer';

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
  onUpload: (file: File, metadata: any) => Promise<void>;
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
      await onDelete(id);
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
      await onEdit(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
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
          onUpload={async (file, metadata) => {
            await onUpload(file, metadata);
            setShowUploader(false);
          }}
          onCancel={() => setShowUploader(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((edition) => (
          <div
            key={edition.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {editingId === edition.id ? (
              <form onSubmit={handleEditSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title || ''}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date || ''}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      name="description"
                      value={editForm.description || ''}
                      onChange={handleEditChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                {edition.cover_image_url && (
                  <img
                    src={edition.cover_image_url}
                    alt={edition.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{edition.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{edition.date}</p>
                  <p className="text-sm text-gray-500 mb-4">{edition.description}</p>

                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedPDF(edition.pdf_url)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <a
                        href={edition.pdf_url}
                        download
                        className="text-green-600 hover:text-green-800 inline-block"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(edition.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(edition.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

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
