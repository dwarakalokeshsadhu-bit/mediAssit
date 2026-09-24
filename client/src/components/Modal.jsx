import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-theme-surface rounded-xl shadow-2xl border border-theme-border overflow-hidden transform transition-all text-theme-text`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border bg-theme-surface">
          <h3 className="text-base font-display font-semibold text-theme-text tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-theme-textMuted hover:text-theme-text bg-theme-surface hover:bg-theme-surfaceHover rounded-full transition-colors border border-theme-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-theme-surface text-theme-text">{children}</div>
      </div>
    </div>
  );
};
