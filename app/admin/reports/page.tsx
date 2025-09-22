"use client";

import useSWR from "swr";
import { Loader2, ShoppingBag, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReportsPage() {
  const { data, error, isLoading } = useSWR("/api/admin/reports", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading laporan...
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Gagal memuat laporan</p>;
  }

  // Format bulan (1 → Januari, dst.)
  const monthNames = [
    "", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  const chartData = data.monthlyReports.map((item: any) => ({
    month: monthNames[item._id],
    sales: item.totalSales,
    orders: item.count,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Laporan Penjualan
      </h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition rounded-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Pemesanan</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalOrders}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition rounded-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Pendapatan</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Rp {data.totalRevenue.toLocaleString("id-ID")}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik */}
      <Card className="shadow-md hover:shadow-lg transition rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Penjualan Bulanan
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis dataKey="month" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" name="Pendapatan" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="orders" stroke="#16a34a" name="Pemesanan" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
