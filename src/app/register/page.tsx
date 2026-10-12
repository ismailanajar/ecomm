"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
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
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fbfaf8] overflow-hidden px-4">
      
      {/* Dynamic Background Gradients */}
      <div className="relative z-10 w-full max-w-md bg-white border border-black/10 p-8 rounded-xl shadow-xl">
        
        {/* Brand Logo & Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 bg-black rounded-lg flex items-center justify-center mb-4">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-black tracking-tight uppercase">Create Account</h1>
          <p className="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-semibold">Join TanimStore today</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-red-55/40 border border-red-200 rounded-lg text-red-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white border border-black/10 focus:border-black rounded-lg px-4 py-2.5 text-black text-sm outline-none transition-all"
            />
          </div>

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
            <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Password</label>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Redirect section */}
        <div className="text-center mt-6 text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-semibold underline underline-offset-4">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
