'use client';

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReportsPage() {
  const { data, error, isLoading } = useSWR("/api/admin/reports", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading laporan...
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Gagal memuat laporan</p>;
  }

  // Format bulan (1 → Januari, 2 → Februari, dst.)
  const monthNames = [
    "", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const chartData = data.monthlyReports.map((item: any) => ({
    month: monthNames[item._id],
    sales: item.totalSales,
    orders: item.count,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Laporan Penjualan</h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg p-4">
          <CardContent>
            <p className="text-gray-500">Total Pemesanan</p>
            <h2 className="text-2xl font-bold">{data.totalOrders}</h2>
          </CardContent>
        </Card>
        <Card className="shadow-lg p-4">
          <CardContent>
            <p className="text-gray-500">Total Pendapatan</p>
            <h2 className="text-2xl font-bold">
              Rp {data.totalRevenue.toLocaleString("id-ID")}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Grafik */}
      <Card className="shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Penjualan Bulanan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" name="Pendapatan" />
            <Line type="monotone" dataKey="orders" stroke="#16a34a" name="Pemesanan" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
