"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
      <Card className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300">
        ❌ Gagal memuat data orders
      </Card>
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

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono text-xs">{order.order_id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-gray-500 text-xs">{order.customer_email}</div>
                </TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell className="font-semibold">
                  Rp {Number(order.gross_amount).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => updateStatus(order._id, value)}
                  >
                    <SelectTrigger
                      className={`h-8 w-[110px] text-xs font-medium ${statusColors[order.status] || ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                    onClick={() => resendAccount(order._id)}
                  >
                    Kirim Ulang Akun
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {!data?.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Belum ada order.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
