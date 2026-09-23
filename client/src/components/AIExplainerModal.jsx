import React, { useState } from 'react';
import { Modal } from './Modal';
import { Sparkles, Copy, Check, Volume2, VolumeX, ShieldAlert, HeartPulse } from 'lucide-react';

export const AIExplainerModal = ({ isOpen, onClose, title = 'Plain-Language Medical Explainer', content, loading }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !content) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Strip markdown markers for clean speech
      const plainText = content.replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <div className="space-y-4">
        {/* Banner */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-200/60 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                AI Patient Companion
                <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Non-Diagnostic
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                Empathetic translation of clinical instructions into clear everyday steps.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {'speechSynthesis' in window && (
              <button
                onClick={handleSpeak}
                disabled={loading || !content}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isSpeaking
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={loading || !content}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              <HeartPulse className="w-5 h-5 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Synthesizing clinical explanation...</p>
            <p className="text-xs text-slate-400">Simplifying medical terms & creating daily schedules</p>
          </div>
        ) : (
          /* Content display */
          <div className="prose prose-slate max-w-none bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {content || 'No explanation available.'}
          </div>
        )}

        {/* Safety Disclaimer */}
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Important Safety Note:</span> This explanation is designed for patient education and does not alter or replace your physician's prescriptions. If you experience severe symptoms, chest discomfort, or allergic reactions, contact your doctor or emergency services immediately.
          </div>
        </div>
      </div>
    </Modal>
  );
};
