"use client";

import React, { useState } from 'react';
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/currency';

interface Variant {
  id: string;
  name: string;
  sku: string;
  priceDelta: any;
  stock: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: any;
  user: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  compareAtPrice: any;
  images: any;
  brand: string | null;
  stock: number;
  category: {
    name: string;
  };
  variants: Variant[];
  reviews: Review[];
}

export default function ProductInteractiveDetails({ product }: { product: Product }) {
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
    console.error('Failed to parse images');
  }

  const [activeImage, setActiveImage] = useState(imagesList[0] || 'https://placehold.co/600x600/ffffff/000000?text=' + encodeURIComponent(product.name));
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Pricing calculations
  const basePrice = parseFloat(String(product.price));
  const variantPriceDelta = selectedVariant ? parseFloat(String(selectedVariant.priceDelta)) : 0;
  const unitPrice = basePrice + variantPriceDelta;

  const compareBase = product.compareAtPrice ? parseFloat(String(product.compareAtPrice)) : null;
  const comparePrice = compareBase ? compareBase + variantPriceDelta : null;

  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = activeStock <= 0;

  const handleIncreaseQty = () => {
    if (quantity < activeStock) setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    try {
      const cartData = localStorage.getItem('tanimstore_cart');
      let cart = cartData ? JSON.parse(cartData) : [];

      const cartItem = {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name,
        slug: product.slug,
        image: activeImage,
        price: unitPrice,
        quantity,
        variantName: selectedVariant?.name || null,
        sku: selectedVariant?.sku || product.id.substring(0, 8).toUpperCase(),
        maxStock: activeStock,
      };

      const existingIndex = cart.findIndex(
        (item: any) => item.productId === cartItem.productId && item.variantId === cartItem.variantId
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity = Math.min(
          cart[existingIndex].quantity + quantity,
          activeStock
        );
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('tanimstore_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (e) {
      console.error('Failed to add to cart:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1 text-[#007185] hover:text-[#c45500] hover:underline text-xs font-bold mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to results
      </Link>

      {/* Main product card (white background box like Amazon) */}
      <div className="bg-white border border-zinc-200 rounded p-6 shadow-sm">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded overflow-hidden bg-white border border-zinc-200 relative flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/ffffff/000000?text=' + encodeURIComponent(product.name);
                }}
              />
            </div>

            {/* Thumbnails grid */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded overflow-hidden bg-white border transition-all ${
                      activeImage === img ? 'border-[#e47911] ring-1 ring-[#e47911]' : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Panel */}
          <div className="mt-8 lg:mt-0 flex flex-col space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="text-[#007185] hover:underline cursor-pointer">{product.category.name}</span>
                {product.brand && (
                  <>
                    <span className="text-zinc-300">/</span>
                    <span className="text-[#007185] hover:underline cursor-pointer font-bold">Brand: {product.brand}</span>
                  </>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#0f1111] tracking-tight leading-snug">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 border-y border-zinc-150 py-2.5 text-xs">
              <div className="flex items-center text-[#ffa41c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[#007185] hover:underline cursor-pointer font-bold">5.0</span>
              <span className="text-zinc-300">|</span>
              <span className="text-[#007185] hover:underline cursor-pointer">{product.reviews.length} ratings</span>
            </div>

            {/* Pricing Box */}
            <div className="flex items-baseline gap-2 pb-2">
              <span className="text-zinc-500 text-xs">Price:</span>
              <span className="text-2xl font-bold text-[#b12704]">{formatPrice(unitPrice, currency)}</span>
              {comparePrice && comparePrice > unitPrice && (
                <span className="text-sm text-zinc-400 line-through">List: {formatPrice(comparePrice, currency)}</span>
              )}
            </div>

            {/* Description */}
            <div className="text-[#0f1111] text-xs leading-relaxed border-t border-zinc-100 pt-4 space-y-2">
              <h3 className="font-bold text-sm">About this item</h3>
              <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>

            {/* Variants Selectors */}
            {product.variants.length > 0 && (
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <h3 className="text-xs font-bold text-zinc-800">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className={`px-3 py-1.5 rounded-sm border text-xs font-semibold transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-[#f0f2f2] border-[#e47911] text-black ring-1 ring-[#e47911]'
                          : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-800'
                      }`}
                    >
                      {v.name} {parseFloat(String(v.priceDelta)) > 0 && `(+${formatPrice(parseFloat(String(v.priceDelta)), currency)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-zinc-500">Status:</span>
              {isOutOfStock ? (
                <span className="text-[#b12704]">Currently Unavailable</span>
              ) : (
                <span className="text-[#007600] font-bold">
                  In Stock. {activeStock <= 5 && `Only ${activeStock} left - order soon.`}
                </span>
              )}
            </div>

            {/* Action Row: Qty + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-150">
              {/* Qty selectors */}
              <div className="flex items-center justify-between border border-zinc-300 bg-[#f0f2f2] hover:bg-[#e3e6e6] rounded w-24 h-9 px-2">
                <button
                  type="button"
                  onClick={handleDecreaseQty}
                  disabled={isOutOfStock || quantity <= 1}
                  className="text-zinc-600 disabled:opacity-30 p-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-black font-bold text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncreaseQty}
                  disabled={isOutOfStock || quantity >= activeStock}
                  className="text-zinc-600 disabled:opacity-30 p-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cart Add Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-grow h-9 rounded-full font-bold text-xs uppercase tracking-wider transition-colors select-none ${
                  isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300'
                    : addedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] hover:border-[#f5b700] shadow-sm'
                }`}
              >
                {isOutOfStock ? (
                  'Out of Stock'
                ) : addedToCart ? (
                  'Added to Cart!'
                ) : (
                  <>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 pt-5 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-zinc-650" /> Secure transaction
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-zinc-650" /> TanimStore Fulfilled
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-zinc-650" /> 30-Day Policy
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <section className="border-t border-zinc-250 mt-12 pt-12">
        <h2 className="text-base font-bold text-[#0f1111] mb-6 uppercase tracking-wider">Top reviews from the United States</h2>

        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-zinc-200 p-5 rounded">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-600">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-[#0f1111]">{rev.user.name}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <div className="flex items-center text-[#ffa41c]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#0f1111]">Verified Purchase</span>
                  <span className="text-zinc-400 text-[10px] uppercase font-bold">
                    - {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-zinc-700 text-xs leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-zinc-200 rounded-md py-12 px-4 text-center bg-white">
            <p className="text-zinc-400 text-xs">No customer reviews yet. Be the first to write a review.</p>
          </div>
        )}
      </section>
    </div>
  );
}
