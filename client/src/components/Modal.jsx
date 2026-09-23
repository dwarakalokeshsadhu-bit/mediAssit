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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-[#171717] rounded-xl shadow-2xl border border-[#262626] overflow-hidden transform transition-all text-[#fafafa]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#141414]">
          <h3 className="text-base font-display font-semibold text-[#fafafa] tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#a3a3a3] hover:text-[#fafafa] bg-[#262626] hover:bg-[#333333] rounded-full transition-colors border border-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#171717] text-[#fafafa]">{children}</div>
      </div>
    </div>
  );
};
