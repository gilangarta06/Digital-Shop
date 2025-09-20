import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendWhatsApp } from "@/lib/whatsapp";

const midtransClient = require("midtrans-client");

const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const notification = await req.json();

    // 🔹 Verifikasi ke Midtrans
    const statusResponse = await core.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log("📥 Notifikasi Midtrans:", statusResponse);

    // 🔹 Cari order di database
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      console.error("❌ Order tidak ditemukan:", orderId);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 🔹 Update status order sesuai status dari Midtrans
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      order.status = "paid";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      order.status = "failed";
    } else if (transactionStatus === "pending") {
      order.status = "pending";
    }

    await order.save();

    // 🔹 Kirim WA hanya jika pembayaran sukses
    if (order.status === "paid") {
      const message = `✅ *Pembayaran Diterima*

Halo *${order.customer_name}* 🎉
Pembayaran untuk pesanan Anda sudah *berhasil*.

🛒 *Produk:* ${order.product_name}
💰 *Harga:* Rp${order.gross_amount.toLocaleString("id-ID")}
🆔 *Order ID:* ${order.order_id}

Pesanan Anda sedang diproses 🚀
Terima kasih sudah belanja di *DigitalStore*! 🙌`;

      try {
        await sendWhatsApp(order.customer_phone, message);
      } catch (waError) {
        console.error("⚠️ Gagal kirim WA konfirmasi:", waError);
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("❌ Error Midtrans Notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
