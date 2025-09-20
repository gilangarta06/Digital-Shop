'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="pt-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex justify-center"
    >
      <div className="w-full max-w-5xl px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img
              src="/images/hero1.jpg"
              alt="Hero Banner 1"
              className="w-full h-[45vh] object-cover rounded-2xl shadow-lg"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/images/hero-banner-2.png"
              alt="Hero Banner 2"
              className="w-full h-[45vh] object-cover rounded-2xl shadow-lg"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/images/hero-banner-3.png"
              alt="Hero Banner 3"
              className="w-full h-[45vh] object-cover rounded-2xl shadow-lg"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
