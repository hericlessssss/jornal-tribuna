import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface NewsEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImagesChange: (urls: string[]) => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ content, onChange, onImagesChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      try {
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

          return publicUrl;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        onImagesChange(uploadedUrls);

        // Insert images into editor
        uploadedUrls.forEach(url => {
          const newContent = content + `<img src="${url}" alt="News image" />`;
          onChange(newContent);
        });

        toast.success('Imagens carregadas com sucesso!');
      } catch (error) {
        console.error('Erro ao fazer upload das imagens:', error);
        toast.error('Erro ao carregar imagens');
      }
    }
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="space-y-4">
      <ReactQuill 
        value={content} 
        onChange={onChange}
        modules={modules}
        className="h-64 mb-12"
      />
      
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-red-500"
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-600">
          Arraste e solte imagens aqui, ou clique para selecionar
        </p>
      </div>
    </div>
  );
};

export default NewsEditor;