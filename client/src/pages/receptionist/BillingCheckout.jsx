import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PrintInvoice } from '../../components/PrintInvoice';
import { Receipt, CreditCard, Printer, Search, CheckCircle2, DollarSign } from 'lucide-react';

export const BillingCheckout = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Payment Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [txId, setTxId] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Print Modal State
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/billing/invoices', { params });
      if (res.data.success) {
        setInvoices(res.data.invoices);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (inv) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPayMethod('Cash');
    setTxId('');
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice || !payAmount) return;

    setPaymentSubmitting(true);
    try {
      const res = await api.post(`/billing/invoices/${selectedInvoice._id}/payments`, {
        amount: Number(payAmount),
        method: payMethod,
        transactionId: txId,
      });

      if (res.data.success) {
        setSelectedInvoice(null);
        fetchInvoices();
        // Offer to print receipt immediately
        setPrintInvoiceData(res.data.invoice);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment recording failed');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.patient?.name?.toLowerCase().includes(q) ||
      inv.patient?.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Billing & Cashier Settlements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process consultation & lab fees, record payments, and issue itemized tax receipts.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice or patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Settled / Paid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading billing records...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No invoices found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Amount Paid</th>
                  <th className="px-6 py-3">Balance Due</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{inv.patient?.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{inv.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                      ${inv.totalAmount}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-emerald-600 font-semibold">
                      ${inv.amountPaid}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-rose-600 font-bold">
                      ${inv.balanceDue}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={inv.paymentStatus} />
                    </td>
                    <td className="px-6 py-3.5 text-right flex items-center justify-end gap-2">
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Collect Payment
                        </button>
                      )}
                      <button
                        onClick={() => setPrintInvoiceData(inv)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Collect Payment — ${selectedInvoice.invoiceNumber}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <p>Patient: <strong className="text-slate-900">{selectedInvoice.patient?.name}</strong></p>
              <p>Total Bill: <strong className="font-mono">${selectedInvoice.totalAmount}</strong></p>
              <p>Balance Due: <strong className="font-mono text-rose-600">${selectedInvoice.balanceDue}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                max={selectedInvoice.balanceDue}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI / Digital QR</option>
                <option value="Insurance">Insurance Settlement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Transaction ID / Reference (Optional)
              </label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="e.g. UPI-998822 or AUTH-CARD-01"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={paymentSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {paymentSubmitting ? 'Recording Payment...' : 'Confirm Settlement & Issue Receipt'}
            </button>
          </form>
        </Modal>
      )}

      {/* Print Receipt Modal */}
      {printInvoiceData && (
        <Modal
          isOpen={!!printInvoiceData}
          onClose={() => setPrintInvoiceData(null)}
          title="Print Official Billing Statement"
          maxWidth="max-w-3xl"
        >
          <PrintInvoice invoice={printInvoiceData} />
        </Modal>
      )}
    </div>
  );
};
