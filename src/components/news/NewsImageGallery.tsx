import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NewsImageGalleryProps {
  images: Array<{
    url: string;
    order: number;
  }>;
}

const NewsImageGallery: React.FC<NewsImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden"
        spaceBetween={30}
      >
        {images
          .sort((a, b) => a.order - b.order)
          .map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-[400px] object-cover"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default NewsImageGallery;