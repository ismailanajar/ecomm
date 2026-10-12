"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Search, ShieldCheck, User, Trash2, Loader2, ArrowLeftRight } from 'lucide-react';

export default function AdminCustomersPage() {
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleRole = async (targetUser: any) => {
    if (targetUser.id === currentUser?.id) {
      alert('You cannot demote yourself from the admin console.');
      return;
    }

    const nextRole = targetUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      setActionId(targetUser.id);
      const res = await fetch(`/api/v1/admin/customers/${targetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json();
      if (res.ok) {
        setCustomers(customers.map((c) => (c.id === targetUser.id ? { ...c, role: nextRole } : c)));
      } else {
        alert(data.error?.message || 'Failed to update user role.');
      }
    } catch (err) {
      console.error('Toggle role error:', err);
      alert('An error occurred.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!confirm('Are you sure you want to delete this customer? This action is permanent and will delete their addresses, reviews, and shopping logs.')) return;

    try {
      setActionId(id);
      const res = await fetch(`/api/v1/admin/customers/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert(data.error?.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('An error occurred.');
    } finally {
      setActionId(null);
    }
  };

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Manage Customers</h1>
        <p className="text-zinc-550 text-sm">View user accounts, adjust roles, or delete registers.</p>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Filter users by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all shadow-sm text-black"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      </div>

      {/* Datatable */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading user directory...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Status / Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-50 transition-colors">
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm ${
                          cust.role === 'ADMIN' ? 'bg-amber-500' : 'bg-zinc-400'
                        }`}>
                          {cust.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-950 text-sm">{cust.name}</span>
                          <span className="text-[10px] text-zinc-400 font-semibold">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status/Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        cust.role === 'ADMIN'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                      }`}>
                        {cust.role === 'ADMIN' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-amber-600" /> Admin
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-zinc-500" /> Customer
                          </>
                        )}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-zinc-400 font-medium">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleToggleRole(cust)}
                          disabled={actionId === cust.id || cust.id === currentUser?.id}
                          className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-55 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                          title="Change Role"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id)}
                          disabled={actionId === cust.id || cust.id === currentUser?.id}
                          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-55 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <Users className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-zinc-700 text-sm font-bold uppercase">No matching users found</h3>
            <p className="text-xs text-zinc-400 font-medium">Verify search keywords and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
