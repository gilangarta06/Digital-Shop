'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Bot, Tv, Scissors } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'AI Tools',
    icon: Bot,
    items: [
      { 
        id: 'ai-1', 
        name: 'ChatGPT Plus', 
        price: 50000, 
        stock: 10, 
        category: 'AI',
        image: '/images/chatgpt.png' 
      },
      { 
        id: 'ai-2', 
        name: 'MidJourney', 
        price: 70000, 
        stock: 5, 
        category: 'AI',
        image: '/images/midjourney.png'
      },
      { 
        id: 'ai-3', 
        name: 'Canva Pro AI', 
        price: 40000, 
        stock: 8, 
        category: 'AI',
        image: '/images/canva.png'
      },
    ],
  },
  {
    id: 2,
    title: 'Streaming Premium',
    icon: Tv,
    items: [
      { 
        id: 'stream-1', 
        name: 'Netflix', 
        price: 80000, 
        stock: 12, 
        category: 'Streaming',
        image: '/images/netflix.png'
      },
      { 
        id: 'stream-2', 
        name: 'Disney+', 
        price: 75000, 
        stock: 7, 
        category: 'Streaming',
        image: '/images/disney.png'
      },
      { 
        id: 'stream-3', 
        name: 'Viu', 
        price: 50000, 
        stock: 20, 
        category: 'Streaming',
        image: '/images/viu.png'
      },
    ],
  },
  {
    id: 3,
    title: 'Editing Software',
    icon: Scissors,
    items: [
      { 
        id: 'edit-1', 
        name: 'Adobe Premiere Pro', 
        price: 120000, 
        stock: 4, 
        category: 'Editing',
        image: '/images/premiere.png'
      },
      { 
        id: 'edit-2', 
        name: 'Photoshop', 
        price: 100000, 
        stock: 6, 
        category: 'Editing',
        image: '/images/photoshop.png'
      },
    ],
  },
];

export default function ProductGrid() {
  const router = useRouter();

  const handleBuyNow = (item: any) => {
    const queryParams = new URLSearchParams({
      product: item.name,
      price: item.price.toString()
    });
    router.push(`/checkout?${queryParams}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategori Produk</h2>
          <p className="text-xl text-gray-600">Pilih produk digital sesuai kategori</p>
        </div>

        {categories.map((cat) => (
          <div key={cat.id} className="mb-12">
            <div className="flex items-center mb-6">
              <cat.icon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">{cat.title}</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-contain mx-auto mb-4"
                    />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-gray-600 mb-1">Kategori: {item.category}</p>
                    <p className="text-gray-600 mb-1">Stok: {item.stock}</p>
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      {formatPrice(item.price)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleBuyNow(item)}
                    >
                      Beli Sekarang
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
