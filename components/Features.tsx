'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Shield, Headphones } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Mengapa <span className="text-blue-600">Memilih Kami?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keunggulan yang membuat pengalaman Anda lebih mudah, aman, dan menyenangkan
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="flex flex-col items-center text-center p-8">
                
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>

              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/60 transition-colors duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
