import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getSettings } from '@/lib/settings';
import { Mail, Phone, Clock } from 'lucide-react';

export default async function ContactUsPage() {
  const settings = await getSettings();
  const logoText = settings.logoText || 'TanimStore';
  const mailAddress = settings.footerMailAddress || '';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Channels info (Col span 5) */}
        <div className="md:col-span-5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Get in Touch</h1>
            <p className="text-zinc-550 text-sm leading-relaxed">
              Have questions about products, ordering, shipping, or refunds? Our support desk is standing by to assist you.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Support Channels</h2>
            
            {/* Phone */}
            <div className="flex gap-3">
              <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg h-fit">
                <Phone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Call Customer Care</span>
                <a href="tel:044-45614709" className="text-xs font-bold text-zinc-900 hover:underline">044-45614709</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg h-fit">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Inquiry Email</span>
                <a href={`mailto:support@${logoText.toLowerCase()}.com`} className="text-xs font-bold text-zinc-900 hover:underline">
                  support@{logoText.toLowerCase()}.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3">
              <div className="bg-zinc-100 text-zinc-650 p-2.5 rounded-lg h-fit">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Available Hours</span>
                <span className="text-xs font-bold text-zinc-900">Monday - Friday (9AM - 6PM GMT)</span>
              </div>
            </div>
          </div>

          {/* Mail Address Column (If Configured) */}
          {mailAddress && (
            <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-5 text-xs text-zinc-550 space-y-2">
              <h3 className="font-bold text-zinc-700 uppercase tracking-wider">Mail Us Directly:</h3>
              <p className="leading-relaxed whitespace-pre-line font-medium font-mono">{mailAddress}</p>
            </div>
          )}
        </div>

        {/* Right Side: Inquiry Form (Col span 7) */}
        <div className="md:col-span-7">
          <ContactForm />
        </div>

      </main>

      <Footer />
    </div>
  );
}
