"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/currency';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { currency } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also remove its variants.')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error?.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.category?.name && p.category.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Manage Products</h1>
          <p className="text-zinc-550 text-sm">Add, modify, or archive items in your catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider px-4 py-3 rounded-lg flex items-center gap-2 shadow transition-all shrink-0 justify-center"
        >
          <Plus className="w-4 h-4 text-black" />
          Add Product
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Filter products by name, brand, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all shadow-sm text-black"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      </div>

      {/* Datatable */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading products list...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                {filteredProducts.map((prod) => {
                  let imgUrl = '/images/placeholder.jpg';
                  try {
                    const parsed = JSON.parse(prod.images as string || '[]');
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      imgUrl = parsed[0];
                    }
                  } catch (e) {}

                  return (
                    <tr key={prod.id} className="hover:bg-zinc-50 transition-colors">
                      {/* Item Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
                            <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-950 text-sm line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                              {prod.brand || 'No Brand'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department Column */}
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                          {prod.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-950 text-sm">{formatPrice(prod.price, currency)}</span>
                          {prod.compareAtPrice && (
                            <span className="text-[10px] text-zinc-400 line-through">
                              {formatPrice(prod.compareAtPrice, currency)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Column */}
                      <td className="px-6 py-4">
                        <span className={`font-bold ${prod.stock > 0 ? 'text-zinc-900' : 'text-rose-600'}`}>
                          {prod.stock} items
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          prod.isActive
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                        }`}>
                          {prod.isActive ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Archived
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            href={`/admin/products/${prod.id}`}
                            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors inline-block"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            disabled={deletingId === prod.id}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <Plus className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-zinc-700 text-sm font-bold uppercase">No matching products found</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">Try refining your filter or click "Add Product" to create your first catalog entry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
