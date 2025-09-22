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
      className={`relative pt-16 pb-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300"
          : "bg-gradient-to-b from-gray-50 to-white text-gray-700"
      }`}
    >
      {/* Gradient Divider */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3
            className={`text-2xl font-extrabold tracking-wide ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            DigitalStore
          </h3>
          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Solusi digital lengkap untuk semua kebutuhan Anda. Produk berkualitas, harga terjangkau, layanan terbaik.
          </p>
          <p className="mt-3 text-xs italic text-blue-500 dark:text-blue-400">
            #BelanjaDigitalLebihMudah
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
              {[
                { href: "/", label: "Beranda" },
                { href: "/produk", label: "Produk" },
                { href: "/tentang", label: "Tentang Kami" },
                { href: "/kontak", label: "Kontak" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="relative inline-block hover:text-blue-600 transition-colors duration-300
                               after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 
                               after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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
              {[
                { href: "/layanan/streaming", label: "Streaming" },
                { href: "/layanan/design", label: "Design Tools" },
                { href: "/layanan/software", label: "Software" },
                { href: "/layanan/premium", label: "Paket Premium" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="relative inline-block hover:text-blue-600 transition-colors duration-300
                               after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 
                               after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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
            {[FaFacebook, FaInstagram, FaTwitter, FaWhatsapp].map((Icon, idx) => (
              <Link
                key={idx}
                href="#"
                className="p-3 rounded-full transition-all duration-500 transform hover:scale-110 
                           bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-xl"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
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
        © {new Date().getFullYear()} <span className="font-semibold">DigitalStore</span>. All rights reserved.
      </div>
    </footer>
  );
}
