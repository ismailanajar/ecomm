import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

// GET: Fetch saved addresses for the authenticated user
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

    const addresses = await prisma.address.findMany({
      where: { userId: payload.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json({ error: { message: 'Failed to retrieve addresses.' } }, { status: 500 });
  }
}

// POST: Add a new address for the authenticated user
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
    const { line1, line2, city, state, postalCode, country, isDefault } = body;

    if (!line1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: { message: 'Required fields are missing.' } }, { status: 400 });
    }

    // Set other addresses to non-default if this new one is default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: payload.id },
        data: { isDefault: false },
      });
    }

    // If it is the user's first address, force it to be default
    const count = await prisma.address.count({ where: { userId: payload.id } });
    const makeDefault = count === 0 ? true : !!isDefault;

    const address = await prisma.address.create({
      data: {
        userId: payload.id,
        line1,
        line2: line2 || null,
        city,
        state,
        postalCode,
        country,
        isDefault: makeDefault,
      }
    });

    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    console.error('Add address error:', error);
    return NextResponse.json({ error: { message: 'Failed to save address.' } }, { status: 500 });
  }
}
