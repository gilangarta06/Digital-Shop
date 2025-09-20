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

// ✅ beri tipe Schema<IProduct> agar TS tidak infer otomatis
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

// ✅ gunakan as Model<IProduct> agar TS tidak infer union type yang terlalu kompleks
const Product = (mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema)) as Model<IProduct>;

export default Product;
