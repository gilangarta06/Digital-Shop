'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackagePlus, Receipt, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tambah Produk', href: '/admin/products', icon: PackagePlus },
  { name: 'Lihat Transaksi', href: '/admin/transactions', icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Admin Panel
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-2 flex-1">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon size={20} />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => alert('Logout clicked!')} // ganti dengan logic logout
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
