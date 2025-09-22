"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/orders", fetcher);

  const resendAccount = async (id: string) => {
    const res = await fetch(`/api/admin/orders/${id}/resend`, { method: "POST" });
    if (res.ok) {
      alert("✅ Akun berhasil dikirim ulang!");
    } else {
      alert("❌ Gagal kirim ulang akun!");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        Memuat data orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded">
        ❌ Gagal memuat data orders
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    canceled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Pemesanan</h1>

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order: any, idx: number) => (
              <tr
                key={order._id}
                className={`${
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs">{order.order_id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-gray-500 text-xs">{order.customer_email}</div>
                </td>
                <td className="px-4 py-3">{order.product_name}</td>
                <td className="px-4 py-3 font-semibold">
                  Rp {Number(order.gross_amount).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || ""}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => resendAccount(order._id)}
                  >
                    Kirim Ulang Akun
                  </button>
                </td>
              </tr>
            ))}

            {!data?.length && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Belum ada order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
