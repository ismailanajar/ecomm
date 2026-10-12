"use client";

import React, { useEffect, useState } from 'react';
import { FolderTree, Loader2, Save, X, Edit2, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  
  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(autoSlug);
  };

  const handleEditClick = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSubmitting(true);
    const isEdit = !!editingId;
    const url = isEdit ? `/api/v1/admin/categories/${editingId}` : '/api/v1/admin/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setSlug('');
        setEditingId(null);
        fetchCategories();
      } else {
        alert(data.error?.message || 'Failed to save category.');
      }
    } catch (err) {
      console.error('Save category error:', err);
      alert('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if there are products in it.')) return;

    try {
      const res = await fetch(`/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        fetchCategories();
      } else {
        alert(data.error?.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('Delete category error:', err);
      alert('An error occurred while deleting.');
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Manage Categories</h1>
        <p className="text-zinc-550 text-sm">Create and modify departments for product categorization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Category Form Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-100 pb-2">
            {editingId ? 'Edit Category' : 'Create Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Home"
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3.5 py-2 text-xs outline-none text-black font-semibold"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. smart-home"
                className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3.5 py-2 text-xs outline-none text-black font-mono font-bold"
              />
            </div>

            {/* Submit buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-grow bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-zinc-150 hover:bg-zinc-200 border border-zinc-200 text-zinc-650 font-extrabold text-[10px] uppercase tracking-wider px-3 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List Table */}
        <div className="md:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Loading categories list...</span>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200">
                    <th className="px-5 py-3">Department Name</th>
                    <th className="px-5 py-3">Slug (URL Route)</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-bold text-zinc-700">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-2 font-black text-zinc-900 text-sm">
                        <FolderTree className="w-4 h-4 text-zinc-400" />
                        {cat.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-zinc-450 font-medium">{cat.slug}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Department"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Department"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-400 font-medium">
              No categories created yet. Use the form to make your first department.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
