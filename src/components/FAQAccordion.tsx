"use client";

import React, { useState } from 'react';
import { ChevronDown, ShoppingBag, Truck, CreditCard, RefreshCw } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  icon: React.ReactNode;
  items: FaqItem[];
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const categories: FaqCategory[] = [
    {
      title: 'Orders & Account',
      icon: <ShoppingBag className="w-5 h-5" />,
      items: [
        {
          question: 'How do I place an order?',
          answer: 'Browse our catalog, click on a product to view details, select variants if applicable, and click "Add to Cart". Once ready, go to the cart icon in the header and follow the secure checkout instructions.'
        },
        {
          question: 'Can I change my order details after placing it?',
          answer: 'Order details (like shipping address) can only be updated before the product is dispatched. Please contact our support team immediately if you notice an error in your order details.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: <Truck className="w-5 h-5" />,
      items: [
        {
          question: 'What are the shipping charges?',
          answer: 'Standard shipping is completely free of cost for all national orders. Express delivery is available for $4.99, and Next-Day delivery is available for $14.99.'
        },
        {
          question: 'How do I track my package?',
          answer: 'Once your order is processed and handed to our shipping carrier, you will receive a tracking link via email and SMS to follow your package live.'
        }
      ]
    },
    {
      title: 'Payments',
      icon: <CreditCard className="w-5 h-5" />,
      items: [
        {
          question: 'What payment options do you support?',
          answer: 'We support all major Credit/Debit cards (Visa, MasterCard, Amex, RuPay), NetBanking, UPI, and Cash on Delivery (COD) in eligible delivery areas.'
        },
        {
          question: 'Is Cash on Delivery available for all pin codes?',
          answer: 'COD is available for most locations. During checkout, when you enter your shipping address, the payment system will check your pin code eligibility.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      icon: <RefreshCw className="w-5 h-5" />,
      items: [
        {
          question: 'What is your return policy?',
          answer: 'We offer an easy 10-day return policy for any damaged, defective, or incorrect items. The product must be unused, and returned in its original box packaging with tags intact.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Once the returned item is received and inspected at our hubs, refunds are approved and credit typically reflects in your original account in 5-7 business days.'
        }
      ]
    }
  ];

  const toggleAccordion = (catIndex: number, itemIndex: number) => {
    const key = `${catIndex}-${itemIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="space-y-8">
      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="space-y-4">
          
          {/* Category Title Header */}
          <div className="flex items-center gap-2 text-zinc-950 font-black text-sm uppercase tracking-wider border-b border-zinc-200 pb-1.5">
            <span className="text-[#172337]">{cat.icon}</span>
            <span>{cat.title}</span>
          </div>

          {/* Category Accordion items */}
          <div className="space-y-2.5">
            {cat.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isOpen = openIndex === key;

              return (
                <div 
                  key={itemIdx}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:border-zinc-350 transition-all"
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(catIdx, itemIdx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-xs uppercase tracking-wide text-zinc-800 hover:text-black cursor-pointer outline-none select-none transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Accordion Content wrapper */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 border-t border-zinc-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  >
                    <p className="px-5 py-4 text-zinc-600 text-xs leading-relaxed font-medium">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
}
