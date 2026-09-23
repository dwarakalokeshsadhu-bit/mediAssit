import React from 'react';

export const InfiniteMarquee = ({ text = "CLINICAL OPERATIONS — AI SOAP SYNTHESIS — 24H PATIENT SUMMARY — FHIR HL7 CERTIFIED — REAL-TIME QUEUE — PATHOLOGY LIMS —" }) => {
  return (
    <div className="w-full overflow-hidden bg-[#0e0e0e] border-y border-[#262626] py-3 selection:bg-[#262626] selection:text-[#fafafa]">
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-display font-medium text-[#a3a3a3] uppercase tracking-wider">
        <span>{text}</span>
        <span className="text-[#333333] font-mono">///</span>
        <span className="text-[#fafafa]">{text}</span>
        <span className="text-[#333333] font-mono">///</span>
        <span>{text}</span>
        <span className="text-[#333333] font-mono">///</span>
        <span className="text-[#fafafa]">{text}</span>
        <span className="text-[#333333] font-mono">///</span>
      </div>
    </div>
  );
};
