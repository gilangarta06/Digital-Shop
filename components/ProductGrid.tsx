'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Bot, Tv, Scissors, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';

const categories = [
  {
    id: 1,
    title: 'AI Tools',
    icon: Bot,
    items: [
      { id: 'ai-1', name: 'ChatGPT Plus', price: 50000, stock: 0, category: 'AI Tools', image: '/images/hero1.jpg' },
      { id: 'ai-2', name: 'MidJourney', price: 70000, stock: 5, category: 'AI Tools', image: '/images/midjourney.png' },
      { id: 'ai-3', name: 'Canva Pro AI', price: 40000, stock: 8, category: 'AI Tools', image: '/images/canva.png' },
    ],
  },
  {
    id: 2,
    title: 'Streaming Premium',
    icon: Tv,
    items: [
      { id: 'stream-1', name: 'Netflix', price: 80000, stock: 12, category: 'Streaming Premium', image: '/images/netflix.png' },
      { id: 'stream-2', name: 'Disney+', price: 75000, stock: 7, category: 'Streaming Premium', image: '/images/disney.png' },
      { id: 'stream-3', name: 'Viu', price: 50000, stock: 20, category: 'Streaming Premium', image: '/images/viu.png' },
    ],
  },
  {
    id: 3,
    title: 'Editing Software',
    icon: Scissors,
    items: [
      { id: 'edit-1', name: 'Adobe Premiere Pro', price: 120000, stock: 4, category: 'Editing Software', image: '/images/premiere.png' },
      { id: 'edit-2', name: 'Photoshop', price: 100000, stock: 6, category: 'Editing Software', image: '/images/photoshop.png' },
    ],
  },
  {
    id: 4,
    title: 'Top Up Mobile Legends',
    icon: Zap,
    items: [
      { id: 'topup-1', name: 'Top Up Diamond', price: 120000, stock: 4, category: 'Top Up Mobile Legends', image: '/images/premiere.png' },
    ],
  },
];

export default function ProductGrid() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCardClick = (item: any) => {
    const queryParams = new URLSearchParams({
      product: item.name,
      price: item.price.toString(),
    });
    router.push(`/checkout?${queryParams}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const allItems = categories.flatMap(cat => cat.items);

  const displayedItems =
    activeCategory === 'Semua'
      ? allItems
      : allItems.filter(item => item.category === activeCategory);

  return (
    <section
      id="products"
      className={`py-16 transition-colors duration-700 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">Kategori Produk</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-500">Pilih produk digital sesuai kategori</p>
        </div>

        {/* Filter Kategori */}
        <div className="flex justify-center mb-8 flex-wrap gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              activeCategory === 'Semua'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveCategory('Semua')}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                activeCategory === cat.title
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setActiveCategory(cat.title)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map(item => (
            <Card
              key={item.id}
              className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden 
                         transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={() => handleCardClick(item)}
            >
              <CardContent className="pt-6 text-center">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain mx-auto mb-4 transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-500">{item.name}</h4>
                <p className="text-gray-500 dark:text-gray-300 text-sm mb-1 transition-colors duration-500">Kategori: {item.category}</p>
                <p
                  className={`text-sm mb-2 font-medium transition-colors duration-500 ${
                    item.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.stock > 0 ? 'Tersedia' : 'Tidak Tersedia'}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">{formatPrice(item.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
