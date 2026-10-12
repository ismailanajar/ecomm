"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, FolderTree, Users, Settings, Home, LogOut, Loader2, ShieldCheck, Menu, X, ClipboardCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#febd69] mb-4" />
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Verifying Admin Credentials...</p>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardCheck },
    { name: 'Products', href: '/admin/products', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111827] text-white shrink-0 border-r border-zinc-800 shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-[#febd69] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight">Admin Console</span>
            <span className="text-[10px] text-zinc-400 uppercase font-bold leading-none">TanimStore Control</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow p-4 space-y-1.5">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin info & Logout */}
        <div className="p-4 border-t border-zinc-800 bg-[#090f1d] flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-white text-sm">
              {user.name[0]}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate text-white leading-tight">{user.name}</span>
              <span className="text-[9px] text-zinc-450 truncate uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              View Storefront
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold text-red-400 hover:text-white hover:bg-red-950 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#111827] text-white h-16 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-extrabold">TanimStore Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-amber-500">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] text-white border-b border-zinc-800 px-6 py-4 flex flex-col gap-3 select-none">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold ${
                  isActive ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2 mt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-400"
            >
              <Home className="w-4 h-4" /> View Storefront
            </Link>
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 text-left"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <main className="flex-grow p-6 sm:p-8 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
