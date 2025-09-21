import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.find().sort({ created_at: -1 }); // ambil semua order terbaru
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("❌ Error fetch orders:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
