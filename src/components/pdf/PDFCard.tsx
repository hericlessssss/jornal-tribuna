import React from 'react';
import { Download, Eye } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import PDFThumbnail from './PDFThumbnail';
import type { PDFEdition } from '../../types/editions';
import { validateGoogleDriveUrl } from '../../services/pdf/googleDrive';

interface PDFCardProps {
  edition: PDFEdition;
}

const PDFCard: React.FC<PDFCardProps> = ({ edition }) => {
  const { preview: previewUrl } = validateGoogleDriveUrl(edition.pdf_url);

  const handleView = () => {
    window.open(previewUrl || edition.pdf_url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <PDFThumbnail 
        url={edition.pdf_url} 
        title={edition.title}
        className="aspect-[1/1.4]"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
        <p className="text-gray-600 mb-2">
          {formatDate(edition.created_at)}
        </p>
        {edition.description && (
          <p className="text-gray-500 text-sm mb-4">{edition.description}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleView}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </button>
          <a
            href={edition.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;