import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// GET: Fetch all orders for the admin console (secured by middleware)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    const whereClause: any = {};
    if (statusFilter && Object.values(OrderStatus).includes(statusFilter as OrderStatus)) {
      whereClause.status = statusFilter as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Admin fetch orders error:', error);
    return NextResponse.json({ error: { message: 'Failed to retrieve orders.' } }, { status: 500 });
  }
}

// PUT: Update an order's status (secured by middleware)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: { message: 'Order ID and status are required.' } }, { status: 400 });
    }

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      return NextResponse.json({ error: { message: 'Invalid order status value.' } }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Admin update order error:', error);
    return NextResponse.json({ error: { message: 'Failed to update order status.' } }, { status: 500 });
  }
}
