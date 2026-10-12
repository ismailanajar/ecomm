import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { name, slug, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: { message: 'Missing name or slug.' } }, { status: 400 });
    }

    const existing = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    if (existing) {
      return NextResponse.json({ error: { message: 'Category slug must be unique.' } }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Admin category update error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to update category.' } }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    // Check if category contains active products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: { message: 'Cannot delete category containing products. Reassign the products first.' } },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    console.error('Admin category delete error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to delete category.' } }, { status: 500 });
  }
}
