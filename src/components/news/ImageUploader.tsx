import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  uploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, uploading }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true,
    disabled: uploading,
    onDrop: async (acceptedFiles) => {
      await onUpload(acceptedFiles);
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
        uploading ? 'bg-gray-50' : 'hover:border-red-500'
      }`}
    >
      <input {...getInputProps()} disabled={uploading} />
      <div className="flex flex-col items-center">
        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-center text-gray-600">
          {uploading ? 'Enviando imagens...' : 'Arraste e solte imagens aqui, ou clique para selecionar'}
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;