"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Mock inquiry message send timeout
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm">
      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full w-fit mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900">Message Received!</h3>
            <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
              Thank you for writing to us. One of our support officers will review your inquiry and get back to you within 24 business hours.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-base font-black tracking-tight text-zinc-900">Inquiry Message</h2>
          <p className="text-zinc-400 text-xs font-medium -mt-2">Leave us a direct line and details about your query.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-xs outline-none text-black transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-xs outline-none text-black transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Order Delivery Status Inquiry"
              className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-xs outline-none text-black transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message details *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your inquiry in detail..."
              className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-xs outline-none text-black transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Sending message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-black" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
