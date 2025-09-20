'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface Variant {
  name: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  description?: string;
  variants: Variant[];
}

export default function ProductGrid() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);

    // ✅ Ambil data produk dari API
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Gagal load produk:', err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Klik kartu produk → arahkan ke /checkout?product=xxx&variant=xxx
  const handleCardClick = (item: Product) => {
    const firstVariant = item.variants?.[0];
    const variantQuery = firstVariant ? `&variant=${encodeURIComponent(firstVariant.name)}` : '';
    router.push(`/checkout?product=${item._id}${variantQuery}`);
  };

  // Ambil kategori unik dari produk
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const displayedItems =
    activeCategory === 'Semua'
      ? products
      : products.filter((item) => item.category === activeCategory);

  if (!mounted) return null;

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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Kategori Produk
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-500">
            Pilih produk digital sesuai kategori
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex justify-center mb-8 flex-wrap gap-3">
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
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            // hitung stok total dari semua varian
            const totalStock = item.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <Card
                key={item._id}
                className={`relative rounded-xl border border-gray-200 dark:border-gray-700 
                           shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl 
                           ${totalStock === 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => totalStock > 0 && handleCardClick(item)}
              >
                <CardContent className="p-6 text-center">
                  {/* Gambar */}
                  <div className="overflow-hidden rounded-lg mb-4 flex justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-contain transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* Nama produk */}
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h4>

                  {/* Kategori */}
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">
                    Kategori: {item.category}
                  </p>

                  {/* Info stok */}
                  <p
                    className={`font-semibold text-sm ${
                      totalStock > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {totalStock > 0 ? `Tersisa ${totalStock}` : 'Stock Habis'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
