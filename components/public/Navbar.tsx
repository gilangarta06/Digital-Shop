'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav
      className={`
        fixed top-0 w-full backdrop-blur-xl border-b z-50 transition-all duration-300 ease-in-out
        bg-white/70 dark:bg-gray-900/70 shadow-md
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {mounted && (
              <img
                src="/images/logo.png"
                alt="GA Store"
                className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-110"
              />
            )}
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8 max-w-lg">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <Input
                type="text"
                placeholder="Cari produk terbaik..."
                className="pl-10 pr-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-700 
                  bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:rotate-12 hover:scale-110 focus:outline-none"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark'
                  ? <Sun className="h-5 w-5 text-yellow-400" />
                  : <Moon className="h-5 w-5 text-gray-700" />}
              </Button>
            )}

            {/* CTA */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                text-white font-medium px-6 py-2 rounded-2xl transition-all duration-300
                shadow-md hover:shadow-xl transform hover:-translate-y-1"
              size="sm"
            >
              Daftar Sekarang
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden transition-transform duration-300 hover:rotate-90"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mounted && (
          <div
            className={`md:hidden transition-all duration-300 ease-in-out transform ${
              isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-3'
            } overflow-hidden`}
          >
            <div className="flex flex-col space-y-4 py-4 border-t border-gray-200 dark:border-gray-700">

              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  className="pl-10 pr-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-700
                    bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
              </div>

              {/* Theme toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-xs px-3 py-1 rounded-xl transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {theme === 'dark' ? 'Terang' : 'Gelap'}
                </Button>
              </div>

              {/* CTA Mobile */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                  text-white font-medium py-2 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
                size="sm"
              >
                Daftar Sekarang
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
