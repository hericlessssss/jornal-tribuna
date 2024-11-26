import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FileText, Download, Eye } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import AdDisplay from '../components/AdDisplay';
import { useNewsStore } from '../store/news';
import { useEditionsStore } from '../store/editions';
import { useAdsStore } from '../store/ads';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const { news, fetchNews, loading: newsLoading } = useNewsStore();
  const { editions, fetchEditions, loading: editionsLoading } = useEditionsStore();
  const { fetchAds, loading: adsLoading } = useAdsStore();

  useEffect(() => {
    fetchNews();
    fetchEditions();
    fetchAds();
  }, [fetchNews, fetchEditions, fetchAds]);

  const highlightedNews = news.filter((item) => item.highlighted);
  const featuredNews = news.filter((item) => item.homepage_highlight);
  const recentEditions = editions.slice(0, 6);

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
          {highlightedNews.map((newsItem) => (
            <SwiperSlide key={newsItem.id}>
              <div className="relative h-full">
                <img
                  src={newsItem.cover_image_url}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
                    <h2 className="text-4xl font-bold mb-4">{newsItem.title}</h2>
                    <p className="text-xl mb-6">{newsItem.content.substring(0, 200)}...</p>
                    <Link
                      to={`/noticias/${newsItem.id}`}
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
          {adsLoading ? (
            <p>Carregando anúncios...</p>
          ) : (
            <AdDisplay />
          )}
        </div>
      </section>

      {/* Latest Editions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Últimas Edições</h2>
          {editionsLoading ? (
            <p>Carregando edições...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEditions.map((edition) => (
                <div
                  key={edition.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img
                      src={edition.cover_image_url}
                      alt={edition.title}
                      className="w-full h-64 object-cover"
                    />
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
                        onClick={() => window.open(edition.pdf_url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = edition.pdf_url;
                          link.download = `${edition.title}.pdf`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notícias em Destaque</h2>
          {newsLoading ? (
            <p>Carregando notícias...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((newsItem) => (
                <NewsCard key={newsItem.id} {...newsItem} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
