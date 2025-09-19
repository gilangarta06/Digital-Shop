import mongoose from 'mongoose';

export interface IOrder extends mongoose.Document {
  order_id: string;
  gross_amount: number;
  status: string;
  snap_token?: string;
  midtrans_transaction_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  created_at: Date;
}

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  gross_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  snap_token: {
    type: String
  },
  midtrans_transaction_id: {
    type: String
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_email: {
    type: String,
    required: true
  },
  customer_phone: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);