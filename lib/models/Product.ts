import mongoose, { Schema, models } from 'mongoose';

const VariantSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    variants: [VariantSchema],
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model('Product', ProductSchema);

export default Product;
