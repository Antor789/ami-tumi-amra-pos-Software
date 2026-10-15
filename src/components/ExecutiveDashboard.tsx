import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  BarChart3,
  Globe,
  Store,
  Sparkles,
  Download,
  Truck,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Product, Order, AuthUser, OrderStatus } from '../types';
import { ProductImage } from './ProductImage';
import { AmiBrandLogo } from './AmiBrandLogo';
import { exportOrdersToCSV } from '../utils/csvExporter';

interface ExecutiveDashboardProps {
  products: Product[];
  orders: Order[];
  user: AuthUser;
  onQuickRestock: (productId: string, amount: number) => void;
  onNavigateToPOS: () => void;
  onNavigateToInventory: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

type ChartFilter = 'Daily' | 'Weekly' | 'Monthly';

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  products,
  orders,
  user,
  onQuickRestock,
  onNavigateToPOS,
  onNavigateToInventory,
  onUpdateOrderStatus,
}) => {
  const [chartFilter, setChartFilter] = useState<ChartFilter>('Daily');
  const isOwner = user.role === 'Business Owner';

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayOrders = useMemo(() => {
    return orders.filter(
      (o) => new Date(o.createdAt) >= todayStart && o.status !== 'Returned/Cancelled'
    );
  }, [orders, todayStart]);

  const todayRevenue = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + o.total, 0);
  }, [todayOrders]);

  const todayProfit = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + o.profit, 0);
  }, [todayOrders]);

  const todayProfitMargin = useMemo(() => {
    if (todayRevenue === 0) return 0;
    return Math.round((todayProfit / todayRevenue) * 100);
  }, [todayRevenue, todayProfit]);

  const todayPosOrdersCount = useMemo(() => {
    return todayOrders.filter((o) => o.channel === 'In-Store POS').length;
  }, [todayOrders]);

  const todayOnlineOrdersCount = useMemo(() => {
    return todayOrders.filter(
      (o) => o.channel === 'Zatiq Online' || o.channel === 'Facebook Page'
    ).length;
  }, [todayOrders]);

  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const weeklyOrders = useMemo(() => {
    return orders.filter(
      (o) => new Date(o.createdAt) >= sevenDaysAgo && o.status !== 'Returned/Cancelled'
    );
  }, [orders, sevenDaysAgo]);

  const weeklyRevenue = useMemo(() => {
    return weeklyOrders.reduce((sum, o) => sum + o.total, 0);
  }, [weeklyOrders]);

  const monthlyOrders = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orders.filter(
      (o) => new Date(o.createdAt) >= thirtyDaysAgo && o.status !== 'Returned/Cancelled'
    );
  }, [orders]);

  const monthlyRevenue = useMemo(() => {
    return monthlyOrders.reduce((sum, o) => sum + o.total, 0);
  }, [monthlyOrders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 5);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.stock === 0);
  }, [products]);

  const chartData = useMemo(() => {
    if (chartFilter === 'Daily') {
      const daysMap: { [key: string]: { day: string; Revenue: number; Profit: number; Orders: number } } = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        const key = d.toISOString().split('T')[0];
        daysMap[key] = { day: dayName, Revenue: 0, Profit: 0, Orders: 0 };
      }

      orders.forEach((o) => {
        if (o.status === 'Returned/Cancelled') return;
        const key = o.createdAt.split('T')[0];
        if (daysMap[key]) {
          daysMap[key].Revenue += o.total;
          daysMap[key].Profit += o.profit;
          daysMap[key].Orders += 1;
        }
      });

      return Object.values(daysMap);
    } else if (chartFilter === 'Weekly') {
      return [
        { day: 'Week 1', Revenue: 42000, Profit: 18500, Orders: 12 },
        { day: 'Week 2', Revenue: 58000, Profit: 24000, Orders: 16 },
        { day: 'Week 3', Revenue: 64000, Profit: 27500, Orders: 19 },
        { day: 'Week 4 (Current)', Revenue: weeklyRevenue, Profit: Math.round(weeklyRevenue * 0.42), Orders: weeklyOrders.length },
      ];
    } else {
      return [
        { day: 'May', Revenue: 180000, Profit: 75000, Orders: 45 },
        { day: 'Jun', Revenue: 210000, Profit: 88000, Orders: 54 },
        { day: 'Jul', Revenue: 195000, Profit: 82000, Orders: 49 },
        { day: 'Aug', Revenue: 240000, Profit: 102000, Orders: 62 },
        { day: 'Sep', Revenue: 280000, Profit: 118000, Orders: 71 },
        { day: 'Oct (Current)', Revenue: monthlyRevenue, Profit: Math.round(monthlyRevenue * 0.44), Orders: monthlyOrders.length },
      ];
    }
  }, [chartFilter, orders, weeklyRevenue, weeklyOrders.length, monthlyRevenue, monthlyOrders.length]);

  return (
    <div className="space-y-6">
      {/* Role Banner / Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm border border-slate-800">
        <div className="flex items-center gap-4">
          <AmiBrandLogo size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30">
                {user.role} Access
              </span>
              <span className="text-xs text-slate-400">Ami Tumi Amra Retail · Dhaka Flagship</span>
            </div>
            <h1 className="text-xl font-extrabold mt-1 tracking-tight">
              Ami Tumi Amra Executive Performance
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => exportOrdersToCSV(orders)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700"
            title="Download CSV report of all sales transactions"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Export Sales CSV
          </button>

          <button
            onClick={onNavigateToPOS}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Store className="w-4 h-4" />
            Open POS Terminal
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Revenue */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Revenue
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              ৳ {todayRevenue.toLocaleString('en-BD')}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            {isOwner ? (
              <>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  Est. Profit: <strong className="text-slate-800 dark:text-slate-200 font-semibold">৳ {todayProfit.toLocaleString('en-BD')}</strong>
                </span>
                <span className="px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-medium rounded text-[11px]">
                  {todayProfitMargin}% Margin
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> Profit Metrics (🔒 Owner Only)
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Today's Orders */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {todayOrders.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">active</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> POS: <strong>{todayPosOrdersCount}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Online: <strong>{todayOnlineOrdersCount}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Weekly vs Monthly Revenue */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Weekly / Monthly
            </span>
            <div className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">7 Days</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                ৳ {weeklyRevenue.toLocaleString('en-BD')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-semibold block">Month (30 Days)</span>
              <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                ৳ {monthlyRevenue.toLocaleString('en-BD')}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Avg Order: ৳ {todayOrders.length ? Math.round(todayRevenue / todayOrders.length) : 0}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">+24% MoM</span>
          </div>
        </div>

        {/* Card 4: Inventory Health */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inventory Health
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {products.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Active SKUs</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold rounded-md flex items-center gap-1">
              {lowStockProducts.length} Low Stock
            </span>
            {outOfStockProducts.length > 0 && (
              <span className="px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-md">
                {outOfStockProducts.length} Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Revenue & Profit Dynamics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative analysis of gross earnings (৳) across retail channels.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setChartFilter('Daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartFilter === 'Daily'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Daily (7 Days)
            </button>
            <button
              onClick={() => setChartFilter('Weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartFilter === 'Weekly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartFilter('Monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartFilter === 'Monthly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `৳${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                        <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-1">
                          {label}
                        </p>
                        <p className="text-cyan-400 font-medium">
                          Revenue: <strong className="text-white">৳ {payload[0]?.value?.toLocaleString('en-BD')}</strong>
                        </p>
                        {isOwner && payload[1] && (
                          <p className="text-emerald-400 font-medium">
                            Profit: <strong className="text-white">৳ {payload[1]?.value?.toLocaleString('en-BD')}</strong>
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#0284C7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
              {isOwner && (
                <Area
                  type="monotone"
                  dataKey="Profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Recent Orders & Courier Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update order delivery status. Changing to "Returned/Cancelled" automatically restores item stock!
              </p>
            </div>
            <button
              onClick={() => exportOrdersToCSV(orders)}
              className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Order Details</th>
                  <th className="py-2.5 px-3">Customer & Channel</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Total (৳)</th>
                  <th className="py-2.5 px-3 text-center">Status & Stock Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white font-mono">{order.id}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString('en-BD', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{order.customerName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded font-medium text-[10px] ${
                            order.channel === 'In-Store POS'
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {order.channel}
                        </span>
                        {order.deliveryArea && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {order.deliveryArea}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-md border border-slate-200 dark:border-slate-700">
                        {order.paymentMethod || 'Cash'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                      ৳ {order.total.toLocaleString('en-BD')}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className={`px-2.5 py-1 text-xs font-bold rounded-xl border focus:outline-none transition-colors ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : order.status === 'Pending Courier'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <option value="Completed">✓ Completed</option>
                        <option value="Pending Courier">🚚 Pending Courier</option>
                        <option value="Returned/Cancelled">↩ Returned/Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Critical Stock Alerts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Products requiring restock action (stock $\le 5$).</p>
            </div>
            <button
              onClick={onNavigateToInventory}
              className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              All Stock →
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
                All inventory levels are healthy! No restock alerts needed right now.
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      <ProductImage src={p.imageUrl} alt={p.name} category={p.category} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{p.sku}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            p.stock === 0
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} left`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickRestock(p.id, 10)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-2xs"
                    title="Quick add +10 items to inventory"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    +10
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
