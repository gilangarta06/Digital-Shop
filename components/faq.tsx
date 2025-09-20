'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

const faqs = [
  {
    question: "Apa itu produk digital premium?",
    answer: "Produk digital premium adalah layanan atau software digital yang dapat diakses langsung secara instan setelah pembayaran, seperti AI tools, streaming premium, dan software editing."
  },
  {
    question: "Bagaimana cara membeli produk?",
    answer: "Klik pada kartu produk yang diinginkan, kemudian Anda akan diarahkan ke halaman checkout untuk menyelesaikan pembayaran."
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Kami mendukung berbagai metode pembayaran, termasuk transfer bank, e-wallet, dan integrasi Midtrans untuk transaksi lebih mudah dan aman."
  },
  {
    question: "Apakah stok produk terbatas?",
    answer: "Ya, setiap produk memiliki jumlah stok tertentu yang bisa dilihat pada kartu produk. Pastikan membeli sebelum stok habis."
  },
  {
    question: "Apakah produk bisa digunakan langsung setelah pembayaran?",
    answer: "Ya, setelah pembayaran berhasil, Anda akan mendapatkan akses instan ke produk digital yang dibeli."
  },
];

export default function FAQPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-16 min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Judul */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-snug transition-colors duration-500">
            F.A.Q <br /> Paling Sering <br /> Ditanyakan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-500">
            Temukan jawaban atas pertanyaan yang paling umum terkait produk digital kami.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Pertanyaan */}
              <button
                className="w-full flex justify-between items-center p-5 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => toggleIndex(index)}
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-6 w-6 text-gray-500 dark:text-gray-300 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`px-5 overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-500">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
