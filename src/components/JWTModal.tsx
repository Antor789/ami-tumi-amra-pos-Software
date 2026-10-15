import React, { useState, useEffect } from 'react';
import { Key, Shield, Copy, Check, X, Clock, Terminal, Lock } from 'lucide-react';
import { AuthUser } from '../types';
import { decodeJWT } from '../utils/jwtHelper';

interface JWTModalProps {
  user: AuthUser | null;
  onClose: () => void;
}

export const JWTModal: React.FC<JWTModalProps> = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('07h 59m 59s');

  if (!user || !user.token) return null;

  const decoded = decodeJWT(user.token);

  useEffect(() => {
    if (!decoded?.payload?.exp) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = decoded.payload.exp - now;

      if (diff <= 0) {
        setTimeRemaining('Session Expired');
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}h ${minutes
            .toString()
            .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [decoded]);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parts = user.token.split('.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0B0F19] text-white rounded-3xl shadow-2xl max-w-2xl w-full border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Live JWT Session Inspector
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full border border-emerald-500/30">
                  SECURE Bearer Token
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Active RBAC claims & Base64URL JWT payload for {user.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {/* Expiry Countdown & Role Summary */}
          <div className="p-4 bg-cyan-950/30 rounded-2xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Session Validity:</span>
              <span className="text-white font-mono bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-700/50">
                {timeRemaining}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Role Claim:</span>
              <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {user.role}
              </span>
            </div>
          </div>

          {/* Raw JWT Token Display (Color-Coded Header, Payload, Signature) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Encoded Raw JWT String
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg transition-colors text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Token'}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 break-all font-mono text-[11px] leading-relaxed">
              <span className="text-rose-400">{parts[0]}</span>
              <span className="text-slate-500">.</span>
              <span className="text-cyan-300">{parts[1]}</span>
              <span className="text-slate-500">.</span>
              <span className="text-emerald-400">{parts[2]}</span>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-2">
              <span className="text-rose-400">■ Header</span>
              <span className="text-cyan-300">■ Payload Claims</span>
              <span className="text-emerald-400">■ Signature</span>
            </p>
          </div>

          {/* Decoded Claims Payload */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Decoded Payload JSON (`claims`)
            </span>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(decoded?.payload || {}, null, 2)}
            </pre>
          </div>

          {/* RBAC Permissions Grid */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Assigned Permissions Scope ({user.permissions.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-0.5 bg-slate-900 text-cyan-300 rounded border border-cyan-500/20 text-[10px] font-mono"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
