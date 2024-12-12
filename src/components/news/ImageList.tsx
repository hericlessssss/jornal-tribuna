import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { X, GripVertical } from 'lucide-react';
import type { ImageItem } from '../../types/news';

interface ImageListProps {
  images: ImageItem[];
  onSort: (newOrder: ImageItem[]) => void;
  onDelete: (imageId: string) => void;
  onInsert: (imageUrl: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onSort, onDelete, onInsert }) => {
  if (images.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <ReactSortable
        list={images}
        setList={onSort}
        animation={200}
        handle=".handle"
        className="divide-y divide-gray-200"
      >
        {images.map((image) => (
          <div key={image.id} className="flex items-center p-3 gap-4">
            <div className="handle cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical className="w-5 h-5" />
            </div>
            <img
              src={image.url}
              alt="Uploaded"
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-grow">
              <button
                type="button"
                onClick={() => onInsert(image.url)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Inserir no texto
              </button>
            </div>
            <button
              type="button"
              onClick={() => onDelete(image.id)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default ImageList;