import React from 'react';
import { Printer, HeartPulse } from 'lucide-react';

export const PrintPrescription = ({ prescription }) => {
  if (!prescription) return null;

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <HeartPulse className="w-8 h-8" />
            <h1 className="text-2xl font-black tracking-tight">MedAssist Clinic</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Center for Comprehensive Outpatient Care & Diagnostics
          </p>
          <p className="text-xs text-slate-400">Tel: +1 (555) 019-2831 | www.medassist-clinic.org</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-bold">
            Rx Slip
          </span>
          <p className="text-xs font-mono font-bold text-slate-800 mt-1">
            {prescription.prescriptionNumber}
          </p>
          <p className="text-xs text-slate-400">
            Date: {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Doctor & Patient Info */}
      <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Consultant Physician
          </span>
          <p className="font-bold text-slate-900 text-sm">{prescription.doctor?.name}</p>
          <p className="text-slate-600">{prescription.doctor?.specialization || 'Consultant Specialist'}</p>
        </div>
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
            Patient Details
          </span>
          <p className="font-bold text-slate-900 text-sm">{prescription.patient?.name}</p>
          <p className="text-slate-600 font-mono">Contact: {prescription.patient?.phone || 'N/A'}</p>
        </div>
      </div>

      {/* Diagnosis */}
      {prescription.diagnosis && (
        <div className="py-3 border-b border-slate-100 text-xs">
          <strong className="text-slate-700">Clinical Diagnosis:</strong>{' '}
          <span className="text-slate-900 font-medium">{prescription.diagnosis}</span>
        </div>
      )}

      {/* Medications Table */}
      <div className="py-4">
        <div className="flex items-center gap-1.5 mb-3 text-emerald-800 font-bold text-sm">
          <span>℞</span>
          <span>Prescribed Medications</span>
        </div>
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-2.5">#</th>
              <th className="p-2.5">Medicine Name & Form</th>
              <th className="p-2.5">Dosage</th>
              <th className="p-2.5">Frequency</th>
              <th className="p-2.5">Timing</th>
              <th className="p-2.5">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prescription.medications?.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                <td className="p-2.5">
                  <span className="font-bold text-slate-800">{m.name}</span>
                  <span className="text-slate-500 text-[11px] block">{m.form}</span>
                </td>
                <td className="p-2.5 font-mono">{m.dosage}</td>
                <td className="p-2.5">{m.frequency}</td>
                <td className="p-2.5">{m.timing}</td>
                <td className="p-2.5 font-medium">{m.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      {(prescription.generalInstructions || prescription.dietaryAdvice) && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 my-3">
          {prescription.generalInstructions && (
            <p>
              <strong className="text-slate-800">General Instructions:</strong>{' '}
              {prescription.generalInstructions}
            </p>
          )}
          {prescription.dietaryAdvice && (
            <p>
              <strong className="text-slate-800">Dietary Advice:</strong> {prescription.dietaryAdvice}
            </p>
          )}
        </div>
      )}

      {/* Doctor Signature & Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
        <div className="text-slate-400 text-[11px]">
          <p>Generated by MedAssist Secure EMR</p>
          <p>This prescription is digitally authenticated.</p>
        </div>
        <div className="text-center">
          <div className="font-serif italic text-emerald-800 font-bold border-b border-slate-300 pb-1 px-4 text-base">
            {prescription.doctor?.name}
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Authorized Physician Signature</p>
        </div>
      </div>

      {/* Print trigger button (screen only) */}
      <div className="mt-6 text-right no-print">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 ml-auto shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Prescription
        </button>
      </div>
    </div>
  );
};
