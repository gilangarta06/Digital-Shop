import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  order_id: string;
  gross_amount: number;
  status: string;
  snap_token: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_id: mongoose.Types.ObjectId;   // 👈 tambahin ini
  product_name: string;
  variant_name: string;                  // 👈 tambahin ini
  midtrans_transaction_id?: string;
  created_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  order_id: { type: String, required: true, unique: true },
  gross_amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  snap_token: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String },
  customer_phone: { type: String },
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // 👈
  product_name: { type: String, required: true },                              // 👈
  variant_name: { type: String, required: true },                              // 👈
  midtrans_transaction_id: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
