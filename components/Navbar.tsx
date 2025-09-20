'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav
      className={`fixed top-0 w-full backdrop-blur-md border-b z-50 transition-all duration-700 ease-in-out shadow-xl
        ${theme === 'dark'
          ? 'bg-gradient-to-r from-[#4A4A4A]/95 to-[#2E2E2E]/95'
          : 'bg-gradient-to-r from-[#FFFFFF]/95 via-[#CCDDE0]/80 to-[#EAF1F5]/95'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-blue-600 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-12" />
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
              DigitalStore
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-500" />
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="transition-transform duration-500 hover:rotate-12 hover:scale-110 focus:outline-none"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
              </Button>
            )}

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-500 shadow-md hover:shadow-xl transform hover:scale-105"
              size="sm"
            >
              Daftar Sekarang
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden transition-transform duration-500 hover:rotate-90"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out transform ${
            isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-5'
          } overflow-hidden`}
        >
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-500" />
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-500"
              />
            </div>

            {/* Theme toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs px-3 py-1 transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {theme === 'dark' ? 'Terang' : 'Gelap'}
              </Button>
            </div>

            {/* Mobile Daftar */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-all duration-500 shadow-md hover:shadow-xl transform hover:scale-105"
              size="sm"
            >
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
