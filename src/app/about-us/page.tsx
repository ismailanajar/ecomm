import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Target, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#172337] to-[#24334a] text-white rounded-2xl p-8 md:p-12 shadow-md text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Our Journey to Excellence</h1>
          <p className="text-zinc-300 text-sm max-w-xl mx-auto leading-relaxed">
            We are dedicated to providing you with the highest quality premium products, secure checkouts, and a shopping experience that feels simple, sleek, and intuitive.
          </p>
        </div>

        {/* Mission Statement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex gap-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-lg h-fit shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">Our Mission</h2>
              <p className="text-zinc-650 text-xs leading-relaxed">
                To curate premium lifestyle products and make them accessible to everyone, backed by an uncompromising standard of service, speed, and integrity.
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg h-fit shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">Customer First</h2>
              <p className="text-zinc-650 text-xs leading-relaxed">
                Every policy, code release, and support response is designed around you. Your complete satisfaction is our ultimate measurement of success.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black tracking-tight text-zinc-900">What Drives Us</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Our Core Pillars of Service</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Authenticity */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center space-y-3 shadow-xs">
              <div className="bg-zinc-100 text-zinc-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">100% Genuine</h3>
              <p className="text-zinc-550 text-xs leading-relaxed">
                All listed brands and products are verified at the source to guarantee complete authenticity.
              </p>
            </div>

            {/* Quality */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center space-y-3 shadow-xs">
              <div className="bg-zinc-100 text-zinc-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Curated Quality</h3>
              <p className="text-zinc-550 text-xs leading-relaxed">
                We handpick items that meet strict durability, aesthetics, and user-experience benchmarks.
              </p>
            </div>

            {/* Global Standards */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center space-y-3 shadow-xs">
              <div className="bg-zinc-100 text-zinc-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Community Choice</h3>
              <p className="text-zinc-550 text-xs leading-relaxed">
                We adapt constantly based on customer reviews and community feedback.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
