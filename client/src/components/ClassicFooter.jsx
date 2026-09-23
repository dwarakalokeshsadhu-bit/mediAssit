import React, { useState } from 'react';
import {
  HeartPulse,
  Mail,
  Send,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Lock,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export const ClassicFooter = () => {
  const [testEmail, setTestEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleEmailTest = (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setTestEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#fafafa] font-sans border-t border-[#262626] selection:bg-[#262626] selection:text-[#fafafa]">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 border-b border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#171717] border border-[#262626] text-[#fafafa] flex items-center justify-center font-bold shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#fafafa]">
              MEDASSIST HEALTHCARE SYSTEMS
            </h3>
            <p className="text-xs text-[#a3a3a3] font-normal mt-0.5">
              Enterprise Clinical Operations & Outpatient Care Portal
            </p>
          </div>
        </div>

        {/* Security & Compliance Certifications Logos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] bg-[#171717] text-xs font-mono text-[#a3a3a3]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#fafafa]" />
            <span>HIPAA COMPLIANT</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] bg-[#171717] text-xs font-mono text-[#a3a3a3]">
            <Award className="w-3.5 h-3.5 text-[#fafafa]" />
            <span>HL7 FHIR v4</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] bg-[#171717] text-xs font-mono text-[#a3a3a3]">
            <Lock className="w-3.5 h-3.5 text-[#fafafa]" />
            <span>256-BIT ENCRYPTION</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] bg-[#171717] text-xs font-mono text-[#a3a3a3]">
            <FileText className="w-3.5 h-3.5 text-[#a3a3a3]" />
            <span>ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Column 1: Hospital Overview */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#a3a3a3] font-medium">
            Institutional Clinical Platform
          </h4>
          <p className="text-xs text-[#a3a3a3] leading-relaxed max-w-sm">
            MedAssist provides an integrated electronic health record and outpatient coordination environment linking doctors, reception desks, diagnostic pathology laboratories, and patient portals with dual AI clinical synthesis.
          </p>

          <div className="space-y-2 pt-2 text-xs text-[#a3a3a3]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#a3a3a3] shrink-0" />
              <span>100 Medical Center Plaza, Healthcare City, NY 10001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#a3a3a3] shrink-0" />
              <span>Direct Hotline: +1 (800) MED-ASST / (800) 633-2778</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#a3a3a3] shrink-0" />
              <span>Clinical Registry: contact@medassist.clinic</span>
            </div>
          </div>
        </div>

        {/* Column 2: Clinical Specialties */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#a3a3a3] font-medium">
            SPECIALTIES
          </h4>
          <ul className="space-y-2 text-xs text-[#a3a3a3]">
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Cardiology Services</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">General Internal Medicine</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Endocrinology & Diabetes</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Pathology Laboratory</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Diagnostic Radiology</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Outpatient Pharmacy</li>
          </ul>
        </div>

        {/* Column 3: Platform Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#a3a3a3] font-medium">
            CAPABILITIES
          </h4>
          <ul className="space-y-2 text-xs text-[#a3a3a3]">
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">AI SOAP Visit Synthesis</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Patient Plain-Text Explainer</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Slot Conflict Detection</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Sequential Queue Tokens</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Barcode Specimen Tracker</li>
            <li className="hover:text-[#fafafa] transition-colors cursor-pointer">Immutable Audit Trail</li>
          </ul>
        </div>

        {/* Column 4: Email Test & Communication Dispatch */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#a3a3a3] font-medium">
            SYSTEM DISPATCH
          </h4>
          <p className="text-xs text-[#a3a3a3]">
            Test dispatch service or subscribe for clinical protocol advisories:
          </p>

          <form onSubmit={handleEmailTest} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="physician@hospital.org"
                className="w-full px-3 py-2 text-xs bg-[#171717] border border-[#262626] rounded-md text-[#fafafa] placeholder-[#737373] focus:outline-none focus:border-[#525252] font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-md bg-[#fafafa] hover:bg-[#e5e5e5] text-[#0a0a0a] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Test Dispatch
            </button>
          </form>

          {subscribed && (
            <div className="p-2.5 bg-[#171717] border border-[#262626] text-[#fafafa] rounded-md text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#fafafa]" />
              <span>✓ Test inquiry logged to clinical queue</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Copyright & Regulatory Footnote */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-3">
        <span>© 2026 MEDASSIST HEALTH SYSTEMS INC. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#a3a3a3] cursor-pointer">PRIVACY PROTOCOL</span>
          <span>•</span>
          <span className="hover:text-[#a3a3a3] cursor-pointer">TERMS OF CLINICAL USE</span>
          <span>•</span>
          <span className="hover:text-[#a3a3a3] cursor-pointer">HIPAA NOTICE</span>
        </div>
      </div>
    </footer>
  );
};
