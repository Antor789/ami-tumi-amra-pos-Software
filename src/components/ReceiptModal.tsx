import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { AmiLogo } from './AmiLogo';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Transaction Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs font-sans print:p-0 print:shadow-none">
          {/* Store Info Header */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
            <AmiLogo size="lg" className="mx-auto mb-1" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              AMI TUMI AMRA RETAIL
            </h2>
            <p className="text-[11px] text-slate-500">Dhaka Flagship Store #01 · Bangladesh</p>
            <p className="text-[10px] text-slate-400 font-mono">VAT Reg: BD-9842109-2026</p>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 border-b border-dashed border-slate-300 pb-3 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice Number:</span>
              <span className="font-mono font-bold text-slate-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sales Channel:</span>
              <span className="font-semibold text-indigo-600">{order.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-medium text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone:</span>
              <span className="font-mono text-slate-700">{order.customerPhone}</span>
            </div>
            {order.customerAddress && (
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500 shrink-0 mr-2">Address:</span>
                <span className="text-right text-slate-800 font-medium">{order.customerAddress}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="text-slate-700">
                {new Date(order.createdAt).toLocaleString('en-BD')}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price (৳)</th>
                  <th className="py-1 text-right">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium text-slate-900 max-w-[140px] truncate">
                      {item.productName}
                    </td>
                    <td className="py-2 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="py-2 text-right text-slate-600 tabular-nums">
                      {item.price.toLocaleString('en-BD')}
                    </td>
                    <td className="py-2 text-right font-bold text-slate-900 tabular-nums">
                      {(item.price * item.quantity).toLocaleString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-dashed border-slate-300 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                ৳ {order.subtotal.toLocaleString('en-BD')}
              </span>
            </div>

            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-indigo-600 font-medium">
                <span>Delivery Charge ({order.deliveryArea}):</span>
                <span className="tabular-nums">+৳ {order.deliveryFee}</span>
              </div>
            )}

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied:</span>
                <span className="font-bold tabular-nums">-৳ {order.discount.toLocaleString('en-BD')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-sm">
              <span className="text-slate-900">Total Paid (৳):</span>
              <span className="text-indigo-600 text-base tabular-nums">
                ৳ {order.total.toLocaleString('en-BD')}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-[10px] text-slate-400 border-t border-dashed border-slate-200 space-y-0.5">
            <p>Thank you for shopping at Ami Tumi Amra!</p>
            <p>Please keep this receipt for exchange within 7 days.</p>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
