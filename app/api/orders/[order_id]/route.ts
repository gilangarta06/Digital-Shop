import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest, { params }: { params: { order_id: string } }) {
  try {
    await dbConnect();

    const order = await Order.findOne({ order_id: params.order_id });
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        order_id: order.order_id,
        gross_amount: order.gross_amount,
        status: order.status,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        product_name: order.product_name,
        created_at: order.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
  }
}