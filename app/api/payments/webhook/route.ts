import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendWhatsApp } from '@/lib/whatsapp';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { order_id, transaction_status, transaction_id, signature_key } = body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto
      .createHash('sha512')
      .update(order_id + transaction_status + transaction_id + serverKey)
      .digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    // Find order
    const order = await Order.findOne({ order_id });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update order status
    let status = 'pending';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      status = 'success';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      status = 'failed';
    }

    order.status = status;
    order.midtrans_transaction_id = transaction_id;
    await order.save();

    // Send WhatsApp notification for successful payment
    if (status === 'success') {
      const message = `Pembayaran Anda sudah kami terima 🎉

Order ID: ${order_id}
Produk: ${order.product_name}
Status: BERHASIL ✅

Berikut detail akses produk Anda:
Silakan hubungi CS kami untuk mendapatkan link download/kode akses.

Terima kasih sudah berbelanja di GA Store 🙏`;

      try {
        await sendWhatsApp(order.customer_phone, message);
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}