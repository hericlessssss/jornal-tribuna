import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import { useEditionsStore } from '../store/editions';
import { formatDate } from '../utils/dateFormatter';

const PDFEditions = () => {
  const { editions, loading, fetchEditions } = useEditionsStore();
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  const loadMoreEditions = () => {
    setVisibleCount((prev) => prev + 9);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando edições...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Edições em PDF</h1>
          <p className="text-lg text-gray-600">
            Acesse as edições anteriores do Jornal Tribuna em formato PDF.
          </p>
        </div>

        {editions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhuma edição disponível no momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editions.slice(0, visibleCount).map((edition) => (
                <div key={edition.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative bg-gray-100 aspect-[1/1.4]">
                    {edition.cover_image_url ? (
                      <img
                        src={edition.cover_image_url}
                        alt={edition.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <FileText className="w-4 h-4 inline-block mr-1" />
                      {edition.title}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {formatDate(edition.created_at || '')}
                    </p>
                    {edition.description && (
                      <p className="text-gray-500 text-sm mb-4">{edition.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedPDF(edition.pdf_url)}
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
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < editions.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreEditions}
                  className="px-6 py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Ver mais edições
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-16">
          <Link
            to="/contato"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-lg"
          >
            Não encontrou a edição que procura? Entre em contato conosco que lhe enviamos!
          </Link>
        </div>
      </div>

      {selectedPDF && <PDFViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}
    </div>
  );
};

export default PDFEditions;