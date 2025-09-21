'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Key } from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Pemesanan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Akun Premium", href: "/admin/accounts", icon: Key },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-md transition
                ${isActive 
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
