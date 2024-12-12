import React, { useState } from 'react';
import { Link as LinkIcon, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PDFUploaderProps {
  onUpload: (metadata: { title: string; description: string; external_url: string }) => Promise<void>;
  onCancel: () => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload, onCancel }) => {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    external_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!metadata.title.trim()) {
      toast.error('Por favor, insira um título');
      return;
    }

    if (!metadata.external_url.trim()) {
      toast.error('Por favor, insira o link do Google Drive');
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(metadata);
      onCancel();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao adicionar edição');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Nova Edição em PDF</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Edição
            </label>
            <input
              type="text"
              id="title"
              value={metadata.title}
              onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="external_url" className="block text-sm font-medium text-gray-700">
              Link do Google Drive
            </label>
            <input
              type="url"
              id="external_url"
              value={metadata.external_url}
              onChange={(e) => setMetadata(prev => ({ ...prev, external_url: e.target.value }))}
              placeholder="https://drive.google.com/file/d/..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
            <div className="mt-2 flex items-start space-x-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="mb-2">Use apenas links do Google Drive. Para compartilhar:</p>
                <div className="ml-4">
                  <div>1. Abra o arquivo no Google Drive</div>
                  <div>2. Clique em "Compartilhar"</div>
                  <div>3. Configure para "Qualquer pessoa com o link pode visualizar"</div>
                  <div>4. Copie o link e cole aqui</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isUploading ? 'Salvando...' : 'Salvar Edição'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PDFUploader;