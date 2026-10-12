import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: { message: 'Failed to fetch products.' } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
      variants, // array
    } = body;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: { message: 'Missing required fields.' } }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: { message: 'Product slug must be unique.' } }, { status: 400 });
    }

    const product = await prisma.$transaction(async (tx) => {
      return tx.product.create({
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
          variants: {
            createMany: {
              data: (variants || []).map((v: any) => ({
                name: v.name,
                sku: v.sku,
                priceDelta: Number(v.priceDelta) || 0.00,
                stock: Number(v.stock) || 0,
              })),
            },
          },
        },
        include: {
          variants: true,
        },
      });
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Admin product create error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to create product.' } }, { status: 500 });
  }
}
