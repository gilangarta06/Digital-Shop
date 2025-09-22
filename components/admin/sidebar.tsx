'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Key, LogOut } from "lucide-react";

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
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col transition-colors duration-500">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">⚡ Admin Panel</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Kelola semua data dengan mudah</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-300 
                ${
                  isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-800/70 dark:text-green-200 border-l-4 border-green-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? "text-green-600 dark:text-green-300" : "text-gray-500 dark:text-gray-400"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
