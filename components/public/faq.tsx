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
      className={`py-20 transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gray-900'
          : 'bg-gradient-to-b from-white via-blue-50 to-white'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Judul */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-snug">
            F.A.Q
            <br />
            Paling Sering
            <br />
            Ditanyakan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Temukan jawaban atas pertanyaan yang paling umum terkait produk digital kami.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl ${
                openIndex === index ? 'border border-blue-400/60 shadow-lg' : 'border border-transparent'
              }`}
            >
              {/* Pertanyaan */}
              <button
                className="w-full flex justify-between items-center p-5 focus:outline-none transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => toggleIndex(index)}
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-6 w-6 transform transition-all duration-500 ${
                    openIndex === index
                      ? 'rotate-180 text-blue-500'
                      : 'text-gray-500 dark:text-gray-300'
                  }`}
                />
              </button>

              {/* Jawaban */}
              <div
                className={`px-5 overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                }`}
              >
                <p
                  className={`text-gray-600 dark:text-gray-300 transition-opacity duration-500 ${
                    openIndex === index ? 'animate-fadeInUp' : ''
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>
    </section>
  );
}
