'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroSection() {
  return (
    <section id="home" className="pt-16">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[80vh] w-full"
      >
        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('/images/hero1.jpg')" }}>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('/images/hero1.jpg')" }}>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('/images/hero1.jpg')" }}>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
