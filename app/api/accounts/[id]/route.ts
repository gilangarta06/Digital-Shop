import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Account from "@/lib/models/Accounts";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Account.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update akun" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Account.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Akun dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus akun" }, { status: 500 });
  }
}
