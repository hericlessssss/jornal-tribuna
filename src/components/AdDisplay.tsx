import React, { useEffect, useState } from 'react';
import { useAdsStore } from '../store/ads';

const AdDisplay = () => {
  const { ads } = useAdsStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;

    // Função para alternar entre os anúncios
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length); // Altera o índice, e quando chega no último, começa novamente
    }, 5000); // Troca de anúncio a cada 5 segundos

    return () => clearInterval(interval); // Limpar o intervalo ao desmontar o componente
  }, [ads]); // O efeito é dependente da lista de anúncios

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

  // Seleciona o anúncio atual com base no índice
  const currentAd = ads[currentAdIndex];

  return (
    <a
      href={currentAd.redirect_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-4xl mx-auto" // Adiciona max-width para telas grandes
    >
      <img
        src={currentAd.image_url}
        alt={currentAd.title}
        className="w-full h-auto object-cover rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
      />
    </a>
  );
};

export default AdDisplay;
