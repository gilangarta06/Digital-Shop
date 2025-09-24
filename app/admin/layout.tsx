"use client";

import Sidebar from "@/components/admin/sidebar";
import { ThemeProvider } from "next-themes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme_admin"
    >
      <div className="flex">
        <Sidebar /> {/* ⬅️ Pastikan Sidebar tetap dipanggil */}
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
