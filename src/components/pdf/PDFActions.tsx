import React from 'react';
import { Eye, Download } from 'lucide-react';
import { parsePDFUrl } from '../../services/pdf/urlParser';

interface PDFActionsProps {
  url: string;
}

const PDFActions: React.FC<PDFActionsProps> = ({ url }) => {
  const { previewUrl, downloadUrl } = parsePDFUrl(url);

  return (
    <div className="grid grid-cols-2 gap-4">
      <a
        href={previewUrl || url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
      >
        <Eye className="w-4 h-4" />
        Visualizar
      </a>
      <a
        href={downloadUrl || url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
  );
};

export default PDFActions;