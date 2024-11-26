import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface PDFUploaderProps {
  onUpload: (file: File, metadata: PDFMetadata) => Promise<void>;
  onCancel: () => void;
}

interface PDFMetadata {
  title: string;
  date: string;
  description: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      const title = file.name.replace('.pdf', '').replace(/_/g, ' ');
      setMetadata(prev => ({ ...prev, title }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile, metadata);
      setSelectedFile(null);
      setMetadata({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (error) {
      console.error('Erro ao fazer upload do PDF:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Upload de Nova Edição</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
              isDragActive
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    Arraste um arquivo PDF ou clique para selecionar
                  </p>
                  <p className="text-sm text-gray-500">Tamanho máximo: 10 MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título da Edição
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={metadata.title}
            onChange={handleMetadataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data da Edição
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={metadata.date}
            onChange={handleMetadataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={metadata.description}
            onChange={handleMetadataChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isUploading || !selectedFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isUploading ? 'Enviando...' : 'Enviar PDF'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PDFUploader;
