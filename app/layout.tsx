import './globals.css';
import type { Metadata } from 'next/metadata';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DigitalStore - Solusi Digital Lengkap',
  description: 'Dapatkan lisensi AI, Streaming, Editing, dan Layanan Digital instan dengan pembayaran aman.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}