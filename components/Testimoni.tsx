'use client';

import { Star } from 'lucide-react';

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
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Apa Kata Client Kami</h2>
          <p className="text-xl text-gray-600">Beberapa testimoni dari client yang puas dengan layanan kami</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t.message}"</p>
              <p className="font-semibold text-gray-900">- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
