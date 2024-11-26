import React from 'react';
import { useAdsStore } from '../store/ads';

const AdDisplay = () => {
  const { ads } = useAdsStore();

  if (ads.length === 0) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Anuncie Conosco</h2>
        <p className="text-xl mb-6">
          Alcance milhares de leitores em Unaí e região. Seu negócio merece destaque!
        </p>
        <a
          href="/contato"
          className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Saiba Mais
        </a>
      </div>
    );
  }

  // Seleciona um anúncio aleatório para exibir
  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <a
      href={randomAd.redirect_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={randomAd.image_url}
        alt={randomAd.title}
        className="w-full h-auto rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
      />
    </a>
  );
};

export default AdDisplay;