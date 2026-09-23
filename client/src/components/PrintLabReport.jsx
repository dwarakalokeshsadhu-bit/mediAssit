import React from 'react';
import { Printer, FlaskConical, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const PrintLabReport = ({ order }) => {
  if (!order) return null;

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-sky-600 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-700">
            <FlaskConical className="w-8 h-8" />
            <h1 className="text-2xl font-black tracking-tight">MedAssist Diagnostic Labs</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            CAP & NABL Accredited Diagnostic Pathology Division
          </p>
          <p className="text-xs text-slate-400">Barcode: {order.sampleBarcode || 'BC-STANDARD'}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono uppercase bg-sky-50 text-sky-700 px-2.5 py-1 rounded border border-sky-200 font-bold">
            Lab Report
          </span>
          <p className="text-xs font-mono font-bold text-slate-800 mt-1">{order.orderNumber}</p>
          <p className="text-xs text-slate-400">
            Date: {new Date(order.verifiedAt || order.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Patient & Order Details */}
      <div className="grid grid-cols-3 gap-4 py-4 border-b border-slate-200 text-xs">
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Patient Name
          </span>
          <p className="font-bold text-slate-900 text-sm">{order.patient?.name}</p>
          <p className="text-slate-600">Sample: {order.sampleType || 'Whole Blood'}</p>
        </div>
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Referring Doctor
          </span>
          <p className="font-bold text-slate-900 text-sm">{order.doctor?.name || 'Dr. Attending'}</p>
          <p className="text-slate-600">Priority: {order.priority?.toUpperCase()}</p>
        </div>
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Verification Status
          </span>
          <div className="mt-1">
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Investigation Title */}
      <div className="py-4">
        <h2 className="text-base font-bold text-slate-900 mb-3">{order.testName}</h2>
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-2.5">Investigation Parameter</th>
              <th className="p-2.5">Observed Result</th>
              <th className="p-2.5">Reference Range</th>
              <th className="p-2.5">Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.results?.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-2.5 font-medium text-slate-800">{r.parameterName}</td>
                <td className="p-2.5 font-bold text-slate-900">
                  {r.observedValue} <span className="text-slate-500 font-normal">{r.unit}</span>
                </td>
                <td className="p-2.5 text-slate-600">{r.referenceRange}</td>
                <td className="p-2.5">
                  <StatusBadge status={r.flag} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Technician Notes */}
      {order.technicianNotes && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 my-3">
          <strong className="text-slate-800">Laboratory Remarks:</strong> {order.technicianNotes}
        </div>
      )}

      {/* Verification Sign-off */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
        <div className="text-slate-400 text-[11px]">
          <p className="flex items-center gap-1 text-emerald-600 font-semibold mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Certified Authentic Clinical Report
          </p>
          <p>Verified electronically under MedAssist LIMS protocol.</p>
        </div>
        <div className="text-center">
          <div className="font-serif italic text-sky-800 font-bold border-b border-slate-300 pb-1 px-4 text-base">
            {order.verifiedBy?.name || 'Marcus Chen, MLS'}
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
            Certified Medical Laboratory Scientist
          </p>
        </div>
      </div>

      {/* Print button */}
      <div className="mt-6 text-right no-print">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 ml-auto shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Lab Report
        </button>
      </div>
    </div>
  );
};
