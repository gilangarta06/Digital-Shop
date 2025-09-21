import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Account from "@/lib/models/Accounts";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order tidak ditemukan" }, { status: 404 });
    }

    const account = await Account.findOne({
      is_sold: true,
      product_id: order.product_id,
    });

    if (!account) {
      return NextResponse.json({ success: false, message: "Akun tidak ditemukan" }, { status: 404 });
    }

    const message = `📤 *Kirim Ulang Akun*

Halo *${order.customer_name}* 👋
Berikut akun premium Anda:

👤 *Username:* ${account.username}
🔑 *Password:* ${account.password}`;

    await sendWhatsApp(order.customer_phone, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Gagal kirim ulang akun:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
