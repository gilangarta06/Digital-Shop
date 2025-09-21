import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET() {
  await dbConnect();

  try {
    // Grouping berdasarkan bulan
    const monthlyReports = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$created_at" },
          totalSales: { $sum: "$gross_amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    // Total keseluruhan
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$gross_amount" } } },
    ]);

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      monthlyReports,
    });
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
