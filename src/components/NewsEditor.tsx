import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImagesChange: (images: ImageItem[]) => void;
  initialImages?: ImageItem[];
}

export interface ImageItem {
  id: string;
  url: string;
  order: number;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
  'link'
];

const NewsEditor: React.FC<NewsEditorProps> = ({ content, onChange, onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast.error('Por favor, insira uma URL de imagem');
      return;
    }

    if (!isValidUrl(newImageUrl)) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    const newImage: ImageItem = {
      id: Date.now().toString(),
      url: newImageUrl,
      order: images.length
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setNewImageUrl('');
    toast.success('Imagem adicionada com sucesso!');
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images
      .filter(img => img.id !== id)
      .map((img, index) => ({ ...img, order: index }));
    
    setImages(updatedImages);
    onImagesChange(updatedImages);
    toast.success('Imagem removida com sucesso!');
  };

  const insertImage = (url: string) => {
    const imageHtml = `<img src="${url}" alt="Imagem da notícia" class="my-4 rounded-lg max-w-full h-auto" />`;
    const editor = document.querySelector('.ql-editor');
    if (editor) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const img = document.createElement('div');
        img.innerHTML = imageHtml;
        range.insertNode(img.firstChild as Node);
      } else {
        editor.innerHTML += imageHtml;
      }
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="h-[400px] mb-12"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Gerenciar Imagens</h3>
        
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Cole a URL da imagem aqui"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={handleAddImage}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {images.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {images.map((image) => (
              <div key={image.id} className="flex items-center p-3 gap-4">
                <img
                  src={image.url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <button
                    type="button"
                    onClick={() => insertImage(image.url)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Inserir no texto
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEditor;