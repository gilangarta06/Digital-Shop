'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Shield, Headphones } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Produk Digital Lengkap',
    description: 'Berbagai macam produk digital premium untuk semua kebutuhan Anda',
  },
  {
    icon: DollarSign,
    title: 'Tanpa Biaya Admin',
    description: 'Harga yang tertera adalah harga final, tidak ada biaya tersembunyi',
  },
  {
    icon: Shield,
    title: 'Pembayaran Aman',
    description: 'Pembayaran melalui gateway yang terpercaya dan aman',
  },
  {
    icon: Headphones,
    title: 'CS 24/7',
    description: 'Customer service siap membantu Anda kapan saja',
  },
];

export default function Features() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section
      className={`py-20 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900'
          : 'bg-gradient-to-b from-white to-blue-50'
      } transition-colors duration-700`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Mengapa <span className="text-blue-600">Memilih Kami?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500">
            Keunggulan yang membuat pengalaman Anda lebih mudah, aman, dan menyenangkan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <CardContent className="flex flex-col items-center text-center p-8">
                <div
                  className={`h-16 w-16 flex items-center justify-center rounded-full mb-6 transition-transform duration-300
                    ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}
                    group-hover:scale-110`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  {feature.description}
                </p>
              </CardContent>

              <div
                className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/60 transition-all duration-500 pointer-events-none`}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
