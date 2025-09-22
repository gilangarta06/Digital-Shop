import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await dbConnect();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 🔹 Hitung total revenue dari semua order "paid"
    const revenueAgg = await Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$gross_amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 🔹 Pesanan hari ini
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // 🔹 Produk out of stock (stok 0 di salah satu varian)
    const outOfStock = await Product.countDocuments({
      "variants.stock": { $lte: 0 },
    });

    return Response.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      todayOrders,
      outOfStock,
    });
  } catch (error) {
    console.error("❌ Error in /api/admin/stats:", error);
    return Response.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
