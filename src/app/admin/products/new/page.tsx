"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Upload } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<string[]>(['']);
  
  // Variants state
  const [variants, setVariants] = useState<any[]>([]);
  const [uploadingIndices, setUploadingIndices] = useState<Record<number, boolean>>({});

  // Reusable image uploader helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndices((prev) => ({ ...prev, [index]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        handleImageChange(index, data.url);
      } else {
        alert(data.error?.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('An error occurred during file upload.');
    } finally {
      setUploadingIndices((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Fetch categories
  useEffect(() => {
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err))
      .finally(() => setFetchingCategories(false));
  }, []);

  // Auto slug generation
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to hyphens
      .replace(/-+/g, '-'); // trim double hyphens
    setSlug(autoSlug);
  };

  // Image helpers
  const handleImageChange = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => {
    if (images.length === 1) {
      setImages(['']);
    } else {
      setImages(images.filter((_, idx) => idx !== index));
    }
  };

  // Variant helpers
  const addVariantField = () => {
    setVariants([...variants, { name: '', sku: '', priceDelta: '0.00', stock: '0' }]);
  };

  const updateVariantField = (index: number, key: string, val: string) => {
    const updated = [...variants];
    updated[index][key] = val;
    setVariants(updated);
  };

  const removeVariantField = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !price || !categoryId) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    // Filter empty image URLs
    const filteredImages = images.filter((img) => img.trim() !== '');

    const payload = {
      name,
      slug,
      brand: brand || null,
      categoryId,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      stock: parseInt(stock, 10) || 0,
      isActive,
      images: filteredImages,
      variants: variants.map((v) => ({
        name: v.name,
        sku: v.sku,
        priceDelta: parseFloat(v.priceDelta) || 0,
        stock: parseInt(v.stock, 10) || 0,
      })),
    };

    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/products');
      } else {
        alert(data.error?.message || 'Failed to create product.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred while creating the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-sans">
      {/* Navigation & Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 border border-zinc-200 hover:bg-zinc-100 hover:text-black rounded-lg transition-colors bg-white text-zinc-500 inline-block"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-black text-zinc-900">Add New Product</h1>
          <p className="text-zinc-450 text-xs font-semibold uppercase tracking-wider">Catalog Entry Creation</p>
        </div>
      </div>

      {fetchingCategories ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading categories...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Product Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apex Phone 15 Pro"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product Slug (URL Path) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. apex-phone-15-pro"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-mono"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Brand / Seller</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. ApexCorp"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Department Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all cursor-pointer font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product details, specs, features..."
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
              />
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Customer Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>

              {/* Compare At Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Compare-At / Retail Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-medium"
                />
              </div>
            </div>

            {/* Visibility checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-amber-500 border-zinc-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-zinc-700 uppercase tracking-wide cursor-pointer">
                Publish Product (Make visible on store homepage)
              </label>
            </div>
          </div>

          {/* Product Images Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Product Images</h2>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-amber-600 hover:text-amber-700 font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>

            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-400 w-12 text-right shrink-0">URL #{index + 1}</span>
                  <div className="flex-grow flex gap-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                      className="flex-grow bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none text-black transition-all font-mono"
                    />
                    <label className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                      {uploadingIndices[index] ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2.5 text-zinc-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Variants Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Product Variants</h2>
                <span className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5 leading-none">Optional: e.g. sizes, colors, capacities</span>
              </div>
              <button
                type="button"
                onClick={addVariantField}
                className="text-xs text-amber-600 hover:text-amber-700 font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            {variants.length > 0 ? (
              <div className="space-y-4">
                {variants.map((v, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-4 bg-zinc-50 border border-zinc-200 rounded-lg relative">
                    {/* Variant Name */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Variant Name *</label>
                      <input
                        type="text"
                        required
                        value={v.name}
                        onChange={(e) => updateVariantField(index, 'name', e.target.value)}
                        placeholder="e.g. Titanium Gray / 128GB"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-md px-3 py-1.5 text-xs outline-none text-black font-medium"
                      />
                    </div>

                    {/* SKU */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">SKU Code *</label>
                      <input
                        type="text"
                        required
                        value={v.sku}
                        onChange={(e) => updateVariantField(index, 'sku', e.target.value)}
                        placeholder="e.g. AP-15P-TG-128"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-md px-3 py-1.5 text-xs outline-none text-black font-mono"
                      />
                    </div>

                    {/* Price Delta */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Price Delta ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={v.priceDelta}
                        onChange={(e) => updateVariantField(index, 'priceDelta', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-md px-3 py-1.5 text-xs outline-none text-black font-medium"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Stock Qty *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={v.stock}
                        onChange={(e) => updateVariantField(index, 'stock', e.target.value)}
                        placeholder="0"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-md px-3 py-1.5 text-xs outline-none text-black font-medium"
                      />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeVariantField(index)}
                      className="absolute right-2 top-2 p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-xs border border-dashed border-zinc-200 rounded-lg font-medium">
                No variants configured. Product sells under base configuration.
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-zinc-200 hover:bg-zinc-150 hover:text-black rounded-lg text-xs uppercase tracking-wider font-extrabold text-zinc-505 bg-white inline-block"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 shadow cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  Save Product
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
