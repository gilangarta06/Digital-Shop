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

  const handleCardClick = (item: Product) => {
    const firstVariant = item.variants?.[0];
    const variantQuery = firstVariant ? `&variant=${encodeURIComponent(firstVariant.name)}` : '';
    router.push(`/checkout?product=${item._id}${variantQuery}`);
  };

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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Kategori Produk
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Pilih produk digital sesuai kebutuhanmu
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex justify-center mb-10 flex-wrap gap-3">
          <button
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
              activeCategory === 'Semua'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveCategory('Semua')}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedItems.map((item) => {
            const totalStock = item.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <Card
                key={item._id}
                className={`relative rounded-2xl border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 shadow-lg overflow-hidden transform 
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                  ${totalStock === 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => totalStock > 0 && handleCardClick(item)}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  
                  {/* Badge stok */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full 
                      ${totalStock > 0 ? 'bg-yellow-400 text-gray-900' : 'bg-red-500 text-white'}`}
                  >
                    {totalStock > 0 ? `Tersisa ${totalStock}` : 'Habis'}
                  </span>

                  {/* Gambar */}
                  <div className="w-28 h-28 mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* Nama produk */}
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">
                    {item.name}
                  </h4>

                  {/* Kategori */}
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                    {item.category}
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
