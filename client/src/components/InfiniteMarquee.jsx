import React from 'react';

export const InfiniteMarquee = ({ text = "CLINICAL OPERATIONS — AI SOAP SYNTHESIS — 24H PATIENT SUMMARY — FHIR HL7 CERTIFIED — REAL-TIME QUEUE — PATHOLOGY LIMS —" }) => {
  return (
    <div className="w-full overflow-hidden bg-theme-surface border-y border-theme-border py-3 selection:bg-neutral-200 selection:text-neutral-900">
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-display font-medium text-theme-textMuted uppercase tracking-wider">
        <span>{text}</span>
        <span className="text-neutral-300 font-mono">///</span>
        <span className="text-theme-text font-semibold">{text}</span>
        <span className="text-neutral-300 font-mono">///</span>
        <span>{text}</span>
        <span className="text-neutral-300 font-mono">///</span>
        <span className="text-theme-text font-semibold">{text}</span>
        <span className="text-neutral-300 font-mono">///</span>
      </div>
    </div>
  );
};
