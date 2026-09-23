import React, { useState, useEffect } from 'react';
import { HeartPulse } from 'lucide-react';

export const PageCurtain = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between curtain-reveal"
      style={{
        backgroundColor: '#0a0a0a',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-[#fafafa] flex items-center justify-center font-bold shadow-2xl animate-pulse">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div className="font-display font-semibold text-[#fafafa] text-xs uppercase tracking-widest flex items-center gap-2">
          <span>MEDASSIST</span>
          <span className="text-[10px] font-mono text-[#a3a3a3] border border-[#262626] px-1.5 py-0.5 rounded bg-[#171717]">
            2.0
          </span>
        </div>
      </div>

      {/* Curved SVG Bottom Wave */}
      <svg
        className="w-full h-16 sm:h-24 text-[#0a0a0a] transform rotate-180 -mb-1"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,100 Q720,0 1440,100 Z" />
      </svg>
    </div>
  );
};
