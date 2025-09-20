'use client';

import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <footer className={`py-12 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className={`text-2xl font-bold transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            DigitalStore
          </h3>
          <p className="mt-4 text-sm leading-relaxed transition-colors duration-500">
            Solusi digital lengkap untuk semua kebutuhan Anda. 
            Produk berkualitas, harga terjangkau, layanan terbaik.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Produk</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Layanan
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Streaming</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Design Tools</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Software</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Paket Premium</a></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Ikuti Kami
          </h4>
          <div className="flex space-x-4">
            {[FaFacebook, FaInstagram, FaTwitter, FaWhatsapp].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-12 border-t transition-colors duration-500 pt-6 text-center text-sm ${
        theme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-600'
      }`}>
        © {new Date().getFullYear()} DigitalStore. All rights reserved.
      </div>
    </footer>
  );
}
