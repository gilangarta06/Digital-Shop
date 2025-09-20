'use client';

import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <footer
      className={`py-12 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-300"
          : "bg-gray-50 text-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3
            className={`text-2xl font-bold transition-colors duration-500 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            DigitalStore
          </h3>
          <p className="mt-4 text-sm leading-relaxed">
            Solusi digital lengkap untuk semua kebutuhan Anda. Produk
            berkualitas, harga terjangkau, layanan terbaik.
          </p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/produk"
                  className="hover:text-blue-600 transition-colors"
                >
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-blue-600 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="hover:text-blue-600 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Layanan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/layanan/streaming"
                  className="hover:text-blue-600 transition-colors"
                >
                  Streaming
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/design"
                  className="hover:text-blue-600 transition-colors"
                >
                  Design Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/software"
                  className="hover:text-blue-600 transition-colors"
                >
                  Software
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/premium"
                  className="hover:text-blue-600 transition-colors"
                >
                  Paket Premium
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Ikuti Kami
          </h4>
          <div className="flex md:justify-start justify-center space-x-4">
            {[FaFacebook, FaInstagram, FaTwitter, FaWhatsapp].map(
              (Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  />
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className={`mt-12 border-t pt-6 text-center text-sm ${
          theme === "dark"
            ? "border-gray-800 text-gray-500"
            : "border-gray-300 text-gray-600"
        }`}
      >
        © {new Date().getFullYear()} DigitalStore. All rights reserved.
      </div>
    </footer>
  );
}
