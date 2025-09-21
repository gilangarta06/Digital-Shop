import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { sendWhatsApp } from "@/lib/whatsapp";

const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// helper: escape regex untuk cari produk/varian
function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("📥 Checkout body diterima backend:", body);

    let {
      customer_name,
      customer_email,
      customer_phone,
      product_id,
      product_name,
      variant_name,
    } = body;

    // 🚨 Debug khusus
    console.log("🔎 Data parsing:");
    console.log(" - customer_name:", customer_name);
    console.log(" - customer_phone:", customer_phone);
    console.log(" - customer_email:", customer_email);
    console.log(" - product_id:", product_id);
    console.log(" - product_name:", product_name);
    console.log(" - variant_name:", variant_name);

    if (!customer_name || !customer_phone) {
      return NextResponse.json(
        { success: false, message: "Nama & no HP wajib diisi" },
        { status: 400 }
      );
    }

    // 🔍 Cari produk
    let product = null;

    if (product_id) {
      product = await Product.findById(product_id);
    }

    // kalau product_id gak ada, coba cari berdasarkan nama
    if (!product && product_name) {
      const normalized = product_name.trim();

      // cocokkan ke nama produk
      product = await Product.findOne({
        name: { $regex: `^${escapeRegex(normalized)}$`, $options: "i" },
      });

      // kalau gagal, cocokkan ke nama varian
      if (!product) {
        product = await Product.findOne({
          "variants.name": { $regex: `^${escapeRegex(normalized)}$`, $options: "i" },
        });
        if (product) {
          console.log("ℹ️ product_name cocok dengan varian:", normalized);
          variant_name = normalized; // fallback → treat product_name sebagai varian
        }
      }
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // 🔍 Cari varian
    let variant = null;
    if (variant_name) {
      variant = product.variants.find(
        (v: any) =>
          v.name.toLowerCase() === variant_name.toLowerCase()
      );
    }

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Varian tidak ditemukan" },
        { status: 404 }
      );
    }

    const amount = variant.price;
    const order_id = `INV-${Date.now()}`;

    // 🔹 Buat transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: amount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: customer_name,
        email: customer_email,
        phone: customer_phone,
      },
      item_details: [
        {
          id: product._id.toString(),
          price: amount,
          quantity: 1,
          name: `${product.name} - ${variant.name}`,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    const snap_token = transaction.token;
    const redirect_url = transaction.redirect_url;

    // 🔹 Simpan order ke DB
    const order = new Order({
      order_id,
      gross_amount: amount,
      status: "pending",
      snap_token,
      customer_name,
      customer_email,
      customer_phone,
      product_id: product._id,
      product_name: product.name,
      variant_name: variant.name,
    });

    await order.save();
    console.log("✅ Order tersimpan full:", order.toObject());

    // 🔹 Kirim WA konfirmasi
    const message = `📢 *Konfirmasi Pesanan*
    
Halo *${customer_name}* 👋

Terima kasih sudah order di *DigitalStore* 🎉

🛒 *Produk:* ${product.name} - ${variant.name}
💰 *Harga:* Rp${amount.toLocaleString("id-ID")}
🆔 *Order ID:* ${order_id}

🔗 *Bayar di sini:*  
${redirect_url}

Kami akan kirim akun otomatis setelah pembayaran berhasil ✅`;

    try {
      await sendWhatsApp(customer_phone, message);
    } catch (err) {
      console.error("⚠️ Gagal kirim WA:", err);
    }

    return NextResponse.json({
      success: true,
      snap_token,
      redirect_url,
      order,
    });
  } catch (error) {
    console.error("❌ Error checkout:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan checkout" },
      { status: 500 }
    );
  }
}
