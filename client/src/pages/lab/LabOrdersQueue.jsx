import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PrintLabReport } from '../../components/PrintLabReport';
import {
  FlaskConical,
  TestTube,
  CheckCircle2,
  Printer,
  Edit3,
  Search,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const LabOrdersQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Sample Collection Modal
  const [sampleModalOrder, setSampleModalOrder] = useState(null);
  const [sampleBarcode, setSampleBarcode] = useState('');

  // Result Entry Modal
  const [resultModalOrder, setResultModalOrder] = useState(null);
  const [resultsForm, setResultsForm] = useState([]);
  const [technicianNotes, setTechnicianNotes] = useState('');

  // Print Report Modal
  const [printModalOrder, setPrintModalOrder] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/lab/orders', { params });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load lab orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Open Sample Collection Modal
  const handleOpenSampleModal = (order) => {
    setSampleModalOrder(order);
    const randomBarcode = `BC-${Math.floor(100000 + Math.random() * 900000)}-${order.testName.slice(0, 3).toUpperCase()}`;
    setSampleBarcode(order.sampleBarcode || randomBarcode);
  };

  const handleSaveSampleCollection = async (e) => {
    e.preventDefault();
    if (!sampleModalOrder) return;

    setActionLoading(true);
    try {
      await api.patch(`/lab/orders/${sampleModalOrder._id}/collect-sample`, {
        sampleBarcode,
      });
      setSampleModalOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Sample collection update failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Open Result Entry Modal
  const handleOpenResultModal = (order) => {
    setResultModalOrder(order);
    setResultsForm(
      order.results?.map((r) => ({
        parameterName: r.parameterName,
        observedValue: r.observedValue || '',
        unit: r.unit || '',
        referenceRange: r.referenceRange || '',
        flag: r.flag || 'normal',
      })) || []
    );
    setTechnicianNotes(order.technicianNotes || '');
  };

  const handleResultParamChange = (idx, field, value) => {
    const updated = [...resultsForm];
    updated[idx][field] = value;
    setResultsForm(updated);
  };

  const handleSaveResults = async (e) => {
    e.preventDefault();
    if (!resultModalOrder) return;

    setActionLoading(true);
    try {
      await api.patch(`/lab/orders/${resultModalOrder._id}/results`, {
        results: resultsForm,
        technicianNotes,
        status: 'completed', // completed analysis, ready for verification
      });
      setResultModalOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Result save failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Verify and Release
  const handleVerify = async (orderId) => {
    if (!window.confirm('Verify and release these test results to the physician and patient?')) return;

    setActionLoading(true);
    try {
      await api.patch(`/lab/orders/${orderId}/verify`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.testName?.toLowerCase().includes(q) ||
      o.patient?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-amber-600" />
            Laboratory Orders & Specimen Processing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step workflow: Collect Specimen → Record Analysis → Verify & Release.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order, test, or patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          >
            <option value="">All Statuses</option>
            <option value="ordered">1. Ordered</option>
            <option value="sample_collected">2. Sample Collected</option>
            <option value="completed">3. Results Entered</option>
            <option value="verified">4. Verified & Released</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading lab orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No lab orders found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Order #</th>
                  <th className="px-6 py-3">Test Name</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Sample Barcode</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{order.testName}</span>
                      <span className="text-[11px] text-slate-400">{order.sampleType}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-slate-800 block">{order.patient?.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">{order.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {order.sampleBarcode || (
                        <span className="text-slate-400 italic">Not collected</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right flex items-center justify-end gap-2">
                      {/* Step 1: Collect Sample */}
                      {order.status === 'ordered' && (
                        <button
                          onClick={() => handleOpenSampleModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <TestTube className="w-3.5 h-3.5" /> Collect Specimen
                        </button>
                      )}

                      {/* Step 2: Enter Results */}
                      {(order.status === 'sample_collected' || order.status === 'processing') && (
                        <button
                          onClick={() => handleOpenResultModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Enter Results
                        </button>
                      )}

                      {/* Step 3: Verify & Release */}
                      {order.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenResultModal(order)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleVerify(order._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verify & Release
                          </button>
                        </div>
                      )}

                      {/* Step 4: Verified Print */}
                      {order.status === 'verified' && (
                        <button
                          onClick={() => setPrintModalOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" /> View Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Sample Collection */}
      {sampleModalOrder && (
        <Modal
          isOpen={!!sampleModalOrder}
          onClose={() => setSampleModalOrder(null)}
          title={`Specimen Collection — ${sampleModalOrder.orderNumber}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveSampleCollection} className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p>Test: <strong className="text-slate-900">{sampleModalOrder.testName}</strong></p>
              <p>Patient: <strong className="text-slate-900">{sampleModalOrder.patient?.name}</strong></p>
              <p>Required Specimen: <strong className="text-sky-700">{sampleModalOrder.sampleType}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specimen Tube Barcode / Container ID *
              </label>
              <input
                type="text"
                required
                value={sampleBarcode}
                onChange={(e) => setSampleBarcode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {actionLoading ? 'Logging Collection...' : 'Confirm Sample Collection & Send to Analyzer'}
            </button>
          </form>
        </Modal>
      )}

      {/* Modal 2: Enter Results */}
      {resultModalOrder && (
        <Modal
          isOpen={!!resultModalOrder}
          onClose={() => setResultModalOrder(null)}
          title={`Biochemistry Results Entry — ${resultModalOrder.testName}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveResults} className="space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5">Observed Value *</th>
                    <th className="p-2.5">Reference Range</th>
                    <th className="p-2.5">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultsForm.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-slate-900">{item.parameterName}</td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            required
                            value={item.observedValue}
                            onChange={(e) => handleResultParamChange(idx, 'observedValue', e.target.value)}
                            placeholder="e.g. 14.2"
                            className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-lg font-bold"
                          />
                          <span className="text-[11px] text-slate-400">{item.unit}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-500 font-mono text-[11px]">{item.referenceRange}</td>
                      <td className="p-2.5">
                        <select
                          value={item.flag}
                          onChange={(e) => handleResultParamChange(idx, 'flag', e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-200 rounded-lg"
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                          <option value="critical">Critical</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Technician Laboratory Remarks
              </label>
              <textarea
                rows={2}
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="Quality control checks valid, sample clear, rerun completed..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {actionLoading ? 'Saving Results...' : 'Save Parameters & Prepare for Verification'}
            </button>
          </form>
        </Modal>
      )}

      {/* Modal 3: View / Print Lab Report */}
      {printModalOrder && (
        <Modal
          isOpen={!!printModalOrder}
          onClose={() => setPrintModalOrder(null)}
          title="Diagnostic Report Review"
          maxWidth="max-w-3xl"
        >
          <PrintLabReport order={printModalOrder} />
        </Modal>
      )}
    </div>
  );
};
