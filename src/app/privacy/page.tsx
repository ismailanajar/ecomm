import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, Shield, Lock, Info } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Privacy Policy</h1>
          <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Your privacy and data security are our highest priority</p>
        </div>

        {/* Security Info Banner */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 text-xs flex gap-3 items-start shadow-xs">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider">Commitment to Data Security</span>
            <p className="leading-relaxed font-medium">
              We employ strict industry-standard technical measures (SSL encryption, secure tokenized database fields) to safeguard your personal credentials and prevent unauthorized data leaks.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6 text-xs text-zinc-650 leading-relaxed font-medium">
          
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <Eye className="w-4 h-4 text-zinc-500" />
              1. Information We Collect
            </h2>
            <p>
              When you visit or purchase from our storefront, we collect necessary personal details such as your Name, Billing/Shipping Address, Email ID, Phone Number, and browser metadata (cookies, IP address) to complete purchases, verify accounts, and analyze website analytics.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              2. How We Use Your Data
            </h2>
            <p>
              Your information is utilized solely to process checkout orders, send shipping/delivery notifications, verify client accounts, provide customer care services, and notify you of promotional campaigns (which you can choose to opt out of at any time).
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <Lock className="w-4 h-4 text-zinc-500" />
              3. Sharing Information &amp; Third-Party Services
            </h2>
            <p>
              We do not sell or lease your personal credentials. Your information is shared only with verified third-party partners who perform critical checkout operations (such as payment processing gateways and parcel delivery/courier partners).
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              4. Cookies Policy
            </h2>
            <p>
              Cookies are small files stored on your local device. We use functional cookies to retain your shopping cart items, keep you securely logged into your account session across refreshes, and track website usage trends to optimize customer storefront experiences.
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
