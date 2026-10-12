import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

// PUT: Set address as default
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify address ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== payload.id) {
      return NextResponse.json({ error: { message: 'Address not found.' } }, { status: 404 });
    }

    // Set all other addresses for this user to isDefault: false
    await prisma.address.updateMany({
      where: { userId: payload.id },
      data: { isDefault: false },
    });

    // Make this address default
    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error: any) {
    console.error('Update address default status error:', error);
    return NextResponse.json({ error: { message: 'Failed to update default address status.' } }, { status: 500 });
  }
}

// DELETE: Delete saved address
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify address ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== payload.id) {
      return NextResponse.json({ error: { message: 'Address not found.' } }, { status: 404 });
    }

    const wasDefault = address.isDefault;

    // Delete the address
    await prisma.address.delete({ where: { id } });

    // If we deleted the default address and there are remaining addresses, set the newest one as default
    if (wasDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId: payload.id },
        orderBy: { createdAt: 'desc' },
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Address deleted successfully.' });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json({ error: { message: 'Failed to delete address.' } }, { status: 500 });
  }
}
