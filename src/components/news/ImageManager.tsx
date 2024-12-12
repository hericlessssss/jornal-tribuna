import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';
import { uploadImages, deleteImage } from '../../services/imageService';
import type { ImageItem } from '../../types/news';
import toast from 'react-hot-toast';

interface ImageManagerProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  onInsertIntoEditor: (url: string) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onChange, onInsertIntoEditor }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    try {
      setUploading(true);
      const newImages = await uploadImages(files);
      const updatedImages = [...images, ...newImages];
      onChange(updatedImages);
      toast.success('Imagens carregadas com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      toast.error('Erro ao carregar imagens');
    } finally {
      setUploading(false);
    }
  };

  const handleSort = (newOrder: ImageItem[]) => {
    const reorderedImages = newOrder.map((item, index) => ({
      ...item,
      order: index
    }));
    onChange(reorderedImages);
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      const updatedImages = images
        .filter(img => img.id !== imageId)
        .map((img, index) => ({ ...img, order: index }));
      onChange(updatedImages);
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Erro ao remover imagem');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Gerenciar Imagens</h3>
      <ImageUploader onUpload={handleUpload} uploading={uploading} />
      <ImageList
        images={images}
        onSort={handleSort}
        onDelete={handleDelete}
        onInsert={onInsertIntoEditor}
      />
    </div>
  );
};

export default ImageManager;