"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/currency';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, ShoppingCart, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';

interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export default function CartPage() {
  const { currency } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cartData = localStorage.getItem('tanimstore_cart');
    if (cartData) {
      try {
        setCart(JSON.parse(cartData));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('tanimstore_cart', JSON.stringify(newCart));
    // Dispatch storage event to update Header count
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    saveCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCart(updated);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
        <Header />
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 flex items-center justify-center">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Loading Cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Price calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        <div className="space-y-6">
          
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-5 max-w-md mx-auto shadow-sm">
              <div className="bg-amber-50 text-amber-500 p-4 rounded-full w-fit mx-auto">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">Your Cart is Empty</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Looks like you haven't added any products to your shopping cart yet. Start exploring our premium collections!
                </p>
              </div>
              <Link
                href="/"
                className="inline-block bg-[#172337] hover:bg-[#24334a] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Cart Items List (Col span 8) */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.productId}-${item.variantId || 'base'}`}
                    className="bg-white border border-zinc-200 rounded-xl p-4 flex gap-4 items-center shadow-xs"
                  >
                    {/* Image */}
                    <img 
                      src={item.image || '/images/placeholder.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg border border-zinc-150 shrink-0" 
                    />

                    {/* Content Details */}
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          {item.brand && (
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">{item.brand}</span>
                          )}
                          <h3 className="font-bold text-xs text-zinc-900 leading-snug">{item.name}</h3>
                          {item.variantName && (
                            <span className="inline-block text-[10px] bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded-full font-bold mt-1 uppercase tracking-wide">
                              Variant: {item.variantName}
                            </span>
                          )}
                        </div>
                        <span className="font-black text-xs text-zinc-900">{formatPrice(item.price * item.quantity, currency)}</span>
                      </div>

                      {/* Control Panel */}
                      <div className="flex justify-between items-center pt-2">
                        {/* Quantity Toggle */}
                        <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                          <button 
                            onClick={() => updateQuantity(index, -1)}
                            className="p-1.5 hover:bg-zinc-200 text-zinc-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-bold text-zinc-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(index, 1)}
                            className="p-1.5 hover:bg-zinc-200 text-zinc-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeItem(index)}
                          className="text-zinc-400 hover:text-red-600 p-1.5 transition-colors flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Order Summary Panel (Col span 4) */}
              <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">Price Details</h2>
                
                <div className="space-y-2.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Price ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
                    <span className="font-semibold text-zinc-900">{formatPrice(subtotal, currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-zinc-900">{formatPrice(tax, currency)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-zinc-900">{formatPrice(shipping, currency)}</span>
                    )}
                  </div>

                  {shipping > 0 && (
                    <div className="bg-amber-50 text-amber-700 p-2 rounded-lg text-[10px] leading-relaxed flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      Add {formatPrice(50 - subtotal, currency)} more to qualify for FREE Shipping!
                    </div>
                  )}

                  <div className="flex justify-between border-t border-dashed border-zinc-200 pt-3 text-sm font-black text-zinc-900">
                    <span>Total Amount</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-[#f3a847] hover:bg-[#e29b3c] text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
