'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Footer from '@/components/public/Footer';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    order_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    product_id: '',
    product_name: '',
    variant_name: '',
    gross_amount: 0,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // ✅ Ambil produk dari API sesuai query param
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        setProducts(data);

        const productId = searchParams.get('product');
        const variantName = searchParams.get('variant');

        // ✅ Cari produk sesuai ID
        const selectedProduct = data.find((p: any) => p._id === productId);

        if (!selectedProduct) {
          setNotFound(true);
          return;
        }

        // ✅ Cari varian, kalau tidak ada pakai varian pertama
        const selectedVariant =
          selectedProduct.variants.find((v: any) => v.name === variantName) ||
          selectedProduct.variants[0];

        setActiveProduct(selectedProduct);

        setFormData((prev) => ({
          ...prev,
          order_id: 'INV-' + Date.now(),
          product_id: selectedProduct._id,
          product_name: selectedProduct.name,
          variant_name: selectedVariant?.name || '',
          gross_amount: selectedVariant?.price || 0,
        }));
      } catch (err) {
        console.error('❌ Gagal load produk:', err);
        setNotFound(true);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.snap_token) {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute(
          'data-client-key',
          process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
        );
        document.head.appendChild(script);

        script.onload = () => {
          (window as any).snap.pay(result.snap_token, {
            onSuccess: () => {
              alert('Pembayaran berhasil!');
              router.push('/');
            },
            onPending: () => alert('Menunggu pembayaran...'),
            onError: () => alert('Pembayaran gagal!'),
          });
        };
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error);
    }

    setIsLoading(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  // ✅ Jika produk tidak ditemukan
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-bold text-red-600">Produk tidak ditemukan</h2>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  if (!activeProduct) return <div>Loading...</div>;

  return (
    <div
      className={`min-h-screen py-12 transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gray-900'
          : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        {/* Step indicator */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold">
              1
            </span>
            <span className="font-medium">Isi Data</span>
            <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
              2
            </span>
            <span className="font-medium">Pembayaran</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <Card className="lg:col-span-2 shadow-md rounded-2xl border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Data Pemesan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Nama Lengkap</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Nomor WhatsApp</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      placeholder="62812345678"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Ringkasan Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gambar Produk */}
              <div className="w-full h-40 relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Pilihan Varian */}
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Pilih Varian
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProduct.variants.map((variant: any) => {
                    const isOutOfStock = variant.stock <= 0;
                    return (
                      <button
                        key={variant.name}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() =>
                          !isOutOfStock &&
                          setFormData((prev) => ({
                            ...prev,
                            product_id: activeProduct._id,
                            product_name: activeProduct.name,
                            variant_name: variant.name,
                            gross_amount: variant.price,
                          }))
                        }
                        className={`p-3 rounded-xl border text-sm font-medium transition text-left ${
                          isOutOfStock
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                            : formData.variant_name === variant.name
                            ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        <div>{variant.name}</div>
                        <div className="text-xs">
                          {formatPrice(variant.price)}{' '}
                          {isOutOfStock && '(Stok habis)'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deskripsi Produk */}
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Detail
                </p>
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  {activeProduct.description}
                </p>
              </div>

              {/* Order ID */}
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Order ID
                </p>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {formData.order_id}
                </p>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-blue-600">
                  {formatPrice(formData.gross_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
