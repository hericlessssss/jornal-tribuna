import React from 'react';
import { Trash2, Edit, Eye, Download } from 'lucide-react';
import { PDFEdition } from '../../types/editions';

interface EditionListProps {
  editions: PDFEdition[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onView: (url: string) => void;
}

const EditionList: React.FC<EditionListProps> = ({
  editions,
  onDelete,
  onEdit,
  onView,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {editions.map((edition) => (
        <div
          key={edition.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative bg-gray-100 aspect-[1/1.4]">
            {edition.cover_image_url ? (
              <img
                src={edition.cover_image_url}
                alt={edition.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Sem capa</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
            <p className="text-gray-600 mb-2">{edition.date}</p>
            {edition.description && (
              <p className="text-gray-500 text-sm mb-4">{edition.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onView(edition.pdf_url)}
                className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              >
                <Eye className="w-4 h-4" />
                Visualizar
              </button>
              <a
                href={edition.pdf_url}
                download
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => onEdit(edition.id)}
                className="p-2 text-blue-600 hover:text-blue-800"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(edition.id)}
                className="p-2 text-red-600 hover:text-red-800"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditionList;