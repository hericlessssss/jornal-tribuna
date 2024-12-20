import React, { useState, useEffect } from 'react';
import { X, AlertCircle, FileText } from 'lucide-react';
import { validateAndFormatGoogleDriveUrl } from '../utils/googleDrive';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isValid, previewUrl, error: urlError } = validateAndFormatGoogleDriveUrl(pdfUrl);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isValid) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-lg p-6">
          <div className="flex items-start space-x-3 text-red-600">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Erro ao carregar PDF</h3>
              <p className="text-sm text-gray-600">{urlError || 'Não foi possível carregar o arquivo'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white w-full h-[90vh] rounded-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando PDF...</p>
            </div>
          </div>
        )}

        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="PDF Viewer"
          allowFullScreen
          allow="autoplay"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Erro ao carregar o PDF. Verifique se o arquivo está acessível.');
            setLoading(false);
          }}
        />

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center p-6">
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-2">Erro ao carregar PDF</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Abrir em nova aba
                </a>
                <button
                  onClick={onClose}
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;