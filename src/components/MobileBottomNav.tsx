import React from 'react';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import { ActiveTab, UserRole } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: UserRole;
  lowStockCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  role,
  lowStockCount,
}) => {
  const isCashier = role === 'POS Cashier';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#070B15]/95 backdrop-blur-xl border-t border-cyan-500/20 shadow-2xl px-3 py-2 flex items-center justify-around text-white">
      {!isCashier && (
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-cyan-400 bg-cyan-500/10 font-bold border border-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Dashboard</span>
        </button>
      )}

      <button
        onClick={() => setActiveTab('inventory')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 px-2 rounded-xl transition-all relative ${
          activeTab === 'inventory'
            ? 'text-cyan-400 bg-cyan-500/10 font-bold border border-cyan-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">Inventory</span>
        {lowStockCount > 0 && (
          <span className="absolute top-0.5 right-2 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full animate-pulse">
            {lowStockCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('pos')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
          activeTab === 'pos'
            ? 'text-emerald-400 bg-emerald-500/10 font-bold border border-emerald-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">POS Terminal</span>
      </button>
    </div>
  );
};
