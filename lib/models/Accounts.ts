import mongoose, { Document, Model } from "mongoose";

// Definisikan tipe Account
export interface IAccount extends Document {
  product_id: mongoose.Types.ObjectId;
  variant_name: string;
  username: string;
  password: string;
  is_sold?: boolean;
}

const AccountSchema = new mongoose.Schema<IAccount>({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_sold: { type: Boolean, default: false },
});

// Gunakan Model<IAccount> supaya type aman
const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
