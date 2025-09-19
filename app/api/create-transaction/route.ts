import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendWhatsApp } from '@/lib/whatsapp';

const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { order_id, customer_name, customer_email, customer_phone, product_name, gross_amount } = body;

    // Create Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: customer_name,
        email: customer_email,
        phone: customer_phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snap_token = transaction.token;

    // Save order to database
    const order = new Order({
      order_id,
      gross_amount,
      status: 'pending',
      snap_token,
      customer_name,
      customer_email,
      customer_phone,
      product_name
    });

    await order.save();

    // Send WhatsApp notification
    const message = `Halo ${customer_name},

Terima kasih sudah order di DigitalStore 🎉

Produk: ${product_name}
Harga: Rp${gross_amount.toLocaleString('id-ID')}
Order ID: ${order_id}

Silakan lanjutkan pembayaran di link berikut:
${process.env.NEXT_PUBLIC_BASE_URL}/checkout

Kami akan konfirmasi otomatis setelah pembayaran berhasil ✅`;

    try {
      await sendWhatsApp(customer_phone, message);
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
      // Continue without failing the transaction
    }

    return NextResponse.json({
      success: true,
      snap_token,
      message: 'Transaction created successfully'
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating transaction'
    }, { status: 500 });
  }
}