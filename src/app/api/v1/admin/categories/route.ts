import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: { message: 'Missing name or slug.' } }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: { message: 'Category slug must be unique.' } }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Admin category create error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to create category.' } }, { status: 500 });
  }
}
