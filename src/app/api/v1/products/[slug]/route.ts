import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          orderBy: { name: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: 'Product could not be found.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Fetch product details error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch product details.',
        },
      },
      { status: 500 }
    );
  }
}
