import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CreditCard, ShieldCheck, Landmark, HandCoins, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Payments & checkout</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Accepted Payment Methods and Security Standards</p>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">100% Secure Checkout Guarantee</h2>
            <p className="text-zinc-600 text-xs leading-relaxed">
              We take payment security very seriously. All transactions are processed through 256-bit SSL encrypted networks. We do not store your full card details on our servers, ensuring absolute privacy and data security.
            </p>
          </div>
        </div>

        {/* Payment Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cards */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg w-fit">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Credit & Debit Cards</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              We accept all major national and international credit/debit cards, including Visa, MasterCard, American Express, and RuPay.
            </p>
          </div>

          {/* Net Banking */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg w-fit">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Net Banking & UPI</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              Pay directly from your bank account using Net Banking or complete instant smartphone checkouts via UPI networks.
            </p>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-zinc-150 text-zinc-700 p-2.5 rounded-lg w-fit">
              <HandCoins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Cash on Delivery (COD)</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              Convenient Cash on Delivery is available for selected pin codes. Pay in cash or UPI to the courier agent upon receiving your order.
            </p>
          </div>
        </div>

        {/* FAQs about payments */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Common Payment FAQs</h2>
          
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-zinc-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                Is there any extra fee for Cash on Delivery?
              </h4>
              <p className="text-zinc-550 pl-5 leading-relaxed">
                No, we do not charge any additional dispatch or handling fees for Cash on Delivery orders.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-zinc-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                What happens if my transaction fails but money is deducted?
              </h4>
              <p className="text-zinc-550 pl-5 leading-relaxed">
                Failed transaction funds are automatically reversed by the payment gateways. Refunds typically reflect in your account within 3-5 business days. You can check the <Link href="/cancellation-returns" className="text-blue-500 hover:underline">Refund Policy</Link> for details.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
