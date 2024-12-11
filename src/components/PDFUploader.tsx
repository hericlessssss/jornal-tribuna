import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadPDFEdition } from '../services/editionService';

interface PDFUploaderProps {
  onUpload: (file: File, metadata: any) => Promise<void>;
  onCancel: () => void;
}

interface PDFMetadata {
  title: string;
  description: string;
}

// 25MB in bytes
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: '',
    description: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('O arquivo excede o limite de 25MB');
        return;
      }
      
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        const title = file.name.replace('.pdf', '').replace(/_/g, ' ');
        setMetadata(prev => ({ ...prev, title }));
      } else {
        toast.error('Por favor, selecione apenas arquivos PDF');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    try {
      setIsUploading(true);
      await uploadPDFEdition(selectedFile, metadata);
      toast.success('Edição adicionada com sucesso!');
      onCancel();
    } catch (error) {
      console.error('Erro ao fazer upload do PDF:', error);
      toast.error('Erro ao adicionar edição');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Upload de Nova Edição</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-500'
        }`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Arraste um arquivo PDF ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">Tamanho máximo: 25 MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Edição
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={metadata.title}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
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