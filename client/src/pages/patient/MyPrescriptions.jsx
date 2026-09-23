import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { AIExplainerModal } from '../../components/AIExplainerModal';
import { PrintPrescription } from '../../components/PrintPrescription';
import { Pill, Sparkles, Printer, Calendar, Clock, AlertCircle } from 'lucide-react';

export const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Print Modal
  const [printRx, setPrintRx] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clinical/prescriptions');
      if (res.data.success) {
        setPrescriptions(res.data.prescriptions);
      }
    } catch (err) {
      console.error('Failed to load prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainAI = async (rx) => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent('');

    try {
      // If already generated and cached on document, display immediately or regenerate
      if (rx.plainLanguageExplanation) {
        setAiContent(rx.plainLanguageExplanation);
        setAiLoading(false);
        return;
      }

      const res = await api.post('/ai/explain-prescription', {
        patientName: rx.patient?.name,
        diagnosis: rx.diagnosis,
        medications: rx.medications,
        generalInstructions: rx.generalInstructions,
        dietaryAdvice: rx.dietaryAdvice,
      });

      if (res.data.success) {
        setAiContent(res.data.explanation);
      }
    } catch (err) {
      setAiContent('Failed to synthesize plain-language explanation: ' + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-purple-600" />
            My Prescriptions & Medications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access active drug regimens, review instructions, and generate plain-language AI guides.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          <Pill className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No prescriptions found on your record.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {rx.prescriptionNumber}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Issued: {new Date(rx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {rx.diagnosis ? `Clinical Diagnosis: ${rx.diagnosis}` : 'Medical Prescription'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Prescribed by {rx.doctor?.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExplainAI(rx)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Explain with AI
                  </button>
                  <button
                    onClick={() => setPrintRx(rx)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
                    title="Print Prescription Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Medications Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Medicine & Form</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Timing</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Special Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rx.medications?.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{m.name}</span>
                          <span className="text-[11px] text-slate-500">{m.form}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700">{m.dosage}</td>
                        <td className="p-3">{m.frequency}</td>
                        <td className="p-3">{m.timing}</td>
                        <td className="p-3 font-medium text-purple-700">{m.duration}</td>
                        <td className="p-3 text-slate-600">{m.instructions || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(rx.generalInstructions || rx.dietaryAdvice) && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  {rx.generalInstructions && (
                    <p><strong>Instructions:</strong> {rx.generalInstructions}</p>
                  )}
                  {rx.dietaryAdvice && (
                    <p><strong>Dietary Advice:</strong> {rx.dietaryAdvice}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Plain Language Explainer Modal */}
      <AIExplainerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="Plain-Language Prescription Explainer"
        content={aiContent}
        loading={aiLoading}
      />

      {/* Printable Prescription Slip Modal */}
      {printRx && (
        <Modal
          isOpen={!!printRx}
          onClose={() => setPrintRx(null)}
          title="Print Prescription Slip"
          maxWidth="max-w-3xl"
        >
          <PrintPrescription prescription={printRx} />
        </Modal>
      )}
    </div>
  );
};
