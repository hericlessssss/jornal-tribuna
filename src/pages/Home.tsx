import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FileText, Download, Eye, ArrowRight } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import AdDisplay from '../components/AdDisplay';
import { useNewsStore } from '../store/news';
import { useEditionsStore } from '../store/editions';
import { useAdsStore } from '../store/ads';
import { formatDate } from '../utils/dateFormatter';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const { news, fetchNews } = useNewsStore();
  const { editions, fetchEditions } = useEditionsStore();
  const { fetchAds } = useAdsStore();

  useEffect(() => {
    fetchNews();
    fetchEditions();
    fetchAds();
  }, [fetchNews, fetchEditions, fetchAds]);

  const highlightedNews = news.filter((item) => item.highlighted);
  const featuredNews = news.filter((item) => item.homepage_highlight);
  const recentEditions = editions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Slider */}
        <section className="py-4">
          {highlightedNews.length > 0 ? (
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ 
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true 
                }}
                loop={true}
                speed={800}
              >
                {highlightedNews.map((newsItem) => (
                  <SwiperSlide key={newsItem.id}>
                    <div className="flex flex-col md:flex-row">
                      {/* Image Container */}
                      <div className="w-full md:w-1/2">
                        <div className="relative">
                          <img
                            src={newsItem.cover_image_url || '/default-image.jpg'}
                            alt={newsItem.title}
                            className="news-slider-image"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-image.jpg';
                            }}
                          />
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full mb-4">
                            {newsItem.category}
                          </span>
                          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 line-clamp-3">
                            {newsItem.title}
                          </h2>
                          <p className="text-gray-600 line-clamp-4">
                            {newsItem.excerpt?.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                        <div className="mt-6">
                          <Link
                            to={`/noticias/${newsItem.id}`}
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Ler mais
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Nenhuma notícia destacada encontrada.</p>
            </div>
          )}
        </section>

        {/* Advertisement Section */}
        <section className="py-8">
          <AdDisplay />
        </section>

        {/* Latest Editions Section */}
        <section className="py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Últimas Edições</h2>
            <Link
              to="/edicoes"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
            >
              Ver todas as edições
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEditions.map((edition) => (
              <div
                key={edition.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
              >
                <div className="relative bg-gray-100 aspect-[1/1.4]">
                  <img
                    src={edition.cover_image_url || '/default-image.jpg'}
                    alt={edition.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-image.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{edition.title}</h3>
                  <p className="text-gray-600 mb-4">{formatDate(edition.created_at || '')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => window.open(edition.pdf_url, '_blank')}
                      className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>
                    <a
                      href={edition.pdf_url}
                      download
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured News Section */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notícias em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNews.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;