import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FileText, Download, Eye } from 'lucide-react';
import { generatePDFThumbnail } from './utils/pdfToImage';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const featuredNews = [
  {
    id: 1,
    title: 'Unaí recebe investimentos para modernização do parque industrial',
    image: 'https://www.blsistemas.com.br/wp-content/uploads/2017/04/investir-na-modernizacao-do-parque-industrial-e-a-saida-para-crise.jpg',
    excerpt: 'Nova fase de desenvolvimento econômico promete geração de empregos e crescimento sustentável para a região.',
  },
  {
    id: 2,
    title: 'Festival Cultural celebra tradições do Noroeste Mineiro',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200',
    excerpt: 'Evento reúne artistas locais e apresentações que destacam a rica cultura da região.',
  },
  {
    id: 3,
    title: 'Produção agrícola bate recorde na safra 2024',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200',
    excerpt: 'Agricultores da região celebram resultados expressivos na produção de grãos.',
  },
];

const recentEditions = [
  {
    id: 482,
    title: 'EDIÇÃO 482',
    date: '25 de Junho de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO482.pdf',
  },
  {
    id: 483,
    title: 'EDIÇÃO 483',
    date: '18 de Abril de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO483.pdf',
  },
  {
    id: 484,
    title: 'EDIÇÃO 484',
    date: '13 de Abril de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO484.pdf',
  },
  {
    id: 485,
    title: 'EDIÇÃO 485',
    date: '01 de Março de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO485.pdf',
  },
  {
    id: 486,
    title: 'EDIÇÃO 486',
    date: '16 de Fevereiro de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO486.pdf',
  },
  {
    id: 487,
    title: 'EDIÇÃO 487',
    date: '7 de Janeiro de 2024',
    cover: '',
    pdfUrl: '/pdfs/EDICAO487.pdf',
  },
];

const Home = () => {
  const [dynamicEditions, setDynamicEditions] = useState<typeof recentEditions>([]);

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  useEffect(() => {
    const loadCovers = async () => {
      const updatedEditions = await Promise.all(
        recentEditions.map(async (edition) => {
          try {
            const cover = await generatePDFThumbnail(edition.pdfUrl);
            return { ...edition, cover };
          } catch (error) {
            console.error(`Erro ao gerar miniatura para ${edition.title}:`, error);
            return { ...edition, cover: '' };
          }
        })
      );
      setDynamicEditions(updatedEditions);
    };

    loadCovers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-[600px]"
        >
          {featuredNews.map((news) => (
            <SwiperSlide key={news.id}>
              <div className="relative h-full">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
                    <h2 className="text-4xl font-bold mb-4">{news.title}</h2>
                    <p className="text-xl mb-6">{news.excerpt}</p>
                    <Link
                      to={`/noticias/${news.id}`}
                      className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Leia mais
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Advertisement Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Anuncie Conosco</h2>
            <p className="text-xl mb-6">
              Alcance milhares de leitores em Unaí e região. Seu negócio merece destaque!
            </p>
            <Link
              to="/contato"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Editions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Últimas Edições</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicEditions.map((edition) => (
              <div
                key={edition.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
              >
                <div className="relative">
                  {edition.cover ? (
                    <img
                      src={edition.cover}
                      alt={`Edição ${edition.date}`}
                      className="w-auto h-64 mx-auto object-cover"
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
                      className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                      onClick={() => window.open(edition.pdfUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => handleDownload(edition.pdfUrl)}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
