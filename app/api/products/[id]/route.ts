import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ GET produk berdasarkan ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ Error GET /api/products/[id]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE produk berdasarkan ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: body.name,
          category: body.category,
          image: body.image,
          description: body.description,
          available: body.available,
          variants: body.variants, // ✅ overwrite varian array
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Error PUT /api/products/[id]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE produk berdasarkan ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error DELETE /api/products/[id]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
