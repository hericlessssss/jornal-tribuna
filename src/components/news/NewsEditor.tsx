import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDropzone } from 'react-dropzone';
import { ReactSortable } from 'react-sortablejs';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { X, Image as ImageIcon, GripVertical } from 'lucide-react';

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

const NewsEditor: React.FC<NewsEditorProps> = ({ content, onChange, onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      try {
        setUploading(true);
        const uploadPromises = acceptedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('news-images')
            .getPublicUrl(fileName);

          return {
            id: fileName,
            url: publicUrl,
            order: images.length
          };
        });

        const newImages = await Promise.all(uploadPromises);
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        toast.success('Imagens carregadas com sucesso!');
      } catch (error) {
        console.error('Erro ao fazer upload das imagens:', error);
        toast.error('Erro ao carregar imagens');
      } finally {
        setUploading(false);
      }
    }
  });

  const handleImageSort = (newOrder: ImageItem[]) => {
    const reorderedImages = newOrder.map((item, index) => ({
      ...item,
      order: index
    }));
    setImages(reorderedImages);
    onImagesChange(reorderedImages);
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await supabase.storage
        .from('news-images')
        .remove([imageId]);

      const updatedImages = images
        .filter(img => img.id !== imageId)
        .map((img, index) => ({ ...img, order: index }));
      
      setImages(updatedImages);
      onImagesChange(updatedImages);
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Erro ao remover imagem');
    }
  };

  const insertImage = (url: string) => {
    const imageHtml = `<img src="${url}" alt="Imagem da notícia" class="my-4 rounded-lg max-w-full h-auto" />`;
    if (window.tinymce) {
      window.tinymce.activeEditor.insertContent(imageHtml);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Editor
          apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
          value={content}
          onEditorChange={onChange}
          init={{
            height: 500,
            menubar: true,
            readonly: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                font-size: 16px;
                line-height: 1.5;
                padding: 1rem;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              p { margin: 0 0 1rem 0; }
              h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 1rem; }
            `,
            branding: false,
            promotion: false,
            language: 'pt_BR',
            language_url: '/tinymce/langs/pt_BR.js',
            setup: (editor) => {
              editor.on('init', () => {
                editor.getContainer().style.visibility = 'visible';
              });
            }
          }}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Gerenciar Imagens</h3>
        
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

        {images.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <ReactSortable
              list={images}
              setList={handleImageSort}
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
                      onClick={() => insertImage(image.url)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Inserir no texto
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEditor;