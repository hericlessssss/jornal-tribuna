import React from 'react';
import { useAdsStore } from '../store/ads';

const AdDisplay = () => {
  const { ads } = useAdsStore();

  if (ads.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-xl p-8 text-white text-center h-[300px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Anuncie Conosco</h2>
            <p className="text-lg mb-6">
              Alcance milhares de leitores em Unaí e região. Seu negócio merece destaque!
            </p>
            <a
              href="/contato"
              className="inline-block bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Saiba Mais
            </a>
          </div>
        ))}
      </div>
    );
  }

  const shuffledAds = [...ads].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {shuffledAds.map((ad) => (
        <a
          key={ad.id}
          href={ad.redirect_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-lg shadow-xl overflow-hidden transition-transform hover:scale-[1.02] h-[300px]"
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {ad.title}
              </h3>
            </div>
          </div>
        </a>
      ))}
      {Array.from({ length: Math.max(0, 3 - shuffledAds.length) }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-xl p-8 text-white text-center h-[300px] flex flex-col items-center justify-center"
        >
          <h2 className="text-2xl font-bold mb-4">Anuncie Conosco</h2>
          <p className="text-lg mb-6">
            Alcance milhares de leitores em Unaí e região. Seu negócio merece destaque!
          </p>
          <a
            href="/contato"
            className="inline-block bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Saiba Mais
          </a>
        </div>
      ))}
    </div>
  );
};

export default AdDisplay;