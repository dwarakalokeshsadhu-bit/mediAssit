import React from 'react';
import { Printer, Receipt, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const PrintInvoice = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <Receipt className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-black tracking-tight">MedAssist Clinic</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Official Billing Statement & Receipt</p>
          <p className="text-xs text-slate-400">GSTIN / Tax ID: MED-TX-998822</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono uppercase bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-bold">
            Tax Invoice
          </span>
          <p className="text-xs font-mono font-bold text-slate-800 mt-1">{invoice.invoiceNumber}</p>
          <p className="text-xs text-slate-400">
            Date: {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bill To & Status */}
      <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Billed To
          </span>
          <p className="font-bold text-slate-900 text-sm">{invoice.patient?.name}</p>
          <p className="text-slate-600 font-mono">Contact: {invoice.patient?.phone || 'N/A'}</p>
          <p className="text-slate-600">Email: {invoice.patient?.email}</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Settlement Status
          </span>
          <div className="mt-1 flex justify-end">
            <StatusBadge status={invoice.paymentStatus} />
          </div>
          <p className="text-xs font-mono mt-2">
            Balance Due: <strong className="text-rose-600">${invoice.balanceDue}</strong>
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="py-4">
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-2.5">#</th>
              <th className="p-2.5">Item Description</th>
              <th className="p-2.5">Category</th>
              <th className="p-2.5 text-center">Qty</th>
              <th className="p-2.5 text-right">Unit Price</th>
              <th className="p-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items?.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                <td className="p-2.5 font-medium text-slate-900">{item.description}</td>
                <td className="p-2.5 uppercase font-mono text-[10px] text-slate-500">
                  {item.serviceCategory}
                </td>
                <td className="p-2.5 text-center">{item.quantity}</td>
                <td className="p-2.5 text-right font-mono">${item.unitPrice}</td>
                <td className="p-2.5 text-right font-mono font-bold">${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Calculations */}
      <div className="flex justify-end pt-2 pb-4 text-xs font-mono">
        <div className="w-64 space-y-1.5 border-t border-slate-200 pt-3">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>${invoice.subtotal}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount Applied:</span>
              <span>-${invoice.discount}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax:</span>
              <span>+${invoice.tax}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
            <span>Total Amount:</span>
            <span>${invoice.totalAmount}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Amount Paid:</span>
            <span className="text-emerald-700 font-bold">${invoice.amountPaid}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-rose-600 border-t border-slate-200 pt-1.5">
            <span>Balance Due:</span>
            <span>${invoice.balanceDue}</span>
          </div>
        </div>
      </div>

      {/* Payment History Receipts */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="py-3 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Payment Receipts
          </h4>
          <div className="space-y-1 text-xs">
            {invoice.payments.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 font-mono text-[11px]"
              >
                <span>
                  Receipt #{p.receiptNumber} — {p.method}
                  {p.transactionId ? ` (${p.transactionId})` : ''}
                </span>
                <span className="text-slate-500">
                  {new Date(p.paymentDate).toLocaleDateString()}
                </span>
                <span className="font-bold text-emerald-600">+${p.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
        <p>Thank you for choosing MedAssist Clinic.</p>
        <p>Questions? Contact accounts@medassist-clinic.org</p>
      </div>

      {/* Print button */}
      <div className="mt-6 text-right no-print">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 ml-auto shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Receipt
        </button>
      </div>
    </div>
  );
};
