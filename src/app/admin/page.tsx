import React from 'react';
import { prisma } from '@/lib/prisma';
import { DollarSign, ShoppingBag, FolderOpen, Users, ArrowUpRight } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { formatPrice } from '@/lib/currency';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const settings = await getSettings();
  const currency = settings.currencyCode || 'USD';

  // Fetch metrics in parallel on the server
  const [
    totalRevenueResult,
    totalOrders,
    activeProducts,
    totalCustomers,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
      },
      _sum: {
        total: true,
      },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.total?.toNumber() || 0;

  const cardStats = [
    { name: 'Total Revenue', value: formatPrice(totalRevenue, currency), icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-605' },
    { name: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-605' },
    { name: 'Active Products', value: activeProducts.toString(), icon: FolderOpen, color: 'bg-amber-500/10 text-amber-605' },
    { name: 'Total Customers', value: totalCustomers.toString(), icon: Users, color: 'bg-indigo-500/10 text-indigo-605' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Dashboard Overview</h1>
        <p className="text-zinc-500 text-sm">Welcome back. Here is the active storefront status.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{stat.name}</span>
                <span className="text-2xl font-extrabold text-zinc-900">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Recent Orders</h2>
            <Link href="/" className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1">
              Storefront <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-grow overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200">
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">{order.user?.name || 'Guest User'}</span>
                          <span className="text-[10px] text-zinc-400 font-medium leading-none mt-0.5">{order.user?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'PAID' || order.status === 'DELIVERED'
                            ? 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                            : order.status === 'PENDING'
                            ? 'bg-amber-50 border border-amber-250 text-amber-750'
                            : 'bg-zinc-50 border border-zinc-200 text-zinc-700'
                        }`}>
                          {order.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-zinc-950">{formatPrice(Number(order.total), currency)}</td>
                      <td className="px-5 py-4 text-right text-zinc-405 text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-zinc-400">No orders placed yet.</div>
            )}
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Recently Added</h2>
            <Link href="/admin/products" className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1">
              All Products <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-grow divide-y divide-zinc-100">
            {recentProducts.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {recentProducts.map((prod) => {
                  let imgUrl = '/images/placeholder.jpg';
                  try {
                    const parsed = JSON.parse(prod.images as string || '[]');
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      imgUrl = parsed[0];
                    }
                  } catch (e) {}

                  return (
                    <div key={prod.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
                          <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900 line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5 leading-none font-medium">{prod.category?.name || 'Uncategorized'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-zinc-900">{formatPrice(Number(prod.price), currency)}</span>
                        <span className={`text-[9px] font-bold mt-1 ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400">No products added yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
