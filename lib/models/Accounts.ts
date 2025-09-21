import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant_name: { type: String, required: true }, // <-- ini wajib ada
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_sold: { type: Boolean, default: false },
});

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
