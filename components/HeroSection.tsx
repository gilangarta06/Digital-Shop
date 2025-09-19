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
            <div className="bg-black/40 p-6 rounded-xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Produk Digital Premium</h1>
              <p className="text-lg md:text-xl mb-6">Dapatkan akses instan dengan harga terbaik</p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('/images/hero2.jpg')" }}>
            <div className="bg-black/40 p-6 rounded-xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Bayar Mudah & Aman</h1>
              <p className="text-lg md:text-xl mb-6">Integrasi Midtrans untuk transaksi nyaman</p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('/images/hero3.jpg')" }}>
            <div className="bg-black/40 p-6 rounded-xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Solusi Digital Lengkap</h1>
              <p className="text-lg md:text-xl mb-6">Streaming, AI, Editing, dan banyak lagi</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
