import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/provider/ThemeProvider"; // ⬅️ arahkan ke file yg barusan dibuat

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigitalStore - Solusi Digital Lengkap",
  description:
    "Dapatkan lisensi AI, Streaming, Editing, dan Layanan Digital instan dengan pembayaran aman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
