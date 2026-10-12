import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQAccordion from '@/components/FAQAccordion';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
        
        {/* Header Title */}
        <div className="space-y-2 border-b border-zinc-200 pb-4 text-center">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8 text-amber-500" />
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Quick answers to common questions about orders, payments, shipping, and returns</p>
        </div>

        {/* Categorized FAQ Accordion List */}
        <FAQAccordion />

      </main>

      <Footer />
    </div>
  );
}
