"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ClipboardCheck, 
  Search, 
  Eye, 
  Loader2, 
  X, 
  Check, 
  Truck, 
  TrendingUp, 
  User, 
  CreditCard,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';

interface OrderItem {
  id: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string | null;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  stripePaymentIntentId: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { apiFetch, currency } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/v1/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Fetch admin orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await apiFetch('/api/v1/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        // Refresh local orders list
        await fetchOrders();
        // Update selected order modal if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        const err = await res.json();
        alert(err.error?.message || 'Failed to update status.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error occurred.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Safe intent parser to read shipping address
  const parseIntent = (intentStr: string | null) => {
    if (!intentStr) return { paymentMethod: 'N/A', shippingAddress: null };
    try {
      const parsed = JSON.parse(intentStr);
      if (parsed && typeof parsed === 'object') {
        return {
          paymentMethod: parsed.paymentMethod || 'COD (Cash on Delivery)',
          shippingAddress: parsed.shippingAddress || null,
        };
      }
    } catch (e) {}
    return { paymentMethod: intentStr, shippingAddress: null };
  };

  // Filter orders by search query and status tab
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 border border-amber-250 text-amber-800';
      case 'PAID':
        return 'bg-blue-50 border border-blue-250 text-blue-800';
      case 'SHIPPED':
        return 'bg-indigo-50 border border-indigo-250 text-indigo-800';
      case 'DELIVERED':
        return 'bg-emerald-50 border border-emerald-250 text-emerald-800';
      case 'CANCELLED':
        return 'bg-red-50 border border-red-250 text-red-800';
      default:
        return 'bg-zinc-50 border border-zinc-200 text-zinc-800';
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-[#f3a847]" />
            Orders Management
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Review orders history, track fulfillment statuses, and process shipping.</p>
        </div>
      </div>

      {/* Filters & Search Grid */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center md:justify-between md:space-y-0 gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, name, or email..."
            className="w-full bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none text-black transition-all"
          />
        </div>

        {/* Tabs Filter */}
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Retrieving orders list...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-24 text-center text-zinc-400 text-sm">No orders matching your criteria found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200">
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {filteredOrders.map((order) => {
                  const intent = parseIntent(order.stripePaymentIntentId);
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-zinc-900 truncate max-w-[140px]">{order.id}</span>
                          <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">{order.user?.name || 'Guest Checkout'}</span>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5">{order.user?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 text-zinc-650 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                          {intent.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-950 text-sm">
                          {formatPrice(Number(order.total), currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {/* Order Detail Modal */}
      {selectedOrder && (() => {
        const intent = parseIntent(selectedOrder.stripePaymentIntentId);
        const isCOD = intent.paymentMethod === 'COD';
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative select-none">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-[#172337] text-white">
                <div className="space-y-1">
                  <span className="text-[9px] bg-white/10 text-white font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest">
                    Order Details Node
                  </span>
                  <h3 className="text-base font-black tracking-tight text-white mt-1">ID: {selectedOrder.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/60 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                
                {/* Order Status Badge & Meta */}
                <div className="flex flex-wrap justify-between items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Current Status:</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-zinc-400 text-[10px] font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Customer & Shipping Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Customer info */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Customer Profile
                    </h4>
                    <div className="text-xs space-y-1 bg-zinc-50/50 border border-zinc-150 p-4 rounded-xl font-medium">
                      <p className="font-bold text-zinc-900">{selectedOrder.user?.name || 'Guest Checkout'}</p>
                      <p className="text-zinc-500 font-mono text-[10px]">{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Delivery address snapshot */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      Fulfillment Destination
                    </h4>
                    <div className="text-xs space-y-1 bg-zinc-50/50 border border-zinc-150 p-4 rounded-xl font-medium text-zinc-650">
                      {(() => {
                        if (intent.shippingAddress) {
                          const addr = intent.shippingAddress;
                          return (
                            <>
                              <p className="font-bold text-zinc-800">{addr.line1}</p>
                              {addr.line2 && <p>{addr.line2}</p>}
                              <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                              <p className="text-zinc-400 font-black uppercase tracking-wider text-[8px] mt-1">{addr.country}</p>
                            </>
                          );
                        }
                        return <p className="italic text-zinc-400">No snapshot of shipping address stored on intent.</p>;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Order Items ({selectedOrder.items.length})
                  </h4>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 text-[9px]">
                          <th className="px-4 py-2">Product Name</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-medium">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50/30">
                            <td className="px-4 py-3 font-bold text-zinc-900">{item.nameSnapshot}</td>
                            <td className="px-4 py-3 text-center text-zinc-650">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-zinc-650">{formatPrice(Number(item.priceSnapshot), currency)}</td>
                            <td className="px-4 py-3 text-right font-bold text-zinc-950">{formatPrice(Number(item.priceSnapshot) * item.quantity, currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="w-full max-w-xs ml-auto space-y-1.5 text-xs font-semibold text-zinc-600 border-t border-zinc-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(Number(selectedOrder.subtotal), currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>{formatPrice(Number(selectedOrder.tax), currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shipping === 0 ? 'Free' : formatPrice(Number(selectedOrder.shipping), currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-dashed border-zinc-200">
                    <span>Grand Total:</span>
                    <span>{formatPrice(Number(selectedOrder.total), currency)}</span>
                  </div>
                </div>

              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex flex-wrap gap-2.5 items-center justify-between">
                <div>
                  {updatingId === selectedOrder.id && (
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                      Updating Status...
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {/* 1. Pending Status Actions */}
                  {selectedOrder.status === 'PENDING' && (
                    <>
                      {isCOD ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                          disabled={updatingId !== null}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-colors animate-pulse"
                        >
                          <Truck className="w-3.5 h-3.5" /> Ship COD Order
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'PAID')}
                          disabled={updatingId !== null}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1 shadow cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm Payment
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                        disabled={updatingId !== null}
                        className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1 shadow cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    </>
                  )}

                  {/* 2. Paid Status Actions */}
                  {selectedOrder.status === 'PAID' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                        disabled={updatingId !== null}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" /> Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                        disabled={updatingId !== null}
                        className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1 shadow cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    </>
                  )}

                  {/* 3. Shipped Status Actions */}
                  {selectedOrder.status === 'SHIPPED' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                        disabled={updatingId !== null}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> {isCOD ? 'Deliver & Collect Cash' : 'Mark as Delivered'}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                        disabled={updatingId !== null}
                        className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1 shadow cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    </>
                  )}

                  {/* 4. Complete / Cancelled Status Dismiss button */}
                  {(selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED') && (
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-extrabold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Dismiss Details
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
