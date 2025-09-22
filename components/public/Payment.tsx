'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const banks = [
  { id: 'bca', name: 'BCA', src: '/banks/bca.png' },
  { id: 'bni', name: 'BNI', src: '/banks/bni.png' },
  { id: 'mandiri', name: 'Mandiri', src: '/banks/mandiri.png' },
]

export default function PaymentMethods() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      id="payment-methods"
      className={`py-12 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-blue-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Bayar makin mudah</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
            Pembayaran tersedia
          </h3>
        </div>

        {/* Marquee / Auto scroll */}
        <div className="overflow-hidden">
          <div
            className="flex items-center gap-6 will-change-transform"
            style={{ animation: 'marquee 18s linear infinite' }}
          >
            {[...banks, ...banks].map((bank, i) => (
              <div
                key={`${bank.id}-${i}`}
                className="flex flex-col items-center justify-center w-28 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative w-16 h-10">
                  <Image
                    src={bank.src}
                    alt={bank.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 40px, 64px"
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* pause animation on hover */
        #payment-methods .will-change-transform:hover {
          animation-play-state: paused !important;
        }

        @media (max-width: 640px) {
          .will-change-transform {
            animation-duration: 24s !important;
          }
        }
      `}</style>
    </section>
  );
}
