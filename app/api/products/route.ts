import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

// ✅ Supaya tidak error NEXT_STATIC_GEN_BAILOUT
export const dynamic = "force-dynamic";

// ✅ Debug log awal
console.log("🚀 /api/products route.ts kebaca Next.js");

// ========================
// GET semua produk
// ========================
export async function GET() {
  console.log("📥 GET /api/products terpanggil");
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (err) {
    console.error("❌ Error GET /api/products:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ========================
// POST produk baru
// ========================
export async function POST(req: Request) {
  console.log("📥 POST /api/products terpanggil");
  try {
    await dbConnect();
    const body = await req.json();

    console.log("📦 Data dari client:", body);

    // Pastikan struktur data sesuai schema Product
    const newProduct = await Product.create({
      name: body.name,
      category: body.category,
      description: body.description,
      image: body.image,
      available: body.available ?? true, // default true
      variants: body.variants || [], // ✅ simpan varian
    });

    console.log("✅ Produk berhasil dibuat:", newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("❌ Error POST /api/products:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
