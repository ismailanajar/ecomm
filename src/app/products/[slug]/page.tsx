import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductInteractiveDetails from '@/components/ProductInteractiveDetails';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Dynamic SEO Metadata for every product details page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      select: { name: true, description: true },
    }),
    getSettings(),
  ]);

  if (!product) {
    return {
      title: `Product Not Found | ${settings.siteTitle}`,
    };
  }

  return {
    title: `${product.name} | ${settings.siteTitle}`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  // Fetch product info directly on the server
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: {
        select: { name: true },
      },
      variants: {
        orderBy: { name: 'asc' },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Serialize Prisma decimal fields to string to prevent Next.js boundary serialization errors
  const serializedProduct = {
    ...product,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : null,
    variants: product.variants.map((v) => ({
      ...v,
      priceDelta: v.priceDelta.toString(),
    })),
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <ProductInteractiveDetails product={serializedProduct} />
      </main>
      <Footer />
    </div>
  );
}
