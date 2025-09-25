import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export const dynamic = "force-dynamic"; // biar ga cache

export async function GET(
  req: Request,
  { params }: { params: { order_id: string } }
) {
  try {
    await dbConnect();

    const { order_id } = params;

    const order = await Order.findOne({ order_id });
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.order_id,
      status: order.status,
      product: order.product_name,
      variant: order.variant_name,
      customer: order.customer_name,
      phone: order.customer_phone,
      amount: order.gross_amount,
      midtrans_transaction_id: order.midtrans_transaction_id ?? null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (err) {
    console.error("🔥 Error cek transaksi:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
