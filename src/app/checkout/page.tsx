"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Plus, Loader2, CheckCircle2, CreditCard, Landmark, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

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

export default function CheckoutPage() {
  const { user, loading, apiFetch, currency } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');
  
  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [savingAddress, setSavingAddress] = useState(false);

  // Placing Order State
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // 1. Authenticate Guard and Load Cart
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const cartData = localStorage.getItem('tanimstore_cart');
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        if (parsed.length === 0) {
          router.push('/cart');
        } else {
          setCart(parsed);
        }
      } catch (e) {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  // 2. Fetch User Addresses
  const fetchAddresses = async () => {
    try {
      const res = await apiFetch('/api/v1/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
        
        // Auto-select default or first address
        const def = data.addresses.find((a: Address) => a.isDefault);
        if (def) {
          setSelectedAddressId(def.id);
        } else if (data.addresses.length > 0) {
          setSelectedAddressId(data.addresses[0].id);
        }
      }
    } catch (e) {
      console.error('Fetch addresses error:', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // 3. Handle Add New Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await apiFetch('/api/v1/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line1,
          line2: line2 || undefined,
          city,
          state,
          postalCode,
          country,
          isDefault: addresses.length === 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setShowAddressForm(false);
        await fetchAddresses();
        setSelectedAddressId(data.address.id);
      }
    } catch (e) {
      console.error('Save address error:', e);
    } finally {
      setSavingAddress(false);
    }
  };

  // 4. Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setOrderError('Please select or add a shipping address.');
      return;
    }
    setPlacingOrder(true);
    setOrderError(null);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + tax + shipping;

    try {
      const res = await apiFetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({
            productId: i.productId,
            variantId: i.variantId || undefined,
            price: i.price,
            quantity: i.quantity
          })),
          addressId: selectedAddressId,
          paymentMethod,
          subtotal,
          tax,
          shipping,
          total
        }),
      });

      if (res.ok) {
        // Clear Cart
        localStorage.removeItem('tanimstore_cart');
        window.dispatchEvent(new Event('storage'));
        router.push('/orders');
      } else {
        const err = await res.json();
        setOrderError(err.error?.message || 'Failed to place order. Please try again.');
      }
    } catch (e) {
      setOrderError('Network error occurred. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
        <Header />
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Verifying Checkout Session...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Checkout Setup: Address & Payment (Col span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Address Section */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-2">
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">1. Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-amber-500 hover:text-amber-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddAddress} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={line1}
                        onChange={(e) => setLine1(e.target.value)}
                        placeholder="House No, Building, Street Name"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address Line 2</label>
                      <input
                        type="text"
                        value={line2}
                        onChange={(e) => setLine2(e.target.value)}
                        placeholder="Apartment, Area (optional)"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Country *</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="bg-[#172337] hover:bg-[#24334a] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {savingAddress ? 'Saving Address...' : 'Save & Select Address'}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-zinc-500 text-xs italic">No saved addresses found. Please add a delivery address to proceed.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`border rounded-xl p-4 cursor-pointer relative flex gap-3 items-start hover:border-zinc-400 transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-[#f3a847] bg-[#fdfaf6] ring-1 ring-[#f3a847]'
                              : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedAddressId === addr.id ? 'text-[#f3a847]' : 'text-zinc-400'}`} />
                          <div className="text-xs space-y-1 pr-6 font-medium text-zinc-650">
                            <div className="flex gap-2 items-center">
                              <span className="font-bold text-zinc-900">Address</span>
                              {addr.isDefault && (
                                <span className="bg-zinc-150 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase text-zinc-500">Default</span>
                              )}
                            </div>
                            <p className="leading-snug">{addr.line1}</p>
                            {addr.line2 && <p className="leading-snug">{addr.line2}</p>}
                            <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                            <p className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">{addr.country}</p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <CheckCircle2 className="w-4 h-4 text-[#f3a847] absolute top-4 right-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">2. Payment Method</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`border rounded-xl p-4 cursor-pointer relative flex gap-3 items-center hover:border-zinc-400 transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#f3a847] bg-[#fdfaf6] ring-1 ring-[#f3a847]'
                      : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'COD' ? 'bg-[#f3a847]/10 text-[#f3a847]' : 'bg-zinc-100 text-zinc-500'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <h3 className="font-bold text-zinc-900">Cash on Delivery (COD)</h3>
                    <p className="text-zinc-500 text-[10px]">No additional handling charges</p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <CheckCircle2 className="w-4 h-4 text-[#f3a847] absolute top-4 right-4" />
                  )}
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`border rounded-xl p-4 cursor-pointer relative flex gap-3 items-center hover:border-zinc-400 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#f3a847] bg-[#fdfaf6] ring-1 ring-[#f3a847]'
                      : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'CARD' ? 'bg-[#f3a847]/10 text-[#f3a847]' : 'bg-zinc-100 text-zinc-500'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <h3 className="font-bold text-zinc-900">Credit or Debit Card</h3>
                    <p className="text-zinc-550 text-[10px] font-semibold text-emerald-600">Secure checkout via Stripe</p>
                  </div>
                  {paymentMethod === 'CARD' && (
                    <CheckCircle2 className="w-4 h-4 text-[#f3a847] absolute top-4 right-4" />
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Checkout Panel: Checkout items & place order button (Col span 4) */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">Order Review</h2>
            
            {/* Items Summary list */}
            <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-2.5 flex justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900 truncate max-w-[180px]">{item.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-bold">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-zinc-800">{formatPrice(item.price * item.quantity, currency)}</span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 border-t border-zinc-200 pt-3 text-xs text-zinc-650 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                {shipping === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span>{formatPrice(shipping, currency)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 border-t border-dashed border-zinc-200 pt-3">
                <span>Total Amount</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Place Order Trigger */}
            {orderError && (
              <div className="text-[11px] bg-red-50 text-red-700 p-2.5 rounded-lg border border-red-150 font-semibold leading-relaxed">
                {orderError}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="w-full bg-[#f3a847] hover:bg-[#e29b3c] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Place Your Order</span>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
