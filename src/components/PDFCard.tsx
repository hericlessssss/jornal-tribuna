import React, { useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { validateAndFormatGoogleDriveUrl } from '../utils/googleDrive';

interface PDFCardProps {
  edition: {
    id: number;
    title: string;
    description?: string;
    pdf_url: string;
    created_at: string;
  };
  onView: (url: string) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ edition, onView }) => {
  const [imageError, setImageError] = useState(false);
  const { isValid, thumbnailUrl, downloadUrl } = validateAndFormatGoogleDriveUrl(edition.pdf_url);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative bg-gray-100 aspect-[1/1.4]">
        {isValid && thumbnailUrl && !imageError ? (
          <img
            src={thumbnailUrl}
            alt={edition.title}
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

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
            onClick={() => onView(edition.pdf_url)}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </button>
          <a
            href={downloadUrl || edition.pdf_url}
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