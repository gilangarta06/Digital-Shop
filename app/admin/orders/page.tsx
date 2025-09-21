"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersPage() {
  const { data, error, isLoading } = useSWR("/api/admin/orders", fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Gagal memuat data orders</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Data Pemesanan</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order: any) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2">{order.order_id}</td>
                <td className="px-4 py-2">
                  {order.customer_name} <br />
                  <span className="text-gray-500 text-xs">
                    {order.customer_email}
                  </span>
                </td>
                <td className="px-4 py-2">{order.product_name}</td>
                <td className="px-4 py-2">
                  Rp {order.gross_amount.toLocaleString()}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
