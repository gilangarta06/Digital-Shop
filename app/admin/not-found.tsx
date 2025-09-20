'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Halaman yang kamu cari di dashboard tidak tersedia atau sudah dihapus.
      </p>
      <Button
        onClick={() => router.push('/dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
      >
        Kembali ke Dashboard
      </Button>
    </div>
  );
}
