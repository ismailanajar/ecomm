"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, ShoppingCart, User, LogOut, Search, Menu, X, ShieldAlert } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function HeaderContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [logoText, setLogoText] = useState('TanimStore');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoDisplayType, setLogoDisplayType] = useState('both');
  const [mounted, setMounted] = useState(false);

  // Fetch site settings for branding
  useEffect(() => {
    setMounted(true);
    setSearchQuery(searchParams.get('search') || '');
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setLogoText(data.settings.logoText || 'TanimStore');
          setLogoUrl(data.settings.logoUrl || '');
          setLogoDisplayType(data.settings.logoDisplayType || 'both');
        }
      })
      .catch((err) => console.error('Failed to fetch header settings:', err));
  }, []);

  // Sync search input with URL params
  useEffect(() => {
    if (mounted) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, mounted]);

  // Sync cart count from local storage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem('tanimstore_cart');
        if (cartData) {
          const parsed = JSON.parse(cartData);
          const count = parsed.reduce((acc: number, item: any) => acc + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  if (!mounted) {
    return <div className="h-14 bg-[#131921] w-full" suppressHydrationWarning />;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="w-full flex flex-col shrink-0">
      
      {/* 1. Main Navigation Bar (Dark Slate) */}
      <div className="bg-[#131921] h-14 text-white flex items-center px-4 justify-between gap-4 select-none">
        
        {/* Brand Logo (Left) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-0.5 border border-transparent hover:border-white p-1 rounded-sm">
            {logoDisplayType === 'both' && (
              <div className="flex items-center gap-2">
                {logoUrl && <img src={logoUrl} alt={logoText} className="h-7 max-w-[150px] object-contain" />}
                <span className="text-lg font-black text-white tracking-tight flex items-baseline gap-0.5">
                  {logoText}
                  {logoText.toLowerCase() === 'tanimstore' && (
                    <span className="text-[10px] text-[#febd69] font-bold">.com</span>
                  )}
                </span>
              </div>
            )}
            {logoDisplayType === 'logo' && (
              logoUrl ? (
                <img src={logoUrl} alt={logoText} className="h-7 max-w-[150px] object-contain" />
              ) : (
                <span className="text-lg font-black text-white tracking-tight flex items-baseline gap-0.5">
                  {logoText}
                  {logoText.toLowerCase() === 'tanimstore' && (
                    <span className="text-[10px] text-[#febd69] font-bold">.com</span>
                  )}
                </span>
              )
            )}
            {logoDisplayType === 'text' && (
              <span className="text-lg font-black text-white tracking-tight flex items-baseline gap-0.5">
                {logoText}
                {logoText.toLowerCase() === 'tanimstore' && (
                  <span className="text-[10px] text-[#febd69] font-bold">.com</span>
                )}
              </span>
            )}
          </Link>
        </div>

        {/* Central Search Box Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-3xl h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f3a847]">
          {/* Dropdown placeholder */}
          <div className="bg-[#f3f3f3] hover:bg-[#dadada] text-zinc-700 text-xs px-3.5 flex items-center border-r border-zinc-300 cursor-pointer shrink-0">
            All
          </div>
          {/* Input field */}
          <input
            type="text"
            placeholder={`Search ${logoText}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-3 text-black text-sm outline-none border-none h-full"
          />
          {/* Search Button */}
          <button
            type="submit"
            className="bg-[#febd69] hover:bg-[#f3a847] text-black w-12 flex items-center justify-center transition-colors h-full outline-none"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Right Accounts / Orders / Cart Action Buttons */}
        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
          
          {/* Admin Panel (If Admin) */}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-[#febd69] font-bold border border-transparent hover:border-white p-1.5 rounded-sm flex items-center gap-1 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}

          {/* Account Login Selector */}
          {user ? (
            <Link href="/account" className="flex flex-col border border-transparent hover:border-white p-1 rounded-sm">
              <span className="text-[10px] text-zinc-300 leading-none">Hello, {user?.name ? user.name.split(' ')[0] : 'User'}</span>
              <span className="text-xs font-bold leading-tight flex items-center gap-1">Account & Lists</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col border border-transparent hover:border-white p-1 rounded-sm">
              <span className="text-[10px] text-zinc-300 leading-none">Hello, sign in</span>
              <span className="text-xs font-bold leading-tight">Account & Lists</span>
            </Link>
          )}

          {/* Returns & Orders */}
          <Link href="/orders" className="hidden sm:flex flex-col border border-transparent hover:border-white p-1 rounded-sm">
            <span className="text-[10px] text-zinc-300 leading-none">Returns</span>
            <span className="text-xs font-bold leading-tight">& Orders</span>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="flex items-end gap-1.5 border border-transparent hover:border-white p-1 rounded-sm relative">
            <div className="relative">
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-[#f08804]">
                {cartCount}
              </span>
            </div>
            <span className="text-xs font-bold mb-0.5 hidden lg:inline">Cart</span>
          </Link>

          {/* Sign Out (If Logged In) */}
          {user && (
            <button
              onClick={logout}
              className="text-zinc-300 hover:text-white border border-transparent hover:border-white p-1.5 rounded-sm flex items-center gap-1 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}

          {/* Mobile Menu Action */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center md:hidden border border-transparent hover:border-white p-1 rounded-sm text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>



      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 bg-[#fbfaf8] text-black px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-250">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder={`Search ${logoText}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/10 focus:border-black rounded-lg pl-10 pr-4 py-2 text-black text-sm outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          </form>

          <div className="flex flex-col gap-4 text-sm font-semibold">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-black">Shop</Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#e47911]">
                Admin Settings
              </Link>
            )}

            <div className="border-t border-black/10 pt-4 mt-2">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-700">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-zinc-800 font-bold">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full text-left text-zinc-500 hover:text-black flex items-center gap-2 py-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-zinc-700 border border-black/10 rounded-lg py-2.5 bg-white">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center bg-[#febd69] text-black rounded-lg py-2.5 font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-14 bg-[#131921] w-full" suppressHydrationWarning />}>
      <HeaderContent />
    </Suspense>
  );
}
