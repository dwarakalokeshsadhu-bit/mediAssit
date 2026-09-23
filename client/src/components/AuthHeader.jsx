import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AuthHeader = ({ subtitle = 'CLINIC OPERATIONS & PATIENT CARE' }) => {
  return (
    <header className="w-full px-6 sm:px-12 py-4 bg-theme-surface border-b border-theme-border flex items-center justify-between z-20">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-md bg-theme-base border border-theme-border text-theme-text flex items-center justify-center font-semibold shadow-sm transition-transform duration-150 group-hover:scale-105">
          <HeartPulse className="w-4 h-4 text-theme-text" />
        </div>
        <div>
          <span className="font-display text-base font-bold tracking-tight text-theme-text block leading-none">
            MedAssist
          </span>
          <span className="text-[10px] font-mono text-theme-textMuted uppercase mt-1 block font-medium">
            {subtitle}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-theme-textMuted">
          <ShieldCheck className="w-3.5 h-3.5 text-theme-text" />
          <span>Secure Clinical Gateway</span>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-textMuted hover:text-theme-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </header>
  );
};
