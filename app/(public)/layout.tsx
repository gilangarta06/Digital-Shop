"use client";

import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { ThemeProvider } from "next-themes";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme_public" // ⬅️ Public simpan theme sendiri
    >
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
