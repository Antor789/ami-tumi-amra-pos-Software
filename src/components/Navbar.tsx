import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  Key,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { ActiveTab, AuthUser, ThemeMode } from '../types';
import { AmiBrandLogo } from './AmiBrandLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: AuthUser;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenJWTModal: () => void;
  onLogout: () => void;
  onResetData: () => void;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  theme,
  onToggleTheme,
  onOpenJWTModal,
  onLogout,
  onResetData,
  lowStockCount,
}) => {
  const isCashier = user.role === 'POS Cashier';

  return (
    <header className="sticky top-0 z-40 bg-[#070B15]/95 dark:bg-[#070B15]/95 text-white border-b border-cyan-500/20 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <AmiBrandLogo size="md" showTagline />

          {/* Live Sync Badge - Desktop only */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-[11px] font-medium border border-cyan-500/20 ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="whitespace-nowrap">Live Sync Active</span>
          </div>
        </div>

        {/* View Tabs Navigation - DESKTOP ONLY (>= lg / 1024px) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {!isCashier && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Executive Dashboard</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap relative ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Manager</span>
            {lowStockCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
              activeTab === 'pos'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>POS Terminal</span>
          </button>
        </nav>

        {/* Right Controls Zone: Responsive controls for all breakpoints */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 sm:px-2.5 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-amber-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-cyan-300">Dark</span>
              </>
            )}
          </button>

          {/* JWT Session Inspector Button */}
          <button
            onClick={onOpenJWTModal}
            className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            title="Inspect Live Decoded JWT Session & Scoped RBAC Claims"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">🔑 JWT</span>
          </button>

          {/* User Role Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-800">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                user.role === 'Business Owner'
                  ? 'bg-cyan-400'
                  : user.role === 'Store Manager'
                  ? 'bg-amber-400'
                  : 'bg-purple-400'
              }`}
            />
            <span className="text-[11px] font-bold text-white whitespace-nowrap">{user.role}</span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="p-2 sm:px-2.5 sm:py-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Sign out or switch workspace role"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset to default seed data"
            className="hidden sm:flex p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
