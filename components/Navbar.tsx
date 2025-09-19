'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DigitalStore</span>
          </div>
          
          <div className="flex-1 mx-8 hidden md:flex">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
