import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PrintInvoice } from '../../components/PrintInvoice';
import { Receipt, Printer, CreditCard } from 'lucide-react';

export const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printInvoice, setPrintInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/billing/invoices');
      if (res.data.success) {
        setInvoices(res.data.invoices);
      }
    } catch (err) {
      console.error('Failed to load patient invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Billing Statements & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review itemized consultation charges, lab test fees, and download official receipts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No invoices issued for your account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Issued: {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    Invoice Total: <span className="font-mono">${inv.totalAmount}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={inv.paymentStatus} />
                  <button
                    onClick={() => setPrintInvoice(inv)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                    title="Print Statement"
                  >
                    <Printer className="w-4 h-4" /> View Receipt
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inv.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-800">{item.description}</td>
                        <td className="p-3 uppercase font-mono text-[10px] text-slate-400">
                          {item.serviceCategory}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${item.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs font-mono bg-slate-50 p-3 rounded-xl">
                <span>Amount Settled: <strong className="text-emerald-600">${inv.amountPaid}</strong></span>
                <span>Balance Due: <strong className="text-rose-600">${inv.balanceDue}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {printInvoice && (
        <Modal
          isOpen={!!printInvoice}
          onClose={() => setPrintInvoice(null)}
          title="Print Billing Receipt"
          maxWidth="max-w-3xl"
        >
          <PrintInvoice invoice={printInvoice} />
        </Modal>
      )}
    </div>
  );
};
