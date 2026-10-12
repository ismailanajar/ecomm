import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { name: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: { message: 'Product not found.' } }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Admin product fetch by ID error:', error);
    return NextResponse.json({ error: { message: 'Failed to fetch product.' } }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      stock,
      categoryId,
      brand,
      isActive,
      images, // array
      variants, // array of { id?, name, sku, priceDelta, stock }
    } = body;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: { message: 'Missing required fields.' } }, { status: 400 });
    }

    // Check slug uniqueness (excluding current product)
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    if (existing) {
      return NextResponse.json({ error: { message: 'Product slug must be unique.' } }, { status: 400 });
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Update core product details
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description: description || '',
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          stock: Number(stock) || 0,
          categoryId,
          brand: brand || null,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          images: JSON.stringify(images || []),
        },
      });

      // 2. Intelligently update variants
      const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
      const existingIds = existingVariants.map((v) => v.id);
      const incomingVariants = variants || [];
      const keepIds = incomingVariants.filter((v: any) => v.id).map((v: any) => v.id);

      // Delete old variants not present in update list
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
          id: { notIn: keepIds },
        },
      });

      // Update existing or create new ones
      for (const v of incomingVariants) {
        if (v.id && existingIds.includes(v.id)) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              name: v.name,
              sku: v.sku,
              priceDelta: Number(v.priceDelta) || 0.00,
              stock: Number(v.stock) || 0,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              name: v.name,
              sku: v.sku,
              priceDelta: Number(v.priceDelta) || 0.00,
              stock: Number(v.stock) || 0,
            },
          });
        }
      }

      return updatedProduct;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Admin product update error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to update product.' } }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    // Delete product (cascade will handle variants, reviews, cartItems; orders reference will set product_id to null)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    console.error('Admin product delete error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to delete product.' } }, { status: 500 });
  }
}
