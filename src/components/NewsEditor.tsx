import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NewsEditorProps {
  content: string;
  onChange: (content: string) => void;
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

const NewsEditor: React.FC<NewsEditorProps> = ({ content, onChange }) => {
  return (
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
  );
};

export default NewsEditor;