import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  FlaskConical,
  Activity,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    id: 'soap',
    badge: '01 / CLINICAL INTELLIGENCE',
    title: 'Physician Consultation & AI SOAP',
    subtitle: 'Automated clinical encounter documentation with vital parameter anomaly detection.',
    icon: Stethoscope,
    facts: [
      { label: 'FHIR', val: 'HL7 v4' },
      { label: 'AI', val: 'SOAP Synthesis' },
      { label: 'SPEED', val: '<250ms' },
    ],
    role: 'doctor',
    gradient: 'from-zinc-900 to-black',
  },
  {
    id: 'queue',
    badge: '02 / PATIENT LOGISTICS',
    title: 'Outpatient Queue Board & Booking',
    subtitle: 'Walk-in MRN enrollment, conflict-free scheduling engine, and sequential token dispatch.',
    icon: Users,
    facts: [
      { label: 'ALGO', val: 'Conflict-Free' },
      { label: 'TOKENS', val: 'Sequential' },
      { label: 'STAGES', val: '4-Tier' },
    ],
    role: 'receptionist',
    gradient: 'from-zinc-900 to-black',
  },
  {
    id: 'lims',
    badge: '03 / DIAGNOSTIC PATHOLOGY',
    title: 'Laboratory LIMS & Specimen Tracking',
    subtitle: 'Specimen barcode intake, multi-parameter test logging, and certified doctor sign-off.',
    icon: FlaskConical,
    facts: [
      { label: 'TRACKING', val: 'Barcode Specimen' },
      { label: 'FLAGS', val: 'Auto-Abnormal' },
      { label: 'VERIFIED', val: 'Certified' },
    ],
    role: 'lab_tech',
    gradient: 'from-zinc-900 to-black',
  },
  {
    id: 'patient',
    badge: '04 / PATIENT WELLNESS',
    title: 'Longitudinal Record & AI Explainer',
    subtitle: 'Empathetic translation of complex prescriptions into plain English with audio playback.',
    icon: Activity,
    facts: [
      { label: 'SPEECH', val: 'Web Speech API' },
      { label: 'LANGUAGE', val: 'Plain English' },
      { label: 'TIMELINE', val: 'Unified EMR' },
    ],
    role: 'patient',
    gradient: 'from-zinc-900 to-black',
  },
  {
    id: 'admin',
    badge: '05 / EXECUTIVE GOVERNANCE',
    title: 'Administrative Controls & Audit Log',
    subtitle: 'Comprehensive audit trails, RBAC permission tiers, fee catalog, and cashier billing.',
    icon: ShieldCheck,
    facts: [
      { label: 'AUDIT', val: 'Immutable Logs' },
      { label: 'RBAC', val: '5 Roles' },
      { label: 'BILLING', val: 'Itemized Invoices' },
    ],
    role: 'admin',
    gradient: 'from-zinc-900 to-black',
  },
];

export const RadialFeatureCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  const activeFeature = FEATURES[activeIndex];

  return (
    <div className="w-full space-y-8 font-display">
      {/* Top Header Controls: Inspired by pe.supply collection header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>INTERACTIVE WORKFLOW COLLECTION</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Integrated Medical Modules
          </h3>
        </div>

        {/* Carousel Stepper Buttons */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider pr-2">
            <span className="text-white font-black">{`0${activeIndex + 1}`}</span> / {`0${FEATURES.length}`}
          </div>
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Previous Module"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Next Module"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Feature Slide: Styled with pe.supply bevel edges & facts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Detail Card with Bevel Clip */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700">
              {activeFeature.badge}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black shadow-lg">
              <activeFeature.icon className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {activeFeature.title}
            </h4>
            <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed max-w-2xl">
              {activeFeature.subtitle}
            </p>
          </div>

          {/* Quick Technical Facts (Inspired by pe.supply ci-main-fact) */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80">
            {activeFeature.facts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 space-y-0.5"
              >
                <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  {fact.label}
                </span>
                <span className="block text-sm font-black text-white uppercase truncate">
                  {fact.val}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              Launch {activeFeature.role.replace('_', ' ')} Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Module Selector List with Smooth Transitions */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
          {FEATURES.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-white text-black border-white shadow-xl scale-[1.02]'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isCurrent ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="font-black text-xs uppercase tracking-tight truncate max-w-[200px]">
                    {item.title.split('&')[0].trim()}
                  </span>
                </div>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    isCurrent ? 'text-black translate-x-1' : 'text-zinc-600 group-hover:text-white'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
