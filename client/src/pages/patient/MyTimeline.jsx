import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PatientTimeline } from '../../components/PatientTimeline';
import { AIExplainerModal } from '../../components/AIExplainerModal';
import { Activity, Sparkles } from 'lucide-react';

export const MyTimeline = () => {
  const { user } = useAuth();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState('Plain-Language Explainer');

  useEffect(() => {
    if (user?.id) {
      fetchTimeline();
    }
  }, [user]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clinical/timeline/${user.id}`);
      if (res.data.success) {
        setTimelineEvents(res.data.timeline);
      }
    } catch (err) {
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainPrescription = async (details) => {
    setAiTitle('Prescription Care Guide');
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent('');

    try {
      if (details.plainLanguageExplanation) {
        setAiContent(details.plainLanguageExplanation);
        setAiLoading(false);
        return;
      }

      const res = await api.post('/ai/explain-prescription', {
        patientName: user.name,
        diagnosis: details.diagnosis,
        medications: details.medications,
        generalInstructions: details.generalInstructions,
        dietaryAdvice: details.dietaryAdvice,
      });

      if (res.data.success) setAiContent(res.data.explanation);
    } catch (e) {
      setAiContent('Failed to synthesize explanation: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExplainLab = async (testName, results) => {
    setAiTitle(`Lab Explainer: ${testName}`);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent('');

    try {
      const res = await api.post('/ai/explain-lab', {
        testName,
        results,
        patientName: user.name,
      });
      if (res.data.success) setAiContent(res.data.explanation);
    } catch (e) {
      setAiContent('Failed to synthesize explanation: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            Unified Longitudinal Health Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            A single chronological feed consolidating your clinical encounters, prescriptions, diagnostics, and payments.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your medical history...</div>
        ) : (
          <PatientTimeline
            timeline={timelineEvents}
            onExplainPrescription={handleExplainPrescription}
            onExplainLab={handleExplainLab}
          />
        )}
      </div>

      <AIExplainerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiTitle}
        content={aiContent}
        loading={aiLoading}
      />
    </div>
  );
};
