"use client";

import React, { useEffect, useState } from 'react';
import { Settings, Save, Loader2, RefreshCw, Upload, Plus, Trash } from 'lucide-react';
import { worldCurrencies } from '@/lib/currencies';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Reusable file uploader helper
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setUploading: (u: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUrl(data.url);
      } else {
        alert(data.error?.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  // Form states
  const [logoText, setLogoText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [footerText, setFooterText] = useState('');
  const [footerMailAddress, setFooterMailAddress] = useState('');
  const [footerOfficeAddress, setFooterOfficeAddress] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [logoDisplayType, setLogoDisplayType] = useState('both');
  const [banners, setBanners] = useState<any[]>([]);

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          handleUpdateSlide(index, 'imageUrl', data.url);
        }
      } else {
        alert('Image upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during upload.');
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      imageUrl: '',
      title: 'New Slider Headline',
      subtitle: 'Write your description details here.',
      buttonText: 'Explore Now',
      buttonLink: '/#catalog'
    };
    setBanners([...banners, newSlide]);
  };

  const handleRemoveSlide = (indexToRemove: number) => {
    setBanners(banners.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateSlide = (indexToUpdate: number, key: string, val: string) => {
    setBanners(
      banners.map((slide, idx) =>
        idx === indexToUpdate ? { ...slide, [key]: val } : slide
      )
    );
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/settings');
      if (res.ok) {
        const data = await res.json();
        const s = data.settings || {};
        setLogoText(s.logoText || 'TanimStore');
        setLogoUrl(s.logoUrl || '');
        setFaviconUrl(s.faviconUrl || '/favicon.ico');
        setSiteTitle(s.siteTitle || 'TanimStore - Premium E-Commerce Storefront');
        setSeoDescription(s.seoDescription || 'A secure, modern, and beautiful online shopping experience.');
        setFooterText(s.footerText || '');
        setFooterMailAddress(s.footerMailAddress || '');
        setFooterOfficeAddress(s.footerOfficeAddress || '');
        setSocialFacebook(s.socialFacebook || '');
        setSocialTwitter(s.socialTwitter || '');
        setSocialYoutube(s.socialYoutube || '');
        setSocialInstagram(s.socialInstagram || '');
        setCurrencyCode(s.currencyCode || 'USD');
        setLogoDisplayType(s.logoDisplayType || 'both');
        try {
          const parsed = JSON.parse(s.heroBanners || '[]');
          setBanners(parsed);
        } catch {
          setBanners([]);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      logoText,
      logoUrl,
      faviconUrl,
      siteTitle,
      seoDescription,
      footerText,
      footerMailAddress,
      footerOfficeAddress,
      socialFacebook,
      socialTwitter,
      socialYoutube,
      socialInstagram,
      currencyCode,
      logoDisplayType,
      heroBanners: JSON.stringify(banners),
    };

    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Settings updated successfully! The page will refresh to apply changes.');
        window.location.reload();
      } else {
        alert(data.error?.message || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-800" />
          Site Settings
        </h1>
        <p className="text-zinc-550 text-sm">Customize branding, browser headers, SEO descriptions, and footers.</p>
      </div>

      {loading ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm text-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading settings details...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Brand Customization */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Branding Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Logo Text */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logo Text *</label>
                <input
                  type="text"
                  required
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="e.g. TanimStore"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-semibold"
                />
              </div>

              {/* Logo Image URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logo Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-grow bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-mono"
                  />
                  <label className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    {uploadingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setLogoUrl, setUploadingLogo)}
                    />
                  </label>
                </div>
              </div>

              {/* Store Currency */}
              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Store Currency *</label>
                <select
                  required
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-semibold"
                >
                  {worldCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Select the main operating currency.
                </p>
              </div>

              {/* Logo & Title Display options */}
              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logo & Title Display Mode *</label>
                <select
                  required
                  value={logoDisplayType}
                  onChange={(e) => setLogoDisplayType(e.target.value)}
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-semibold"
                >
                  <option value="both">Both logo and Title</option>
                  <option value="logo">Only logo</option>
                  <option value="text">Only Title</option>
                </select>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Configure how the brand is represented in the website header.
                </p>
              </div>

            </div>
          </div>

          {/* Browser Tab, SEO & Metadata */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">SEO & Browser Configurations</h2>
            
            <div className="space-y-4">
              {/* Browser tab Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Website Title (Browser Header) *</label>
                <input
                  type="text"
                  required
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="e.g. TanimStore - Premium E-Commerce Storefront"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-semibold"
                />
              </div>

              {/* Favicon URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Browser Tab Icon (Favicon URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="e.g. /favicon.ico"
                    className="flex-grow bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-mono"
                  />
                  <label className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    {uploadingFavicon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setFaviconUrl, setUploadingFavicon)}
                    />
                  </label>
                </div>
              </div>

              {/* SEO Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SEO Meta Description *</label>
                <textarea
                  rows={3}
                  required
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="A secure, modern, and beautiful online shopping experience."
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Footer Customization</h2>
            
            {/* Footer Text */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Footer Copyright Text</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2026 TanimStore.com Inc. All rights reserved."
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
              />
            </div>

            {/* Footer Mail Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                <span>Mail Us Address (Optional)</span>
                <span className="text-[9px] text-zinc-400 font-medium normal-case">Leave blank to hide Mail column in footer</span>
              </label>
              <textarea
                rows={3}
                value={footerMailAddress}
                onChange={(e) => setFooterMailAddress(e.target.value)}
                placeholder="e.g. TanimStore Internet Private Limited,&#10;Buildings Alyssa, Begonia &amp;..."
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium font-mono"
              />
            </div>

            {/* Footer Office Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                <span>Registered Office Address (Optional)</span>
                <span className="text-[9px] text-zinc-400 font-medium normal-case">Leave blank to hide Office column in footer</span>
              </label>
              <textarea
                rows={4}
                value={footerOfficeAddress}
                onChange={(e) => setFooterOfficeAddress(e.target.value)}
                placeholder="e.g. TanimStore Internet Private Limited,&#10;CIN: U51109KA2012PTC066107..."
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium font-mono"
              />
            </div>

            {/* Social Media Link Inputs */}
            <div className="border-t border-zinc-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Social Links (Leave blank to hide in footer)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Facebook Link</label>
                  <input
                    type="text"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Twitter (X) Link</label>
                  <input
                    type="text"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">YouTube Link</label>
                  <input
                    type="text"
                    value={socialYoutube}
                    onChange={(e) => setSocialYoutube(e.target.value)}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Instagram Link</label>
                  <input
                    type="text"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Slider Settings */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Hero Banner Slides Manager</h2>
              <button
                type="button"
                onClick={handleAddSlide}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Slide
              </button>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Configure unlimited auto-rotating banners for your storefront homepage hero section. You can specify custom titles, descriptions, CTA buttons, links, and background images.
            </p>

            {banners.length === 0 ? (
              <div className="border border-dashed border-zinc-200 rounded-xl py-12 px-4 text-center text-zinc-400 text-xs">
                No custom banner slides configured. Will fallback to default platform slide.
              </div>
            ) : (
              <div className="space-y-4">
                {banners.map((slide, index) => (
                  <div key={slide.id || index} className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-4 relative">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Slide #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(index)}
                        className="text-red-500 hover:text-red-750 font-bold text-xs uppercase tracking-wider flex items-center gap-1"
                      >
                        <Trash className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Headline / Title *</label>
                        <input
                          type="text"
                          required
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                          placeholder="e.g. Elevate Your Space"
                          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-semibold"
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Description / Subtitle *</label>
                        <input
                          type="text"
                          required
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(index, 'subtitle', e.target.value)}
                          placeholder="Explore handpicked products..."
                          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-medium"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Slide Image (Optional - fallback to deep gradient if empty)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.imageUrl}
                            onChange={(e) => handleUpdateSlide(index, 'imageUrl', e.target.value)}
                            placeholder="https://example.com/slide1.png"
                            className="flex-grow bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                          />
                          <label className="bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 px-3.5 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSlideImageUpload(e, index)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Button Text */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">CTA Button Text *</label>
                        <input
                          type="text"
                          required
                          value={slide.buttonText}
                          onChange={(e) => handleUpdateSlide(index, 'buttonText', e.target.value)}
                          placeholder="e.g. Shop Now"
                          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-bold"
                        />
                      </div>

                      {/* Button Link */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">CTA Button Target Link *</label>
                        <input
                          type="text"
                          required
                          value={slide.buttonLink}
                          onChange={(e) => handleUpdateSlide(index, 'buttonLink', e.target.value)}
                          placeholder="e.g. /#catalog or /?category=electronics"
                          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={fetchSettings}
              disabled={saving}
              className="px-5 py-3 border border-zinc-200 hover:bg-zinc-100 hover:text-black rounded-lg text-xs uppercase tracking-wider font-extrabold text-zinc-500 bg-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Values
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 shadow cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  Save Settings
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
