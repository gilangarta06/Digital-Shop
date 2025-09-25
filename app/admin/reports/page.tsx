"use client";

import useSWR from "swr";
import { Loader2, ShoppingBag, DollarSign } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReportsPage() {
  const { data, error, isLoading } = useSWR("/api/admin/reports", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading laporan...
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Gagal memuat laporan</p>;
  }

  // Format bulan
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
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
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">
                Total Pemesanan
              </CardTitle>
              <div className="text-2xl font-bold">{data.totalOrders}</div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">
                Total Pendapatan
              </CardTitle>
              <div className="text-2xl font-bold">
                Rp {data.totalRevenue.toLocaleString("id-ID")}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Grafik */}
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>Penjualan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-300 dark:stroke-gray-600"
              />
              <XAxis dataKey="month" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  borderRadius: "0.5rem",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                name="Pendapatan"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#16a34a"
                name="Pemesanan"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
