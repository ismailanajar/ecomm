"use client";

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: any;
  compareAtPrice: any;
  images: any;
  brand: string | null;
  category?: {
    name: string;
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const { currency } = useAuth();
  // Parse images JSON safely
  let imagesList: string[] = [];
  try {
    if (typeof product.images === 'string') {
      imagesList = JSON.parse(product.images);
    } else if (Array.isArray(product.images)) {
      imagesList = product.images;
    }
  } catch (e) {
    console.error('Failed to parse images for product:', product.name);
  }

  const mainImage = imagesList[0] || '';

  const priceNum = parseFloat(String(product.price));
  const compareNum = product.compareAtPrice ? parseFloat(String(product.compareAtPrice)) : null;

  // Calculate discount percentage
  const discountPercent = compareNum && compareNum > priceNum
    ? Math.round(((compareNum - priceNum) / compareNum) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-md p-4 flex flex-col justify-between border border-zinc-200 shadow-sm hover:shadow-md transition-shadow h-full">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-[#fafafa] mb-4 flex items-center justify-center rounded overflow-hidden">
        {discountPercent && (
          <span className="absolute top-2 left-2 z-10 bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
            {discountPercent}% off
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/ffffff/000000?text=' + encodeURIComponent(product.name);
            }}
          />
        </Link>
      </div>

      {/* Card Info Section */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-[#0f1111] hover:text-[#007185] text-sm font-medium leading-snug line-clamp-3 mb-1">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Brand name */}
        {product.brand && (
          <span className="text-[11px] text-zinc-500 mb-1.5">
            by <strong className="text-zinc-650">{product.brand}</strong>
          </span>
        )}

        {/* Rating Layout (Amazon Yellow Stars) */}
        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex items-center text-[#ffa41c]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">
            182
          </span>
        </div>

        {/* Pricing Box */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-[#b12704]">
            {formatPrice(priceNum, currency)}
          </span>
          {compareNum && compareNum > priceNum && (
            <span className="text-xs text-zinc-500 line-through">
              List: {formatPrice(compareNum, currency)}
            </span>
          )}
        </div>
      </div>

      {/* Buy Button Shortcut */}
      <div className="mt-auto pt-2 border-t border-zinc-100">
        <Link
          href={`/products/${product.slug}`}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] hover:border-[#f5b700] rounded-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm outline-none"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> See details
        </Link>
      </div>

    </div>
  );
}
