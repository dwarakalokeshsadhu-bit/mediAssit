import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { AIExplainerModal } from '../../components/AIExplainerModal';
import { PrintLabReport } from '../../components/PrintLabReport';
import { FlaskConical, Sparkles, Printer, CheckCircle2, Clock } from 'lucide-react';

export const MyLabReports = () => {
  const [labOrders, setLabOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Print Modal
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    fetchLabReports();
  }, []);

  const fetchLabReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/lab/orders');
      if (res.data.success) {
        setLabOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load lab reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainAI = async (order) => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent('');

    try {
      if (order.plainLanguageExplanation) {
        setAiContent(order.plainLanguageExplanation);
        setAiLoading(false);
        return;
      }

      const res = await api.post('/ai/explain-lab', {
        testName: order.testName,
        results: order.results,
        patientName: order.patient?.name,
      });

      if (res.data.success) {
        setAiContent(res.data.explanation);
      }
    } catch (err) {
      setAiContent('Failed to synthesize explanation: ' + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-amber-600" />
            My Diagnostic Laboratory Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View verified pathology findings, parameter flags, and AI-powered plain language breakdowns.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your lab records...</div>
      ) : labOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          <FlaskConical className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No laboratory tests requested yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {labOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{order.testName}</h3>
                  <p className="text-xs text-slate-500">
                    Specimen: <span className="font-medium text-slate-700">{order.sampleType}</span> • Barcode:{' '}
                    <span className="font-mono text-slate-700">{order.sampleBarcode || 'Pending collection'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />

                  {order.status === 'verified' && (
                    <>
                      <button
                        onClick={() => handleExplainAI(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-600/20 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Explain Results (AI)
                      </button>
                      <button
                        onClick={() => setPrintOrder(order)}
                        className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
                        title="Print Certified Report"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Results Table if verified */}
              {order.status === 'verified' && order.results && order.results.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Test Parameter</th>
                        <th className="p-3">Observed Result</th>
                        <th className="p-3">Reference Range</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.results.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-800">{r.parameterName}</td>
                          <td className="p-3 font-bold text-slate-900">
                            {r.observedValue} <span className="text-slate-400 font-normal">{r.unit}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-500">{r.referenceRange}</td>
                          <td className="p-3">
                            <StatusBadge status={r.flag} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 animate-spin" />
                  <span>
                    {order.status === 'ordered'
                      ? 'Test order registered. Please proceed to the lab collection room for specimen drop-off.'
                      : 'Specimen in laboratory processing. Verified results will appear here automatically.'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Plain Language Explainer Modal */}
      <AIExplainerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="Plain-Language Lab Results Guide"
        content={aiContent}
        loading={aiLoading}
      />

      {/* Printable Report Modal */}
      {printOrder && (
        <Modal
          isOpen={!!printOrder}
          onClose={() => setPrintOrder(null)}
          title="Diagnostic Report Slip"
          maxWidth="max-w-3xl"
        >
          <PrintLabReport order={printOrder} />
        </Modal>
      )}
    </div>
  );
};
