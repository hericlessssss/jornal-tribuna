import React, { useState, useEffect } from 'react';
import { Newspaper, FileText } from 'lucide-react';
import PDFManager from '../components/PDFManager';
import NewsManager from '../components/NewsManager';
import { generatePDFThumbnail } from './utils/pdfToImage';

interface PDFEdition {
  id: number;
  title: string;
  date: string;
  description: string;
  pdfUrl: string;
  cover: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'editions'>('editions');
  const [editions, setEditions] = useState<PDFEdition[]>([]);

  useEffect(() => {
    // Simular carregamento inicial das edições
    const loadEditions = async () => {
      const mockEditions = [
        {
          id: 1,
          title: 'Edição 482',
          date: '2024-03-15',
          description: 'Edição de Março 2024',
          pdfUrl: '/pdfs/EDICAO482.pdf',
          cover: '',
        },
        // Adicione mais edições mock conforme necessário
      ];

      // Gerar thumbnails para cada edição
      const editionsWithCovers = await Promise.all(
        mockEditions.map(async (edition) => ({
          ...edition,
          cover: await generatePDFThumbnail(edition.pdfUrl),
        }))
      );

      setEditions(editionsWithCovers);
    };

    loadEditions();
  }, []);

  const handlePDFUpload = async (file: File, metadata: any) => {
    // Simular upload do arquivo
    const fileUrl = URL.createObjectURL(file);
    const newEdition: PDFEdition = {
      id: Date.now(),
      title: metadata.title,
      date: metadata.date,
      description: metadata.description,
      pdfUrl: fileUrl,
      cover: await generatePDFThumbnail(fileUrl),
    };

    setEditions((prev) => [newEdition, ...prev]);
  };

  const handlePDFDelete = async (id: number) => {
    setEditions((prev) => prev.filter((edition) => edition.id !== id));
  };

  const handlePDFEdit = async (id: number, data: Partial<PDFEdition>) => {
    setEditions((prev) =>
      prev.map((edition) =>
        edition.id === id ? { ...edition, ...data } : edition
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('editions')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'editions'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-5 h-5 inline-block mr-2" />
                Gerenciar Edições
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'news'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Newspaper className="w-5 h-5 inline-block mr-2" />
                Gerenciar Notícias
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'editions' ? (
              <PDFManager
                editions={editions}
                onDelete={handlePDFDelete}
                onEdit={handlePDFEdit}
                onUpload={handlePDFUpload}
              />
            ) : (
              <NewsManager />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;