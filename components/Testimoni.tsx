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
      className={`py-16 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-500">
            Apa Kata Client Kami
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-500">
            Beberapa testimoni dari client yang puas dengan layanan kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
            >
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-500'
                    } transition-colors duration-300`}
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-500">
                "{t.message}"
              </p>
              <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                - {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
