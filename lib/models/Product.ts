import mongoose, { Schema, Document, Model } from "mongoose";

interface Variant {
  name: string;
  price: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  category: string;
  image: string;
  description?: string;
  variants: Variant[];
}

// ✅ Tambahkan tipe <IProduct> supaya TS tidak infer terlalu dalam
const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    variants: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Pastikan model tidak di-redeclare (untuk Next.js hot reload)
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
