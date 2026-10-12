import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import { getSettings } from '@/lib/settings';
import { formatPrice } from '@/lib/currency';
import { Prisma } from '@generated/client';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Truck,
  ShieldCheck,
  RefreshCw,
  HeartHandshake,
  Laptop,
  Shirt,
  UtensilsCrossed,
  ArrowRight,
  X
} from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('electronics') || s.includes('phone') || s.includes('tech')) {
    return <Laptop className="w-5 h-5 text-indigo-500" />;
  }
  if (s.includes('clothing') || s.includes('apparel') || s.includes('fashion')) {
    return <Shirt className="w-5 h-5 text-rose-500" />;
  }
  if (s.includes('kitchen') || s.includes('home') || s.includes('cook')) {
    return <UtensilsCrossed className="w-5 h-5 text-amber-500" />;
  }
  return <Sparkles className="w-5 h-5 text-emerald-500" />;
};

export default async function HomePage({ searchParams }: PageProps) {
  const settings = await getSettings();
  const currency = settings.currencyCode || 'USD';
  const resolvedParams = await searchParams;

  // Extract query parameters
  const search = resolvedParams.search || '';
  const categorySlug = resolvedParams.category || '';
  const minPrice = parseFloat(resolvedParams.minPrice || '0');
  const maxPrice = parseFloat(resolvedParams.maxPrice || '999999');
  const sort = resolvedParams.sort || 'newest';
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = 8;
  const skip = (page - 1) * limit;

  // Build Prisma where filter
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  // Build Prisma orderBy sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  // Fetch categories, products, and counts concurrently on the server
  const [categories, products, totalProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  // Serialize Prisma decimal fields
  const serializedProducts = products.map((prod) => ({
    ...prod,
    price: prod.price.toString(),
    compareAtPrice: prod.compareAtPrice ? prod.compareAtPrice.toString() : null,
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString(),
  }));

  // Helper to build URL strings preserved with existing filters
  const buildFilterUrl = (paramsToUpdate: Record<string, string | number | null>) => {
    const nextParams = new URLSearchParams();
    if (search) nextParams.set('search', search);
    if (categorySlug) nextParams.set('category', categorySlug);
    if (minPrice > 0) nextParams.set('minPrice', minPrice.toString());
    if (maxPrice < 999999) nextParams.set('maxPrice', maxPrice.toString());
    if (sort !== 'newest') nextParams.set('sort', sort);
    if (page > 1) nextParams.set('page', page.toString());

    Object.entries(paramsToUpdate).forEach(([key, val]) => {
      if (val === null) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val.toString());
      }
    });

    if (!paramsToUpdate.hasOwnProperty('page')) {
      nextParams.delete('page');
    }

    const query = nextParams.toString();
    return query ? `/?${query}` : '/';
  };

  // Find active category name
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#1c1917] flex flex-col font-sans antialiased">
      <Header />

      <HeroSlider bannersJson={settings.heroBanners} />

      {/* Trust Grid Cards */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Free Shipping</h4>
              <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">On orders above {formatPrice(50, currency)}</p>
            </div>
          </div>
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Secure Payments</h4>
              <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">Standard 256-bit encryption</p>
            </div>
          </div>
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Easy Returns</h4>
              <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">Hassle-free 10-day guarantee</p>
            </div>
          </div>
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">24/7 Support</h4>
              <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">Dedicated client assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full space-y-8">
        
        {/* Curated Categories Carousel / Pill list */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Browse Curated Departments</h2>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 select-none no-scrollbar">
            <Link
              href={buildFilterUrl({ category: null })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all shrink-0 ${
                !categorySlug
                  ? 'bg-zinc-900 border-zinc-950 text-white shadow-md'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-500'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>All Departments</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildFilterUrl({ category: cat.slug })}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all shrink-0 ${
                  categorySlug === cat.slug
                    ? 'bg-zinc-900 border-zinc-950 text-white shadow-md'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-500'
                }`}
              >
                {getCategoryIcon(cat.slug)}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Filter Pills */}
        {(search || categorySlug || minPrice > 0 || maxPrice < 999999) && (
          <div className="flex flex-wrap items-center gap-2 bg-zinc-50 border border-zinc-205 p-3 rounded-2xl text-xs font-medium text-zinc-600">
            <span className="font-bold text-zinc-805 mr-1">Active Filters:</span>
            {search && (
              <Link
                href={buildFilterUrl({ search: null })}
                className="inline-flex items-center gap-1 bg-white border border-zinc-300 rounded-full pl-3 pr-2 py-1 hover:border-zinc-500 transition-colors"
              >
                <span>Query: &quot;{search}&quot;</span>
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            )}
            {categorySlug && activeCategory && (
              <Link
                href={buildFilterUrl({ category: null })}
                className="inline-flex items-center gap-1 bg-white border border-zinc-300 rounded-full pl-3 pr-2 py-1 hover:border-zinc-500 transition-colors"
              >
                <span>Department: {activeCategory.name}</span>
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            )}
            {(minPrice > 0 || maxPrice < 999999) && (
              <Link
                href={buildFilterUrl({ minPrice: null, maxPrice: null })}
                className="inline-flex items-center gap-1 bg-white border border-zinc-300 rounded-full pl-3 pr-2 py-1 hover:border-zinc-500 transition-colors"
              >
                <span>
                  Price: {minPrice > 0 ? formatPrice(minPrice, currency) : 'Any'} -{' '}
                  {maxPrice < 999999 ? formatPrice(maxPrice, currency) : 'Any'}
                </span>
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            )}
            <Link
              href="/"
              className="text-amber-600 hover:text-amber-700 font-bold ml-auto pl-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset All
            </Link>
          </div>
        )}

        {/* Content Layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 items-start">
          
          {/* Catalog Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block space-y-6 border border-zinc-200 bg-white p-6 rounded-2xl shadow-sm shrink-0">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-black" /> Refine Catalog
              </h2>
              {(search || categorySlug || minPrice > 0 || maxPrice < 999999) && (
                <Link href="/" className="text-[11px] text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Link>
              )}
            </div>

            {/* Department (Fallback link lists) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Department</h3>
              <div className="flex flex-col gap-2 text-xs text-[#007185]">
                <Link
                  href={buildFilterUrl({ category: null })}
                  className={`hover:text-[#c45500] hover:underline flex items-center gap-1.5 ${
                    !categorySlug ? 'font-black text-[#c45500] pointer-events-none' : ''
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> All Departments
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildFilterUrl({ category: cat.slug })}
                    className={`hover:text-[#c45500] hover:underline flex items-center gap-1.5 ${
                      categorySlug === cat.slug ? 'font-black text-[#c45500] pointer-events-none' : ''
                    }`}
                  >
                    {getCategoryIcon(cat.slug)}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="space-y-2 border-t border-zinc-150 pt-4">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Customer Price</h3>
              <div className="flex flex-col gap-2.5 text-xs text-[#007185]">
                <Link
                  href={buildFilterUrl({ minPrice: null, maxPrice: null })}
                  className={`hover:text-[#c45500] hover:underline ${
                    minPrice === 0 && maxPrice === 999999 ? 'font-black text-[#c45500] pointer-events-none' : ''
                  }`}
                >
                  Any Price
                </Link>
                <Link
                  href={buildFilterUrl({ minPrice: 0, maxPrice: 150 })}
                  className={`hover:text-[#c45500] hover:underline ${
                    minPrice === 0 && maxPrice === 150 ? 'font-black text-[#c45500] pointer-events-none' : ''
                  }`}
                >
                  Under {formatPrice(150, currency)}
                </Link>
                <Link
                  href={buildFilterUrl({ minPrice: 150, maxPrice: 500 })}
                  className={`hover:text-[#c45500] hover:underline ${
                    minPrice === 150 && maxPrice === 500 ? 'font-black text-[#c45500] pointer-events-none' : ''
                  }`}
                >
                  {formatPrice(150, currency)} - {formatPrice(500, currency)}
                </Link>
                <Link
                  href={buildFilterUrl({ minPrice: 500, maxPrice: null })}
                  className={`hover:text-[#c45500] hover:underline ${
                    minPrice === 500 && maxPrice === 999999 ? 'font-black text-[#c45500] pointer-events-none' : ''
                  }`}
                >
                  Over {formatPrice(500, currency)}
                </Link>
              </div>
            </div>
          </aside>

          {/* Products Grid & Sorting (Main) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Sorting controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-200 bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Showing {serializedProducts.length} of <strong className="text-zinc-900">{totalProducts}</strong> Items
              </span>

              {/* Sorting Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" /> Sort By
                </span>
                <Link
                  href={buildFilterUrl({ sort: 'newest' })}
                  className={`text-[11px] px-3.5 py-2 border font-bold transition-all rounded-full ${
                    sort === 'newest'
                      ? 'bg-zinc-900 border-zinc-950 text-white shadow-sm'
                      : 'bg-white border-zinc-250 text-zinc-650 hover:text-black hover:border-black'
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={buildFilterUrl({ sort: 'price_asc' })}
                  className={`text-[11px] px-3.5 py-2 border font-bold transition-all rounded-full ${
                    sort === 'price_asc'
                      ? 'bg-zinc-900 border-zinc-950 text-white shadow-sm'
                      : 'bg-white border-zinc-250 text-zinc-650 hover:text-black hover:border-black'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={buildFilterUrl({ sort: 'price_desc' })}
                  className={`text-[11px] px-3.5 py-2 border font-bold transition-all rounded-full ${
                    sort === 'price_desc'
                      ? 'bg-zinc-900 border-zinc-950 text-white shadow-sm'
                      : 'bg-white border-zinc-250 text-zinc-650 hover:text-black hover:border-black'
                  }`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>

            {/* Grid */}
            {serializedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {serializedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border border-zinc-200 bg-white rounded-2xl py-24 px-4 text-center shadow-sm">
                <SlidersHorizontal className="w-10 h-10 text-zinc-300 mb-4" />
                <h3 className="text-base font-bold text-black mb-2">No matching products</h3>
                <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                  We couldn&apos;t find any products matching your active filters. Try adjusting categories or price selections.
                </p>
                <Link
                  href="/"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full px-6 py-2.5 text-xs uppercase tracking-wider mt-6 transition-all"
                >
                  Reset all filters
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-zinc-200">
                <Link
                  href={page > 1 ? buildFilterUrl({ page: page - 1 }) : '#'}
                  className={`p-2 border border-zinc-300 bg-white text-zinc-650 hover:bg-zinc-50 rounded-xl transition-all ${
                    page <= 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <span className="text-xs font-bold text-[#8f8e8c] uppercase tracking-widest">
                  Page <strong className="text-black">{page}</strong> of {totalPages}
                </span>
                <Link
                  href={page < totalPages ? buildFilterUrl({ page: page + 1 }) : '#'}
                  className={`p-2 border border-zinc-300 bg-white text-zinc-650 hover:bg-zinc-50 rounded-xl transition-all ${
                    page >= totalPages ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
