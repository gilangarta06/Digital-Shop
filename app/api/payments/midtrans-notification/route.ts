import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Account from "@/lib/models/Accounts";
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
    console.log("📩 Payload notifikasi diterima:", notification);

    // 🔹 Verifikasi status ke Midtrans
    const statusResponse = await core.transaction.notification(notification);
    console.log("📥 Status Response Midtrans:", statusResponse);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // 🔹 Cari order di database
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      console.warn("⚠️ Order tidak ditemukan di database:", orderId);
      return NextResponse.json(
        { message: "Order not found but acknowledged" },
        { status: 200 }
      );
    }

    console.log(`✅ Order ditemukan: ${orderId}, status lama: ${order.status}`);

    // 🔹 Update status order
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
    console.log(`🔄 Status order diperbarui: ${order.status}`);

    // ✅ Jika sudah dibayar, kurangi stok dan kirim akun premium
    if (order.status === "paid") {
      try {
        // 🔹 Ambil akun premium dulu sebelum kurangi stok
        const account = await Account.findOne({
          product_id: order.product_id,
          variant_name: order.variant_name,
          is_sold: false,
        });

        if (!account) {
          console.error("⚠️ Tidak ada akun tersedia untuk pesanan ini.");
        } else {
          console.log("✅ Akun premium ditemukan:", account.username);

          // 🔹 Kurangi stok produk
          await Product.updateOne(
            { name: order.product_name, "variants.name": order.variant_name },
            { $inc: { "variants.$.stock": -1 } }
          );
          console.log("📉 Stok produk dikurangi 1");

          // 🔹 Tandai akun sebagai terjual
          account.is_sold = true;
          await account.save();

          const message = `✅ *Pembayaran Diterima*

Halo *${order.customer_name}* 🎉
Pembayaran untuk pesanan Anda sudah *berhasil*.

🛒 *Produk:* ${order.product_name} (${order.variant_name ?? "-"})
💰 *Harga:* Rp${order.gross_amount.toLocaleString("id-ID")}
🆔 *Order ID:* ${order.order_id}

Berikut akun premium Anda:
👤 *Username:* ${account.username}
🔑 *Password:* ${account.password}

Selamat menikmati layanan premium 🚀
Terima kasih sudah belanja di *DigitalStore*! 🙌`;

          console.log("📤 Mengirim WA ke:", order.customer_phone);
          try {
            await sendWhatsApp(order.customer_phone, message);
            console.log("✅ WA konfirmasi berhasil dikirim");
          } catch (waError) {
            console.error("⚠️ Gagal kirim WA konfirmasi:", waError);
          }
        }
      } catch (stockError) {
        console.error("⚠️ Gagal memproses stok / akun:", stockError);
      }
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error Midtrans Notification:", error);
    return NextResponse.json(
      { message: "Webhook error but acknowledged" },
      { status: 200 }
    );
  }
}
