import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_sold: { type: Boolean, default: false },
});

// Pisahkan assignment supaya TypeScript tidak error
let Account;

if (mongoose.models.Account) {
  Account = mongoose.models.Account;
} else {
  Account = mongoose.model("Account", AccountSchema);
}

export default Account;
