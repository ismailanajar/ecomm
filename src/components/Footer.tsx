"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [settings, setSettings] = useState({
    logoText: 'TanimStore',
    footerText: '',
    footerMailAddress: '',
    footerOfficeAddress: '',
    socialFacebook: '',
    socialTwitter: '',
    socialYoutube: '',
    socialInstagram: '',
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings({
            logoText: data.settings.logoText || 'TanimStore',
            footerText: data.settings.footerText || '',
            footerMailAddress: data.settings.footerMailAddress || '',
            footerOfficeAddress: data.settings.footerOfficeAddress || '',
            socialFacebook: data.settings.socialFacebook || '',
            socialTwitter: data.settings.socialTwitter || '',
            socialYoutube: data.settings.socialYoutube || '',
            socialInstagram: data.settings.socialInstagram || '',
          });
        }
      })
      .catch((err) => console.error('Failed to load footer settings:', err));
  }, []);

  if (!mounted) {
    return <footer className="w-full bg-[#172337] h-40 border-t border-zinc-800" suppressHydrationWarning />;
  }

  const logoText = settings.logoText;
  const year = new Date().getFullYear();
  const copyrightText = settings.footerText || `© 2007-${year} ${logoText}.com. All rights reserved.`;

  const hasMail = !!(settings.footerMailAddress || '').trim();
  const hasOffice = !!(settings.footerOfficeAddress || '').trim();
  const hasSocials = !!(
    (settings.socialFacebook || '').trim() ||
    (settings.socialTwitter || '').trim() ||
    (settings.socialYoutube || '').trim() ||
    (settings.socialInstagram || '').trim()
  );
  const showRightSide = hasMail || hasOffice;

  // Reusable Socials component
  const SocialsList = () => (
    <div className="flex items-center gap-3 text-zinc-400">
      {(settings.socialFacebook || '').trim() && (
        <Link href={(settings.socialFacebook || '').trim()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Link>
      )}
      {(settings.socialTwitter || '').trim() && (
        <Link href={(settings.socialTwitter || '').trim()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Link>
      )}
      {(settings.socialYoutube || '').trim() && (
        <Link href={(settings.socialYoutube || '').trim()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Youtube">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Link>
      )}
      {(settings.socialInstagram || '').trim() && (
        <Link href={(settings.socialInstagram || '').trim()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </Link>
      )}
    </div>
  );

  return (
    <footer className="w-full bg-[#172337] text-white text-xs select-none shrink-0 font-sans mt-auto border-t border-zinc-800">
      
      {/* 2. Main Footer Multi-Column Links Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-[12px]">
        
        {/* Left Side Links */}
        <div className={`${showRightSide ? 'md:col-span-6' : 'md:col-span-12'} grid grid-cols-1 sm:grid-cols-3 gap-6`}>
          {/* ABOUT */}
          <div className="space-y-2">
            <h3 className="text-[#878787] text-[10px] font-bold uppercase tracking-wider">About</h3>
            <ul className="space-y-1.5 font-semibold text-[#f0f0f0]">
              <li><Link href="/contact-us" className="hover:underline hover:text-white">Contact Us</Link></li>
              <li><Link href="/about-us" className="hover:underline hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="space-y-2">
            <h3 className="text-[#878787] text-[10px] font-bold uppercase tracking-wider">Help</h3>
            <ul className="space-y-1.5 font-semibold text-[#f0f0f0]">
              <li><Link href="/payments" className="hover:underline hover:text-white">Payments</Link></li>
              <li><Link href="/shipping" className="hover:underline hover:text-white">Shipping</Link></li>
              <li><Link href="/cancellation-returns" className="hover:underline hover:text-white">Cancellation & Returns</Link></li>
              <li><Link href="/faq" className="hover:underline hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* CONSUMER POLICY */}
          <div className="space-y-2">
            <h3 className="text-[#878787] text-[10px] font-bold uppercase tracking-wider">Consumer Policy</h3>
            <ul className="space-y-1.5 font-semibold text-[#f0f0f0]">
              <li><Link href="/cancellation-returns" className="hover:underline hover:text-white">Cancellation & Returns</Link></li>
              <li><Link href="/terms-of-uses" className="hover:underline hover:text-white">Terms of Uses</Link></li>
              <li><Link href="/privacy" className="hover:underline hover:text-white">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider Column */}
        {showRightSide && (
          <div className="hidden md:block md:col-span-1 border-l border-zinc-700 w-px h-full mx-auto" />
        )}

        {/* Right Side Addresses */}
        {showRightSide && (
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-zinc-300">
            {/* Mail Us */}
            {hasMail && (
              <div className="space-y-3">
                <h3 className="text-[#878787] text-[10px] font-bold uppercase tracking-wider">Mail Us:</h3>
                <p className="leading-relaxed text-[11px] text-zinc-400 whitespace-pre-line">
                  {settings.footerMailAddress}
                </p>
              </div>
            )}

            {/* Registered Office */}
            {hasOffice && (
              <div className="space-y-3">
                <h3 className="text-[#878787] text-[10px] font-bold uppercase tracking-wider">Registered Office Address:</h3>
                <p className="leading-relaxed text-[11px] text-zinc-400 whitespace-pre-line">
                  {settings.footerOfficeAddress}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-[#101824] border-t border-zinc-800 py-6 px-6 text-center">
        <div className="max-w-7xl mx-auto text-[11px] text-zinc-400 font-medium flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="mx-auto sm:mx-0">
            {copyrightText}
          </div>
          {hasSocials && (
            <div className="mx-auto sm:mx-0">
              <SocialsList />
            </div>
          )}
        </div>
      </div>

    </footer>
  );
}
