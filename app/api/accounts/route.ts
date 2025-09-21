import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Account from "@/lib/models/Accounts";

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find({}).populate("product_id");
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil akun" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const account = await Account.create(body);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal tambah akun" }, { status: 500 });
  }
}
