import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Truck, Calendar, MapPin, Search } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Shipping policy</h1>
          <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Processing Times, Delivery Methods, and Shipping Speeds</p>
        </div>

        {/* Shipping Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dispatch Time */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg w-fit">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Quick Dispatch</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              Most orders are packaged and dispatched from our fulfillment centers within 24 to 48 hours of placing the order (excluding Sundays and national holidays).
            </p>
          </div>

          {/* Delivery Area */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg w-fit">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">National Delivery</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              We ship to almost all addresses and zip codes nationwide, partnering with premium express couriers to guarantee safe deliveries.
            </p>
          </div>

          {/* Tracking */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-zinc-150 text-zinc-700 p-2.5 rounded-lg w-fit">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Easy Tracking</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              Once shipped, you will receive an SMS and email notification containing the carrier name and live tracking number to monitor your package.
            </p>
          </div>

        </div>

        {/* Shipping Rates Table */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Estimated Shipping Speeds &amp; Costs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-[#878787] uppercase tracking-wider">
                  <th className="py-3 font-bold">Shipping Method</th>
                  <th className="py-3 font-bold">Estimated Delivery</th>
                  <th className="py-3 font-bold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                <tr>
                  <td className="py-3.5 font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-zinc-400" />
                    Standard Shipping
                  </td>
                  <td className="py-3.5">4 to 7 Business Days</td>
                  <td className="py-3.5 font-bold text-emerald-600">FREE</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-500" />
                    Express Delivery
                  </td>
                  <td className="py-3.5">2 to 3 Business Days</td>
                  <td className="py-3.5 font-bold">$4.99</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-500" />
                    Next-Day Delivery
                  </td>
                  <td className="py-3.5">Next Business Day</td>
                  <td className="py-3.5 font-bold">$14.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
