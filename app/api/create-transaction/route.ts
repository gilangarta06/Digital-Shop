import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendWhatsApp } from "@/lib/whatsapp";

const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      order_id,
      customer_name,
      customer_email,
      customer_phone,
      product_name,
      gross_amount,
    } = body;

    if (!order_id || !customer_name || !customer_phone || !product_name) {
      return NextResponse.json(
        { success: false, message: "Data pesanan tidak lengkap" },
        { status: 400 }
      );
    }

    const amount = Number(gross_amount);
    if (isNaN(amount)) {
      return NextResponse.json(
        { success: false, message: "Nominal tidak valid" },
        { status: 400 }
      );
    }

    // 🔹 Buat transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: amount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: customer_name,
        email: customer_email,
        phone: customer_phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snap_token = transaction.token;
    const redirect_url = transaction.redirect_url;

    // 🔹 Simpan order di database
    const order = new Order({
      order_id,
      gross_amount: amount,
      status: "pending",
      snap_token,
      redirect_url,
      customer_name,
      customer_email,
      customer_phone,
      product_name,
    });

    await order.save();

    // 🔹 Kirim WhatsApp (tidak hentikan proses jika gagal)
    const message = `📢 *Konfirmasi Pesanan*
    
Halo *${customer_name}* 👋

Terima kasih sudah order di *DigitalStore* 🎉

🛒 *Produk:* ${product_name}
💰 *Harga:* Rp${amount.toLocaleString("id-ID")}
🆔 *Order ID:* ${order_id}

🔗 *Bayar di sini:*  
${redirect_url}

Kami akan kirim update otomatis setelah pembayaran berhasil ✅`;

    try {
      await sendWhatsApp(customer_phone, message);
    } catch (whatsappError) {
      console.error("⚠️ Gagal kirim WA:", whatsappError);
    }

    return NextResponse.json({
      success: true,
      snap_token,
      redirect_url,
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat membuat transaksi" },
      { status: 500 }
    );
  }
}
