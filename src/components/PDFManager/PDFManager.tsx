import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PDFUploader from '../PDFUploader';
import PDFViewer from '../PDFViewer';
import EditionList from './EditionList';
import EditionEditor from './EditionEditor';
import { PDFEdition } from '../../types/editions';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/errors';

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta edição?')) {
      try {
        const loadingToast = toast.loading('Excluindo edição...');
        await onDelete(id);
        toast.success('Edição excluída com sucesso!', { id: loadingToast });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  };

  const handleEdit = async (id: number, data: Partial<PDFEdition>) => {
    try {
      const loadingToast = toast.loading('Atualizando edição...');
      await onEdit(id, data);
      toast.success('Edição atualizada com sucesso!', { id: loadingToast });
      setEditingId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpload = async (file: File | null, metadata: any) => {
    try {
      const loadingToast = toast.loading('Enviando edição...');
      await onUpload(file, metadata);
      toast.success('Edição adicionada com sucesso!', { id: loadingToast });
      setShowUploader(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
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

      <EditionList
        editions={editions}
        onDelete={handleDelete}
        onEdit={(id) => setEditingId(id)}
        onView={(url) => setSelectedPDF(url)}
      />

      {editingId !== null && (
        <EditionEditor
          edition={editions.find(e => e.id === editingId)!}
          onSave={handleEdit}
          onCancel={() => setEditingId(null)}
        />
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