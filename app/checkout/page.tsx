'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    order_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    product_name: '',
    gross_amount: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate order ID
    const orderId = 'INV-' + Date.now();
    const product = searchParams.get('product') || '';
    const price = parseInt(searchParams.get('price') || '0');
    
    setFormData({
      ...formData,
      order_id: orderId,
      product_name: product,
      gross_amount: price
    });
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.snap_token) {
        // Load Midtrans Snap
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
        document.head.appendChild(script);

        script.onload = () => {
          (window as any).snap.pay(result.snap_token, {
            onSuccess: function(result: any) {
              alert('Pembayaran berhasil!');
              router.push('/');
            },
            onPending: function(result: any) {
              alert('Menunggu pembayaran...');
            },
            onError: function(result: any) {
              alert('Pembayaran gagal!');
            }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Lengkapi data Anda untuk melanjutkan pembayaran</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pemesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="order_id">Order ID</Label>
                <Input
                  id="order_id"
                  name="order_id"
                  value={formData.order_id}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="customer_name">Nama Lengkap</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
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
                />
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
                />
              </div>

              <div>
                <Label htmlFor="product_name">Produk</Label>
                <Input
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="gross_amount">Total Harga</Label>
                <Input
                  id="gross_amount"
                  value={formatPrice(formData.gross_amount)}
                  readOnly
                  className="bg-gray-100 font-semibold"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </form>
          </CardContent>
        </Card>
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