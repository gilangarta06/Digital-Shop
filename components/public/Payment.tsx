'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const banks = [
  { id: 'bca', name: 'BCA', src: '/banks/bca.png' },
  { id: 'bni', name: 'BNI', src: '/banks/bni.png' },
  { id: 'mandiri', name: 'Mandiri', src: '/banks/mandiri.png' },
  { id: 'gopay', name: 'GoPay', src: '/banks/gopay.png' },
  { id: 'ovo', name: 'OVO', src: '/banks/ovo.png' },
  { id: 'dana', name: 'DANA', src: '/banks/dana.png' },
  { id: 'shopeepay', name: 'ShopeePay', src: '/banks/shopeepay.png' },
];

export default function PaymentMethods() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      id="payment-methods"
      className={`py-20 relative transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gray-900'
          : 'bg-gradient-to-b from-white via-blue-50 to-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">Bayar makin mudah</p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Metode Pembayaran
          </h3>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden relative">
          {/* gradient fade kiri-kanan */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-gray-900 pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-gray-900 pointer-events-none z-10" />

          <div
            className="flex items-center gap-8 will-change-transform"
            style={{ animation: 'marquee 20s linear infinite' }}
          >
            {[...banks, ...banks].map((bank, i) => (
              <div
                key={`${bank.id}-${i}`}
                className="group flex flex-col items-center justify-center w-32 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500"
                style={{ animation: `fadeUp 0.6s ease ${i * 0.05}s both` }}
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
                <span className="text-xs text-gray-600 dark:text-gray-300 mt-2">{bank.name}</span>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 pointer-events-none" />
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

        #payment-methods .will-change-transform:hover {
          animation-play-state: paused !important;
        }

        @media (max-width: 640px) {
          .will-change-transform {
            animation-duration: 28s !important;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
