import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';
import { generatePDFThumbnail } from '../pages/utils/pdfToImage';

interface Edition {
  id: number;
  title: string;
  date: string;
  cover: string;
  pdfUrl: string;
}

const PDFEditions = () => {
  const [dynamicEditions, setDynamicEditions] = useState<Edition[]>([]);
  const [visibleCount, setVisibleCount] = useState(9); // Initial visible editions
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditions = async () => {
      const editions: Edition[] = [
        { id: 482, title: 'EDIÇÃO 482', date: '15 de Março de 2024', cover: '', pdfUrl: '/pdfs/EDICAO482.pdf' },
        { id: 483, title: 'EDIÇÃO 483', date: '16 de Março de 2024', cover: '', pdfUrl: '/pdfs/EDICAO483.pdf' },
        { id: 484, title: 'EDIÇÃO 484', date: '17 de Março de 2024', cover: '', pdfUrl: '/pdfs/EDICAO484.pdf' },
        // More editions can be added here
      ];

      const updatedEditions = await Promise.all(
        editions.map(async (edition) => {
          try {
            const cover = await generatePDFThumbnail(edition.pdfUrl);
            return { ...edition, cover };
          } catch {
            return { ...edition, cover: '' };
          }
        })
      );
      setDynamicEditions(updatedEditions);
    };

    fetchEditions();
  }, []);

  const loadMoreEditions = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Edições em PDF</h1>
          <p className="text-lg text-gray-600">Acesse as edições anteriores do Jornal Tribuna em formato PDF.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dynamicEditions.slice(0, visibleCount).map((edition) => (
            <div key={edition.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                {edition.cover ? (
                  <img
                    src={edition.cover}
                    alt={edition.title}
                    className="w-full object-cover aspect-[8.5/11]"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                    <span>Carregando...</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <FileText className="w-4 h-4 inline-block mr-1" />
                  {edition.title}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
                <p className="text-gray-600">{edition.date}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    onClick={() => setSelectedPDF(edition.pdfUrl)}
                    className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => window.open(edition.pdfUrl, '_blank')}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < dynamicEditions.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreEditions}
              className="px-6 py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Ver mais edições
            </button>
          </div>
        )}
      </div>

      {selectedPDF && <PDFViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}
    </div>
  );
};

export default PDFEditions;
