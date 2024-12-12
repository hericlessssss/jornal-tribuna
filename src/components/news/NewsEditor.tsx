import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ImageManager from './ImageManager';
import type { ImageItem } from '../../types/news';

interface NewsEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImagesChange: (images: ImageItem[]) => void;
  initialImages?: ImageItem[];
}

const NewsEditor: React.FC<NewsEditorProps> = ({ 
  content, 
  onChange, 
  onImagesChange, 
  initialImages = [] 
}) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages);

  const handleImagesChange = (newImages: ImageItem[]) => {
    setImages(newImages);
    onImagesChange(newImages);
  };

  const insertImageIntoEditor = (url: string) => {
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
            language_url: '/tinymce/langs/pt_BR.js'
          }}
        />
      </div>

      <ImageManager
        images={images}
        onChange={handleImagesChange}
        onInsertIntoEditor={insertImageIntoEditor}
      />
    </div>
  );
};

export default NewsEditor;