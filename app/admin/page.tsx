'use client';

import { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, Users, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    totalUsers: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    fetchStats();

    // auto refresh tiap 10 detik
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Produk"
          value={stats.totalProducts}
          icon={<Package className="w-6 h-6 text-green-600" />}
        />
        <Card
          title="Total Pesanan"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        />
        <Card
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
        />
        <Card
          title="Pesanan Hari Ini"
          value={stats.todayOrders}
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
        />
        <Card
          title="Total User"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-pink-600" />}
        />
        <Card
          title="Produk Habis Stok"
          value={stats.outOfStock}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition">
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
      </div>
    </div>
  );
}
