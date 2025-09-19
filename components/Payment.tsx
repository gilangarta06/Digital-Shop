'use client';

import Image from 'next/image';

const banks = [
  { id: 'bca', name: 'BCA', src: '/banks/bca.png' },
  { id: 'bni', name: 'BNI', src: '/banks/bni.png' },
  { id: 'bri', name: 'BRI', src: '/banks/bri.png' },
  { id: 'mandiri', name: 'Mandiri', src: '/banks/mandiri.png' },
  { id: 'ovo', name: 'OVO', src: '/banks/ovo.png' },
  { id: 'gopay', name: 'GoPay', src: '/banks/gopay.png' },
  { id: 'dana', name: 'DANA', src: '/banks/dana.png' },
  { id: 'shopeepay', name: 'ShopeePay', src: '/banks/shopeepay.png' },
];

export default function PaymentMethods() {
  return (
    <section id="payment-methods" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Bayar makin mudah</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Pembayaran tersedia</h3>
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
                className="flex flex-col items-center justify-center w-28 h-20 bg-gray-50 rounded-lg shadow-sm"
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
                <span className="text-xs text-gray-500 mt-1">{bank.name}</span>
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

        /* disable animation on hover for accessibility */
        #payment-methods .will-change-transform:hover {
          animation-play-state: paused !important;
        }

        /* smaller screens: slower / shorter animation */
        @media (max-width: 640px) {
          .will-change-transform {
            animation-duration: 24s !important;
          }
        }
      `}</style>
    </section>
  );
}
