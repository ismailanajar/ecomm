"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-white border border-black/10 p-8 rounded-xl shadow-xl">
      
      {/* Brand Logo & Heading */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-11 h-11 bg-black rounded-lg flex items-center justify-center mb-4">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-black tracking-tight uppercase">Welcome Back</h1>
        <p className="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-semibold">Sign in to your account</p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white border border-black/10 focus:border-black rounded-lg px-4 py-2.5 text-black text-sm outline-none transition-all"
          />
        </div>

        {/* Password input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Password</label>
            <Link href="#" className="text-xs text-zinc-400 hover:text-black underline underline-offset-4">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-black/10 focus:border-black rounded-lg pl-4 pr-11 py-2.5 text-black text-sm outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg py-3 shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Redirect section */}
      <div className="text-center mt-6 text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-black font-semibold underline underline-offset-4">
          Sign up
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fbfaf8] overflow-hidden px-4">
      <Suspense fallback={
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-black animate-spin" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
