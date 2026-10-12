"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User as UserIcon, 
  Mail, 
  ShieldAlert, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ShoppingBag, 
  Lock, 
  Settings,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, loading, apiFetch, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Add Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Sync profile details when user is loaded
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?callbackUrl=/account');
    }
  }, [user, loading, router]);

  // Fetch Saved Addresses
  const fetchAddresses = async () => {
    try {
      const res = await apiFetch('/api/v1/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error('Fetch addresses error:', e);
    } finally {
      setFetchingAddresses(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Profile Save Action
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      await updateProfile(profileName, profileEmail, profilePassword || undefined);
      setProfileSuccess(true);
      setProfilePassword('');
      setTimeout(() => setProfileSuccess(false), 5000);
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred while updating profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Save new address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressError(null);

    try {
      const res = await apiFetch('/api/v1/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line1,
          line2: line2 || undefined,
          city,
          state,
          postalCode,
          country,
          isDefault: addresses.length === 0,
        }),
      });

      if (res.ok) {
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setShowAddressForm(false);
        await fetchAddresses();
      } else {
        const err = await res.json();
        setAddressError(err.error?.message || 'Failed to save address.');
      }
    } catch (e) {
      setAddressError('Network error occurred.');
    } finally {
      setSavingAddress(false);
    }
  };

  // Set Default Address
  const handleSetDefault = async (id: string) => {
    try {
      const res = await apiFetch(`/api/v1/addresses/${id}`, {
        method: 'PUT',
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (e) {
      console.error('Set default address error:', e);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await apiFetch(`/api/v1/addresses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (e) {
      console.error('Delete address error:', e);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Account Settings...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 flex flex-col font-sans text-zinc-800">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="text-zinc-900">Account Dashboard</span>
        </div>

        {/* Profile Overview Card (Banner layout) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#172337] via-[#1f314d] to-zinc-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(243,168,71,0.15),transparent_45%)]" />
          <div className="relative z-10 flex gap-4 sm:gap-6 items-center">
            <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-black w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
              <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] bg-white/10 text-white font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-widest">
                Customer Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white mt-1">{user.name}</h1>
              <p className="text-zinc-300 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-zinc-400" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="bg-[#f3a847] hover:bg-[#e29b3c] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:-translate-y-0.5 text-center cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-black" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              href="/orders"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5 text-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>My Orders</span>
            </Link>
            <button
              onClick={() => logout()}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-extrabold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl text-center cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Personal Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#f3a847]" />
                  Profile Configuration
                </h2>
                <p className="text-zinc-400 text-xs mt-1">Change your name, email address, or update credentials.</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-50/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl px-4 py-2.5 text-xs outline-none text-black transition-all font-semibold"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-50/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl px-4 py-2.5 text-xs outline-none text-black transition-all font-medium font-mono"
                  />
                </div>

                {/* Password Change */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Lock className="w-3 h-3 text-zinc-400" />
                    <span>New Password</span>
                    <span className="text-[8px] text-zinc-400 font-medium normal-case ml-1">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full bg-zinc-50/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl px-4 py-2.5 text-xs outline-none text-black transition-all font-mono"
                  />
                </div>

                {profileError && (
                  <div className="text-xs bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl font-bold">
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 animate-bounce" />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full bg-[#172337] hover:bg-[#20314d] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {updatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <span>Save Profile Info</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Address Management Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#f3a847]" />
                    Delivery Addresses
                  </h2>
                  <p className="text-zinc-400 text-xs mt-1">Manage multiple addresses and select one as default.</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-zinc-100 hover:bg-[#f3a847] hover:text-black text-zinc-700 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddressForm ? 'Cancel' : 'New Address'}</span>
                </button>
              </div>

              {/* Add Address Form Toggle */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-150 animate-fade-in">
                  <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">Register Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={line1}
                        onChange={(e) => setLine1(e.target.value)}
                        placeholder="Flat No, Building, Street Name"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Address Line 2</label>
                      <input
                        type="text"
                        value={line2}
                        onChange={(e) => setLine2(e.target.value)}
                        placeholder="Landmark, Area, Suite (optional)"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 560103"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Country *</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg px-3 py-2 text-xs outline-none text-black transition-all"
                      />
                    </div>
                  </div>

                  {addressError && (
                    <div className="text-xs bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-lg font-bold">
                      {addressError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="bg-[#f3a847] hover:bg-[#e29b3c] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {savingAddress ? 'Saving address...' : 'Register Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {fetchingAddresses ? (
                <div className="py-12 flex flex-col items-center justify-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                  <span>Loading Addresses...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="border border-dashed border-zinc-200 rounded-2xl py-12 px-4 text-center text-zinc-400 text-xs">
                      No shipping addresses saved yet. Click "New Address" to set up your delivery destinations.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`border rounded-2xl p-5 relative flex gap-3.5 items-start transition-all bg-white hover:shadow-md ${
                            addr.isDefault 
                              ? 'border-[#f3a847] ring-1 ring-[#f3a847]/10' 
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${
                            addr.isDefault ? 'bg-[#f3a847]/15 text-[#e29b3c]' : 'bg-zinc-100 text-zinc-400'
                          }`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="text-xs space-y-1.5 font-medium text-zinc-600 flex-grow">
                            <div className="flex gap-2 items-center justify-between">
                              <span className="font-extrabold text-zinc-900 uppercase tracking-wide">Shipping Node</span>
                              {addr.isDefault && (
                                <span className="bg-amber-400 text-black text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="leading-snug text-zinc-800">{addr.line1}</p>
                            {addr.line2 && <p className="leading-snug text-zinc-500">{addr.line2}</p>}
                            <p className="text-zinc-800">{addr.city}, {addr.state} - {addr.postalCode}</p>
                            <p className="text-zinc-400 font-extrabold uppercase tracking-wider text-[8px]">{addr.country}</p>

                            {/* Actions controls */}
                            <div className="flex gap-4 pt-3.5 border-t border-zinc-100 mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(addr.id)}
                                  className="text-amber-500 hover:text-amber-600 cursor-pointer"
                                >
                                  Make Default
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
