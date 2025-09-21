import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await dbConnect();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    return Response.json({
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    console.error("❌ Error in /api/admin/stats:", error);
    return Response.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
