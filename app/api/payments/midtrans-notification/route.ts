import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Account from "@/lib/models/Accounts";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: Request) {
  await connectDB();

  try {
    const payload = await req.json();
    console.log("📩 Payload notifikasi diterima:", payload);

    const { order_id, transaction_status, transaction_id } = payload;

    if (!order_id) {
      console.error("❌ order_id tidak ada di payload");
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // cari order
    const order = await Order.findOne({ order_id });
    if (!order) {
      console.error("❌ Order tidak ditemukan:", order_id);
      return NextResponse.json({ success: false });
    }

    console.log(`✅ Order ditemukan: ${order_id}, status lama: ${order.status}`);

    // mapping status
    let newStatus = order.status;
    if (transaction_status === "settlement") newStatus = "paid";
    else if (transaction_status === "pending") newStatus = "pending";
    else if (
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "deny"
    )
      newStatus = "canceled";

    // update order
    order.status = newStatus;
    order.midtrans_transaction_id = transaction_id;
    await order.save();

    console.log(`🔄 Status order diperbarui: ${newStatus}`);

    // kalau sudah bayar → proses pesanan
    if (newStatus === "paid") {
      await processOrderAfterPayment(order);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error handle notifikasi midtrans:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

async function processOrderAfterPayment(order: any) {
  try {
    // 🔹 Kurangi stok pakai product_id + variant_name
    const updateResult = await Product.updateOne(
      { _id: order.product_id, "variants.name": order.variant_name },
      { $inc: { "variants.$.stock": -1 } }
    );

    console.log("📉 Update stok result:", updateResult);

    // 🔹 Cari & tandai akun premium
    const account = await Account.findOneAndUpdate(
      {
        product_id: order.product_id,
        variant_name: order.variant_name,
        is_sold: false,
      },
      {
        $set: {
          is_sold: true,
          sold_at: new Date(),
          order_id: order.order_id,
        },
      },
      { new: true }
    );

    if (!account) {
      console.error("⚠️ Tidak ada akun tersedia untuk pesanan ini.");

      // 📤 Kirim WA fallback ke customer
      const fallbackMessage = `✅ *Pembayaran Diterima*

Halo *${order.customer_name}* 🎉
Pembayaran untuk pesanan Anda sudah *berhasil*.

🛒 *Produk:* ${order.product_name} (${order.variant_name ?? "-"})
💰 *Harga:* Rp${Number(order.gross_amount).toLocaleString("id-ID")}
🆔 *Order ID:* ${order.order_id}

⚠️ Saat ini akun premium *belum tersedia*.
Silakan hubungi *Admin* untuk mendapatkan akun Anda. 🙏

Terima kasih sudah belanja di *DigitalStore*! 🙌`;

      try {
        await sendWhatsApp(order.customer_phone, fallbackMessage);
        console.log("📤 WA fallback berhasil dikirim");
      } catch (waErr) {
        console.error("⚠️ Gagal kirim WA fallback:", waErr);
      }

      return; // stop di sini
    }

    console.log("✅ Akun premium dialokasikan:", account.username);

    // 🔹 Kirim WhatsApp konfirmasi normal
    const message = buildWhatsAppMessage(order, account);
    try {
      await sendWhatsApp(order.customer_phone, message);
      console.log("📤 WA konfirmasi berhasil dikirim");
    } catch (waErr) {
      console.error("⚠️ Gagal kirim WA:", waErr);
    }
  } catch (err) {
    console.error("❌ Gagal memproses pesanan:", err);
  }
}

function buildWhatsAppMessage(order: any, account: any) {
  const formattedAmount = order.gross_amount
    ? Number(order.gross_amount).toLocaleString("id-ID")
    : "N/A";

  return `✅ *Pembayaran Diterima*

Halo *${order.customer_name}* 🎉
Pembayaran untuk pesanan Anda sudah *berhasil*.

🛒 *Produk:* ${order.product_name} (${order.variant_name ?? "-"})
💰 *Harga:* Rp${formattedAmount}
🆔 *Order ID:* ${order.order_id}

🔑 *Akun Premium Anda*
👤 Username: ${account.username}
🔒 Password: ${account.password}

Selamat menikmati layanan premium 🚀
Terima kasih sudah belanja di *DigitalStore*! 🙌`;
}
