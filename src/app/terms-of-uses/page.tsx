import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

export default function TermsOfUsesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Terms of Uses</h1>
          <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Please read these conditions carefully before using our services</p>
        </div>

        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs flex gap-3 items-start shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider">User Agreement Notice</span>
            <p className="leading-relaxed">
              By accessing, browsing, or using this e-commerce platform, you acknowledge that you have read, understood, and agreed to be bound by all of the clauses outlined in this document. If you do not agree to these terms, please do not use this site.
            </p>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6 text-xs text-zinc-650 leading-relaxed font-medium">
          
          {/* Clause 1 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              1. Platform Usage &amp; Access
            </h2>
            <p>
              This website is made available for personal, non-commercial shopping purposes only. You must be at least 18 years of age or accessing the site under the supervision of a parent or legal guardian. We grant you a limited, non-transferable, and revocable license to use the site for purchasing items listed for sale.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              2. Customer Accounts &amp; Security
            </h2>
            <p>
              To complete purchases, you may be required to register an account. You are solely responsible for maintaining the confidentiality of your account password, email ID, and restricting unauthorized access to your computer or mobile device. All activities that occur under your login credentials are your direct responsibility.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              3. Order Placements &amp; Cancellations
            </h2>
            <p>
              All orders placed on the platform are subject to product availability and confirmation of checkout pricing. We reserve the right to cancel or refuse any order at our discretion due to quantity limitations, errors in pricing, or detection of fraudulent transactions. If an order is canceled after payment, a complete refund will be issued.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-zinc-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              4. Liability Disclaimers
            </h2>
            <p>
              We strive to present product descriptions, pricing, and images as accurately as possible. However, we do not warrant that all specifications are completely error-free. We shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this e-commerce platform.
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
