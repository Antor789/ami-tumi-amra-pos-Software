import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { AuthUser } from '../types';
import { DEMO_ROLES, generateJWT } from '../utils/jwtHelper';
import { AmiBrandLogo } from './AmiBrandLogo';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [email, setEmail] = useState('owner@amitumiamra.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);

  const handlePerformLogin = (
    roleKey: 'owner' | 'manager' | 'cashier',
    customEmail?: string
  ) => {
    setIsAuthenticating(true);
    setSelectedRoleKey(roleKey);

    setTimeout(() => {
      const roleDef = DEMO_ROLES[roleKey];
      const token = generateJWT(
        roleDef.id,
        roleDef.name,
        customEmail || roleDef.email,
        roleDef.role,
        roleDef.permissions
      );

      const user: AuthUser = {
        id: roleDef.id,
        name: roleDef.name,
        email: customEmail || roleDef.email,
        role: roleDef.role,
        permissions: roleDef.permissions,
        token,
      };

      setIsAuthenticating(false);
      onLoginSuccess(user);
    }, 450);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('manager')) handlePerformLogin('manager', email);
    else if (email.includes('cashier')) handlePerformLogin('cashier', email);
    else handlePerformLogin('owner', email);
  };

  const handlePinKeyClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '8888') handlePerformLogin('owner');
        else if (nextPin === '1234') handlePerformLogin('manager');
        else handlePerformLogin('cashier');
      }
    }
  };

  const handleClearPin = () => setPin('');

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Aurora Glows */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Panel: Desktop Brand Showcase (55% Width / 7 Cols) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <AmiBrandLogo size="lg" />
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold rounded-full flex items-center gap-2 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  LIVE CLOUD POS & INVENTORY v2.4
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Command Your E-Commerce & Retail Empire{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  in Real Time.
                </span>
              </h1>

              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Unified Bangladeshi retail management connecting POS counters, Zatiq Website storefronts, and Facebook Page orders with instantaneous inventory stock deduction and JWT RBAC access control.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:border-cyan-500/40 transition-all space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">⚡ Zatiq & POS Live Sync</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stock decrements across all devices within 100ms of POS checkout.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real-Time BDT Sync
                </div>
              </div>

              <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:border-cyan-500/40 transition-all space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Key className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">🔒 Enterprise RBAC & JWT</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Scoped access for Business Owners, Store Managers, and POS Cashiers.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-cyan-300 font-mono">
                  <KeyRound className="w-3.5 h-3.5" /> HS256 Signed Tokens
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Ami Tumi Amra Retail Ecosystem • Powered by Real-Time Cloud Sync
            </p>
          </div>

          {/* Mobile Condensed Top Header (< lg) */}
          <div className="lg:hidden text-center space-y-3 mb-2">
            <AmiBrandLogo size="lg" className="mx-auto" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Ami Tumi Amra POS Portal
            </h1>
            <p className="text-xs text-slate-400">
              Select an instant demo role or enter staff credentials below.
            </p>
          </div>

          {/* Right Panel / Mobile Main Login Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.18)] rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 relative overflow-hidden">
              {/* Authenticating Loading Overlay */}
              {isAuthenticating && (
                <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 animate-fade-in">
                  <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-cyan-300 tracking-wide animate-pulse">
                    Authenticating & Minting JWT Session...
                  </span>
                </div>
              )}

              {/* Card Title */}
              <div className="hidden lg:block space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Sign in to Workspace</h2>
                <p className="text-xs text-slate-400">
                  Enter your credentials or select an instant role demo below.
                </p>
              </div>

              {/* Auth Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all ${
                    authMode === 'password'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('pin')}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all ${
                    authMode === 'pin'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4-Digit Staff PIN Pad
                </button>
              </div>

              {/* Auth Mode A: Email & Password Form */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@amitumiamra.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
                  >
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Auth Mode B: Interactive PIN Pad */
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2">Enter 4-Digit Staff Access PIN</p>
                    <div className="flex items-center justify-center gap-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-bold font-mono transition-all ${
                            pin.length > idx
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}
                        >
                          {pin.length > idx ? '●' : ''}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">
                      PIN Hints: Owner (8888) | Manager (1234) | Cashier (0000)
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', '✓'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === 'CLR') handleClearPin();
                          else if (key === '✓') {
                            if (pin === '8888') handlePerformLogin('owner');
                            else if (pin === '1234') handlePerformLogin('manager');
                            else handlePerformLogin('cashier');
                          } else handlePinKeyClick(key);
                        }}
                        className={`h-11 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center ${
                          key === 'CLR'
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/50'
                            : key === '✓'
                            ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative pt-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-[#0B0F19] px-2 text-slate-500">
                    OR INSTANT DEMO LOGIN (RBAC PREVIEW)
                  </span>
                </div>
              </div>

              {/* 3 Interactive Glassmorphic Role Cards */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handlePerformLogin('owner')}
                  className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white group-hover:text-cyan-300">
                        👑 Business Owner
                      </span>
                      <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[9px] font-mono font-bold">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Net Profit, Cost Price, Monthly Revenue, Zatiq Sync & Full Inventory.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 mt-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handlePerformLogin('manager')}
                  className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white group-hover:text-amber-300">
                        📦 Store Manager
                      </span>
                      <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-mono font-bold">
                        MANAGER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Update Stock & Media, Manage Orders. Net Profit locked.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 mt-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handlePerformLogin('cashier')}
                  className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-left transition-all group flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white group-hover:text-purple-300">
                        🛒 POS Cashier
                      </span>
                      <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded text-[9px] font-mono font-bold">
                        CASHIER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Create POS/Online Orders & Print Receipts. Dashboard locked.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 shrink-0 mt-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
