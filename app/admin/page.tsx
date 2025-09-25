"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

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
      <p className="text-center text-muted-foreground">Loading...</p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={<Package className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          title="Total Pesanan"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Pesanan Hari Ini"
          value={stats.todayOrders}
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
        />
        <StatCard
          title="Total User"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-pink-600" />}
        />
        <StatCard
          title="Produk Habis Stok"
          value={stats.outOfStock}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 rounded-md bg-muted">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
