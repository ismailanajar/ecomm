import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCw, ClipboardList, Ban, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function CancellationReturnsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Cancellation &amp; Returns</h1>
          <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Guidelines for Order Cancellations, Product Returns, and Refund Processing</p>
        </div>

        {/* Core Return Policies Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Return Window */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg w-fit">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">10-Day Return Window</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              If you receive a defective, damaged, or incorrect item, you can request a return or exchange within 10 days of delivery.
            </p>
          </div>

          {/* Cancellation */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg w-fit">
              <Ban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Easy Cancellations</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              You can cancel your order directly from your account page at any time before the product has been dispatched for delivery.
            </p>
          </div>

          {/* Pick-Up */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="bg-zinc-150 text-zinc-700 p-2.5 rounded-lg w-fit">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Free Reverse Pickup</h3>
            <p className="text-zinc-550 text-xs leading-relaxed">
              Once your return request is approved, we will arrange a free reverse pickup from your address within 2-3 business days.
            </p>
          </div>
        </div>

        {/* Returns Process Walkthrough */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-zinc-650" />
            How to Request a Return
          </h2>

          <div className="space-y-4 text-xs text-zinc-600">
            <div className="flex gap-4">
              <span className="bg-[#172337] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900">Initiate Request</h4>
                <p className="leading-relaxed">
                  Go to your order history list and select the order containing the item. Click the **Return / Exchange** button. Alternatively, write to our support desk via the <Link href="/contact-us" className="text-blue-500 hover:underline">Contact Form</Link>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="bg-[#172337] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900">Validation</h4>
                <p className="leading-relaxed">
                  Provide details and upload images showing the package or defects. Our verification team reviews details and approves return requests within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="bg-[#172337] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900">Pickup &amp; Refund</h4>
                <p className="leading-relaxed">
                  Hand over the item in its original box packaging with all tags attached to the courier agent. Once the package is inspected at our hub, refunds are credited back to your original payment method within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
