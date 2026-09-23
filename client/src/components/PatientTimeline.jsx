import React, { useState } from 'react';
import {
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Receipt,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const PatientTimeline = ({ timeline = [], onExplainPrescription, onExplainLab }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedEvents, setExpandedEvents] = useState({});

  const toggleExpand = (id) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = timeline.filter((event) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'appointment') return event.eventType === 'appointment';
    if (activeFilter === 'medical_record') return event.eventType === 'medical_record';
    if (activeFilter === 'prescription') return event.eventType === 'prescription';
    if (activeFilter === 'lab_order') return event.eventType === 'lab_order';
    if (activeFilter === 'billing') return event.eventType === 'billing';
    return true;
  });

  const getEventIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'medical_record':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-purple-600" />;
      case 'lab_order':
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case 'billing':
        return <Receipt className="w-4 h-4 text-sky-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 border-blue-200';
      case 'medical_record':
        return 'bg-emerald-100 border-emerald-200';
      case 'prescription':
        return 'bg-purple-100 border-purple-200';
      case 'lab_order':
        return 'bg-amber-100 border-amber-200';
      case 'billing':
        return 'bg-sky-100 border-sky-200';
      default:
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'appointment', label: 'Appointments' },
          { id: 'medical_record', label: 'Clinical Encounters' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'lab_order', label: 'Lab Orders' },
          { id: 'billing', label: 'Invoices & Billing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No records found for this category</p>
          <p className="text-xs text-slate-400 mt-1">Clinical updates will appear here chronologically.</p>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {filteredEvents.map((event) => {
            const isExpanded = expandedEvents[event.id];

            return (
              <div key={event.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-full border flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-110 ${getBadgeColor(
                    event.eventType
                  )}`}
                >
                  {getEventIcon(event.eventType)}
                </div>

                {/* Event Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {event.eventType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(event.timestamp).toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                          })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{event.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={event.status} />
                      <button
                        onClick={() => toggleExpand(event.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsed Brief Preview */}
                  {!isExpanded && (
                    <div className="mt-2 text-xs text-slate-600 line-clamp-1">
                      {event.eventType === 'medical_record' && (
                        <span>Complaint: {event.details.chiefComplaint} — Treatment: {event.details.treatmentPlan}</span>
                      )}
                      {event.eventType === 'prescription' && (
                        <span>{event.details.medications?.map((m) => m.name).join(', ')}</span>
                      )}
                      {event.eventType === 'lab_order' && (
                        <span>Sample: {event.details.sampleType} | Priority: {event.details.priority}</span>
                      )}
                      {event.eventType === 'appointment' && (
                        <span>Slot: {event.details.timeSlot} — Token #{event.details.queueNumber}</span>
                      )}
                      {event.eventType === 'billing' && (
                        <span>Total: ${event.details.totalAmount} | Paid: ${event.details.amountPaid} | Balance: ${event.details.balanceDue}</span>
                      )}
                    </div>
                  )}

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-3">
                      {/* Medical Record Encounter Details */}
                      {event.eventType === 'medical_record' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-lg font-mono text-[11px]">
                            <div><span className="text-slate-400">BP:</span> {event.details.vitals?.bloodPressureSys || '--'}/{event.details.vitals?.bloodPressureDia || '--'} mmHg</div>
                            <div><span className="text-slate-400">Pulse:</span> {event.details.vitals?.heartRate || '--'} bpm</div>
                            <div><span className="text-slate-400">SpO2:</span> {event.details.vitals?.oxygenSaturation || '--'}%</div>
                            <div><span className="text-slate-400">BMI:</span> {event.details.vitals?.bmi || '--'}</div>
                          </div>
                          <p><strong className="text-slate-700">Diagnosis:</strong> {event.details.diagnosis}</p>
                          <p><strong className="text-slate-700">Treatment Plan:</strong> {event.details.treatmentPlan}</p>
                          {event.details.clinicalSummary && (
                            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-slate-700">
                              <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                                <Sparkles className="w-3.5 h-3.5" /> AI Clinical Synthesis
                              </span>
                              <pre className="font-sans whitespace-pre-wrap text-[11px] leading-relaxed">
                                {event.details.clinicalSummary}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prescription Details */}
                      {event.eventType === 'prescription' && (
                        <div className="space-y-2">
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                                <tr>
                                  <th className="p-2">Medication</th>
                                  <th className="p-2">Dosage</th>
                                  <th className="p-2">Frequency</th>
                                  <th className="p-2">Timing</th>
                                  <th className="p-2">Duration</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {event.details.medications?.map((m, idx) => (
                                  <tr key={idx}>
                                    <td className="p-2 font-medium">{m.name}</td>
                                    <td className="p-2">{m.dosage}</td>
                                    <td className="p-2">{m.frequency}</td>
                                    <td className="p-2">{m.timing}</td>
                                    <td className="p-2">{m.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {onExplainPrescription && (
                            <button
                              onClick={() => onExplainPrescription(event.details)}
                              className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium flex items-center gap-1.5 border border-purple-200 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Explain in Plain Language (AI)
                            </button>
                          )}
                        </div>
                      )}

                      {/* Lab Order Details */}
                      {event.eventType === 'lab_order' && (
                        <div className="space-y-2">
                          {event.details.results && event.details.results.length > 0 ? (
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                              <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                                  <tr>
                                    <th className="p-2">Parameter</th>
                                    <th className="p-2">Observed</th>
                                    <th className="p-2">Reference</th>
                                    <th className="p-2">Flag</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {event.details.results.map((r, idx) => (
                                    <tr key={idx}>
                                      <td className="p-2 font-medium">{r.parameterName}</td>
                                      <td className="p-2 font-bold">{r.observedValue} {r.unit}</td>
                                      <td className="p-2 text-slate-500">{r.referenceRange}</td>
                                      <td className="p-2"><StatusBadge status={r.flag} size="sm" /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-slate-500 italic">Results pending laboratory processing.</p>
                          )}
                          {onExplainLab && (
                            <button
                              onClick={() => onExplainLab(event.title, event.details.results)}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium flex items-center gap-1.5 border border-amber-200 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Explain Results in Plain English (AI)
                            </button>
                          )}
                        </div>
                      )}

                      {/* Billing Details */}
                      {event.eventType === 'billing' && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg font-mono">
                            <span>Total Invoiced: <strong>${event.details.totalAmount}</strong></span>
                            <span>Amount Paid: <strong className="text-emerald-600">${event.details.amountPaid}</strong></span>
                            <span>Balance Due: <strong className="text-rose-600">${event.details.balanceDue}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
