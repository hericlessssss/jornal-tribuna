import React, { useEffect, useState } from 'react';
import { useEditionsStore } from '../store/editions';
import PDFCard from '../components/pdf/PDFCard';
import type { PDFEdition } from '../types/editions';

const EDITIONS_PER_PAGE = 6;

const PDFEditions = () => {
  const { editions, loading, fetchEditions } = useEditionsStore();
  const [visibleCount, setVisibleCount] = useState(EDITIONS_PER_PAGE);

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  const loadMoreEditions = () => {
    setVisibleCount((prev) => prev + EDITIONS_PER_PAGE);
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

  const visibleEditions = editions.slice(0, visibleCount);
  const hasMoreEditions = visibleCount < editions.length;

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
              {visibleEditions.map((edition) => (
                <PDFCard key={edition.id} edition={edition} />
              ))}
            </div>

            {hasMoreEditions && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreEditions}
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ver mais edições
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PDFEditions;