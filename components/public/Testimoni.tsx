'use client';

import { Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Andi Wijaya',
    rating: 5,
    message: 'Pelayanan sangat cepat dan produk sesuai. Sangat puas belanja di sini!',
  },
  {
    id: 2,
    name: 'Siti Rahma',
    rating: 4,
    message: 'Produk bagus, harga terjangkau. Hanya pengiriman agak lama.',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    rating: 5,
    message: 'Sangat recommended! Transaksi aman dan proses mudah.',
  },
];

export default function TestimonialSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      id="testimonials"
      className={`py-20 transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gray-900'
          : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white transition-colors">
            Apa Kata <span className="text-blue-600 dark:text-blue-400">Client Kami</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Beberapa testimoni dari client yang puas dengan layanan kami
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              style={{ animation: `fadeUp 0.6s ease ${idx * 0.2}s both` }}
            >
              {/* Avatar */}
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < t.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{t.message}"
              </p>

              {/* Hover Glow Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* FadeUp Keyframes */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
