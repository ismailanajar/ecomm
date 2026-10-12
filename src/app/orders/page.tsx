"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Loader2, Calendar, ClipboardList, MapPin, Truck, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import Link from 'next/link';

interface OrderItem {
  id: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  product?: {
    images?: any;
    brand?: string;
  }
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  stripePaymentIntentId?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, loading, apiFetch, currency } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?callbackUrl=/orders');
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      const res = await apiFetch('/api/v1/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Fetch orders error:', e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading || fetching || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
        <Header />
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Fetching Order History...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-5 max-w-md mx-auto shadow-sm">
            <div className="bg-zinc-50 text-zinc-400 p-4 rounded-full w-fit mx-auto">
              <ClipboardList className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">No Orders Found</h3>
              <p className="text-zinc-550 text-xs leading-relaxed">
                You haven't placed any orders on our storefront yet. Start browsing our catalog and complete checkouts!
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
          <div className="space-y-6">
            {orders.map((order) => {
              // Parse shipping details & payment method from stripePaymentIntentId
              let parsedIntent = { paymentMethod: 'Card Payment', shippingAddress: null as any };
              try {
                if (order.stripePaymentIntentId && order.stripePaymentIntentId.startsWith('{')) {
                  parsedIntent = JSON.parse(order.stripePaymentIntentId);
                }
              } catch (e) {}

              const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={order.id} className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
                  
                  {/* Order Top Summary Bar */}
                  <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <div>
                      <span className="text-[9px] block text-zinc-400">Order Placed</span>
                      <span className="text-zinc-900 font-bold font-mono">{orderDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-zinc-400">Total Price</span>
                      <span className="text-zinc-900 font-extrabold">{formatPrice(order.total, currency)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-zinc-400">Ship To</span>
                      <span className="text-zinc-900 font-bold truncate max-w-[120px] block">
                        {parsedIntent.shippingAddress ? `${parsedIntent.shippingAddress.line1}, ${parsedIntent.shippingAddress.city}` : user.name}
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-[9px] block text-zinc-400">Order ID</span>
                      <span className="text-zinc-900 font-bold font-mono text-[10px] break-all">{order.id}</span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="p-6 space-y-6">
                    
                    {/* Status Tracker */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-zinc-150 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#f3a847]/10 text-[#f3a847] p-1.5 rounded-lg">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">Delivery Status</span>
                          <span className="text-xs font-extrabold text-zinc-800 uppercase tracking-wide">
                            {order.status === 'PENDING' ? 'Processing Package' : order.status}
                          </span>
                        </div>
                      </div>

                      {/* Return link */}
                      <Link
                        href="/cancellation-returns"
                        className="text-zinc-500 hover:text-red-600 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider w-fit"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Return or Cancel Item</span>
                      </Link>
                    </div>

                    {/* Order Items rows */}
                    <div className="space-y-4">
                      {order.items.map((item) => {
                        let imageUrl = '/images/placeholder.png';
                        try {
                          if (item.product?.images) {
                            const parsedImages = typeof item.product.images === 'string' 
                              ? JSON.parse(item.product.images) 
                              : item.product.images;
                            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                              imageUrl = parsedImages[0];
                            }
                          }
                        } catch (e) {}

                        return (
                          <div key={item.id} className="flex gap-4 items-start text-xs text-zinc-650 font-medium">
                            <img
                              src={imageUrl}
                              alt={item.nameSnapshot}
                              className="w-12 h-12 object-cover border border-zinc-150 rounded-lg shrink-0"
                            />
                            <div className="flex-grow space-y-1">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  {item.product?.brand && (
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">{item.product.brand}</span>
                                  )}
                                  <h4 className="font-bold text-zinc-900">{item.nameSnapshot}</h4>
                                  <span className="text-[10px] text-zinc-400 block font-bold">Quantity: {item.quantity}</span>
                                </div>
                                <span className="font-black text-zinc-800">{formatPrice(Number(item.priceSnapshot) * item.quantity, currency)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shipping Card Snapshot */}
                    {parsedIntent.shippingAddress && (
                      <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 flex gap-3 text-xs items-start font-medium text-zinc-600">
                        <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <span className="font-bold text-zinc-900 uppercase tracking-wide text-[9px] block">Shipping Destination</span>
                          <p className="leading-snug">{parsedIntent.shippingAddress.line1}</p>
                          {parsedIntent.shippingAddress.line2 && <p className="leading-snug">{parsedIntent.shippingAddress.line2}</p>}
                          <p>{parsedIntent.shippingAddress.city}, {parsedIntent.shippingAddress.state} - {parsedIntent.shippingAddress.postalCode}</p>
                          <p className="text-zinc-400 uppercase tracking-widest text-[9px] font-bold">{parsedIntent.shippingAddress.country}</p>
                          <p className="text-zinc-400 text-[10px] pt-1.5">
                            Payment Channel: <span className="font-extrabold text-zinc-700 uppercase">{parsedIntent.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Card Checkout'}</span>
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
