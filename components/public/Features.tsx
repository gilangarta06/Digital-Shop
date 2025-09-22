'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Mengapa <span className="text-blue-600 dark:text-blue-400">Memilih Kami?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Keunggulan yang membuat pengalaman Anda lebih mudah, aman, dan menyenangkan
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card
                className="group relative h-full overflow-hidden border border-gray-100 dark:border-gray-700 
                  rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  {/* Icon */}
                  <div
                    className="h-16 w-16 flex items-center justify-center rounded-full mb-6 
                      bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 
                      text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300"
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent 
                  group-hover:border-blue-500/70 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] 
                  transition-all duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
