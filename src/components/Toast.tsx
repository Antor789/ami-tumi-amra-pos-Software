import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/95 text-emerald-50 border-emerald-700',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-900/95 text-amber-50 border-amber-700',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-900/95 text-rose-50 border-rose-700',
          icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/95 text-slate-50 border-slate-700',
          icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
        };
    }
  };

  const { bg, icon } = getStyles();

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 animate-slide-up ${bg}`}>
      {icon}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold leading-tight">{toast.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
