import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

// GET: Fetch order history for the authenticated user
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ error: { message: 'Access token is missing.' } }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Session is invalid or expired.' } }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: payload.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                brand: true,
              }
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: { message: 'Failed to retrieve order history.' } }, { status: 500 });
  }
}

// POST: Create a new order (Checkout submission)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ error: { message: 'Access token is missing.' } }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Session is invalid or expired.' } }, { status: 401 });
    }

    const body = await req.json();
    const { items, addressId, paymentMethod, subtotal, tax, shipping, total } = body;

    if (!items || items.length === 0 || !addressId || !paymentMethod) {
      return NextResponse.json({ error: { message: 'Missing order details or shipping address.' } }, { status: 400 });
    }

    // Resolve shipping address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== payload.id) {
      return NextResponse.json({ error: { message: 'Shipping address not found.' } }, { status: 404 });
    }

    // Build the unique intent containing a snapshot of the address details
    const stripePaymentIntentId = JSON.stringify({
      orderUuid: crypto.randomUUID(),
      paymentMethod,
      shippingAddress: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      }
    });

    // Run order placements inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order record
      const newOrder = await tx.order.create({
        data: {
          userId: payload.id,
          subtotal: Number(subtotal),
          tax: Number(tax),
          shipping: Number(shipping),
          total: Number(total),
          status: 'PENDING',
          stripePaymentIntentId,
        }
      });

      // 2. Iterate and create OrderItems while updating stock
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} no longer exists.`);
        }

        let nameSnapshot = product.name;
        
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId }
          });
          if (!variant) {
            throw new Error(`Variant for product ${product.name} not found.`);
          }
          nameSnapshot += ` (${variant.name})`;

          // Stock Check
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} - ${variant.name}.`);
          }

          // Decrement variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        } else {
          // Stock Check
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}.`);
          }

          // Decrement product base stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }

        // Create OrderItem
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId || null,
            nameSnapshot,
            priceSnapshot: Number(item.price),
            quantity: item.quantity,
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Create order API error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to place order.' } }, { status: 500 });
  }
}
