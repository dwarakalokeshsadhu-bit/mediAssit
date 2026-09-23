import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PatientTimeline } from '../../components/PatientTimeline';
import {
  Stethoscope,
  Sparkles,
  HeartPulse,
  Pill,
  FlaskConical,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  FileText,
} from 'lucide-react';

export const ConsultationRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aptId = searchParams.get('aptId');
  const patientIdParam = searchParams.get('patientId');

  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'timeline' | 'prescription' | 'labs'
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientIdParam || '');
  const [patientData, setPatientData] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [labServices, setLabServices] = useState([]);

  // Clinical Encounter State
  const [vitals, setVitals] = useState({
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    temperature: '98.6',
    oxygenSaturation: '99',
    weightKg: '',
    heightCm: '',
    bmi: '',
  });

  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState('');
  const [examinationFindings, setExaminationFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Prescription State
  const [medications, setMedications] = useState([
    {
      name: '',
      form: 'Tablet',
      dosage: '',
      frequency: 'Twice daily',
      timing: 'After meals',
      duration: '5 days',
      instructions: '',
    },
  ]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [dietaryAdvice, setDietaryAdvice] = useState('');

  // Lab Orders to place
  const [selectedLabServiceId, setSelectedLabServiceId] = useState('');
  const [labPriority, setLabPriority] = useState('routine');
  const [labClinicalIndication, setLabClinicalIndication] = useState('');

  // UI state
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  // Load patients and services on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // When patient changes, load profile and timeline
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetails(selectedPatientId);
    }
  }, [selectedPatientId]);

  const fetchInitialData = async () => {
    try {
      const [ptsRes, srvRes] = await Promise.all([
        api.get('/admin/users?role=patient'),
        api.get('/admin/services?category=lab_test'),
      ]);

      if (ptsRes.data.success) {
        setPatients(ptsRes.data.users);
        if (!selectedPatientId && ptsRes.data.users.length > 0) {
          setSelectedPatientId(ptsRes.data.users[0]._id);
        }
      }

      if (srvRes.data.success) {
        setLabServices(srvRes.data.services);
      }
    } catch (err) {
      console.error('Error fetching consultation metadata:', err);
    }
  };

  const loadPatientDetails = async (pId) => {
    try {
      const res = await api.get(`/clinical/timeline/${pId}`);
      if (res.data.success) {
        setPatientData(res.data.patient);
        setTimelineEvents(res.data.timeline);
      }
    } catch (err) {
      console.error('Error loading patient timeline:', err);
    }
  };

  // Auto-calculate BMI
  const handleVitalChange = (field, val) => {
    const updated = { ...vitals, [field]: val };
    if (updated.weightKg && updated.heightCm) {
      const heightM = Number(updated.heightCm) / 100;
      if (heightM > 0) {
        updated.bmi = (Number(updated.weightKg) / (heightM * heightM)).toFixed(1);
      }
    }
    setVitals(updated);
  };

  // Trigger AI Clinician Assistant
  const handleGenerateAiSummary = async () => {
    if (!chiefComplaint && !diagnosis) {
      setNotification({
        type: 'error',
        text: 'Please enter at least Chief Complaint or Diagnosis before generating AI summary.',
      });
      return;
    }

    setAiLoading(true);
    setNotification({ type: '', text: '' });

    try {
      const res = await api.post('/ai/clinical-summary', {
        patientName: patientData?.name,
        age: patientData?.dateOfBirth
          ? new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()
          : undefined,
        gender: patientData?.gender,
        vitals,
        chiefComplaint,
        symptoms: symptoms.split(',').map((s) => s.trim()),
        historyOfPresentIllness,
        examinationFindings,
        diagnosis,
        treatmentPlan,
      });

      if (res.data.success) {
        setClinicalSummary(res.data.summary);
        setNotification({
          type: 'success',
          text: 'AI Clinical SOAP Summary generated successfully! You can review or edit below.',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: 'Failed to generate AI summary: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Medication row management
  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedicationRow = () => {
    setMedications([
      ...medications,
      {
        name: '',
        form: 'Tablet',
        dosage: '',
        frequency: 'Twice daily',
        timing: 'After meals',
        duration: '5 days',
        instructions: '',
      },
    ]);
  };

  const removeMedicationRow = (index) => {
    if (medications.length <= 1) return;
    setMedications(medications.filter((_, i) => i !== index));
  };

  // Finalize consultation
  const handleFinalizeConsultation = async () => {
    if (!selectedPatientId || !chiefComplaint || !diagnosis || !treatmentPlan) {
      setNotification({
        type: 'error',
        text: 'Please fill in required clinical fields: Patient, Chief Complaint, Diagnosis, and Treatment Plan.',
      });
      return;
    }

    setSubmitting(true);
    setNotification({ type: '', text: '' });

    try {
      // 1. Create Medical Record
      const recordRes = await api.post('/clinical/records', {
        patientId: selectedPatientId,
        appointmentId: aptId || undefined,
        vitals,
        chiefComplaint,
        symptoms: symptoms ? symptoms.split(',').map((s) => s.trim()) : [],
        historyOfPresentIllness,
        examinationFindings,
        diagnosis,
        icdCode,
        treatmentPlan,
        clinicalSummary,
        followUpDate: followUpDate || undefined,
        generateAiSummary: false, // already generated or manually filled
      });

      const recordId = recordRes.data.medicalRecord?._id;

      // 2. Create Prescription if any valid medications entered
      const validMeds = medications.filter((m) => m.name && m.name.trim() !== '');
      if (validMeds.length > 0) {
        await api.post('/clinical/prescriptions', {
          patientId: selectedPatientId,
          appointmentId: aptId || undefined,
          medicalRecordId: recordId,
          diagnosis,
          medications: validMeds,
          generalInstructions,
          dietaryAdvice,
        });
      }

      // 3. Create Lab Order if selected
      if (selectedLabServiceId) {
        await api.post('/lab/orders', {
          patientId: selectedPatientId,
          serviceId: selectedLabServiceId,
          appointmentId: aptId || undefined,
          priority: labPriority,
          clinicalIndication: labClinicalIndication || `Indication: ${diagnosis}`,
        });
      }

      setNotification({
        type: 'success',
        text: 'Clinical encounter successfully saved! Prescription and lab orders recorded.',
      });

      // Reload timeline and clear form
      loadPatientDetails(selectedPatientId);
      setTimeout(() => {
        navigate('/doctor');
      }, 1500);
    } catch (err) {
      setNotification({
        type: 'error',
        text: 'Error finalizing consultation: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Patient Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            Doctor Consultation Room
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record patient vitals, diagnosis, AI SOAP summaries, prescriptions, and diagnostics.
          </p>
        </div>

        {/* Patient Picker */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Active Patient:</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.phone || p.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Profile Card & Allergies Alert */}
      {patientData && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
              {patientData.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{patientData.name}</h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {patientData.mrn}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Blood Group: <strong className="text-slate-800">{patientData.bloodGroup}</strong> • Gender:{' '}
                <span className="capitalize">{patientData.gender}</span> • Phone: {patientData.phone}
              </p>
            </div>
          </div>

          {/* Allergies & Chronic Alert Pill */}
          <div className="flex flex-wrap gap-2">
            {patientData.allergies?.map((a, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Allergy: {a}
              </span>
            ))}
            {patientData.chronicConditions?.map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification.text && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        {[
          { id: 'clinical', label: 'Clinical Encounter & AI', icon: Stethoscope },
          { id: 'prescription', label: 'Prescription ℞', icon: Pill },
          { id: 'labs', label: 'Diagnostic Lab Order', icon: FlaskConical },
          { id: 'timeline', label: 'Patient Medical Timeline', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Clinical Encounter & AI */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          {/* Vitals Tracker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" /> Patient Vitals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">BP Sys (mmHg)</label>
                <input
                  type="number"
                  value={vitals.bloodPressureSys}
                  onChange={(e) => handleVitalChange('bloodPressureSys', e.target.value)}
                  placeholder="120"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">BP Dia (mmHg)</label>
                <input
                  type="number"
                  value={vitals.bloodPressureDia}
                  onChange={(e) => handleVitalChange('bloodPressureDia', e.target.value)}
                  placeholder="80"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pulse (bpm)</label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                  placeholder="72"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  placeholder="98.6"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                  placeholder="99"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={vitals.weightKg}
                  onChange={(e) => handleVitalChange('weightKg', e.target.value)}
                  placeholder="70"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={vitals.heightCm}
                  onChange={(e) => handleVitalChange('heightCm', e.target.value)}
                  placeholder="175"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Calculated BMI</label>
                <input
                  type="text"
                  readOnly
                  value={vitals.bmi || '--'}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Clinical Presentation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Clinical Assessment & Examination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaint *</label>
                <input
                  type="text"
                  required
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Intermittent retrosternal chest tightness on exertion"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reported Symptoms (comma separated)
                </label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Dyspnea, palpitations, mild dizziness"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                History of Present Illness (HPI)
              </label>
              <textarea
                rows={2}
                value={historyOfPresentIllness}
                onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                placeholder="Onset, duration, exacerbating factors, home medication response..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Examination Findings
              </label>
              <textarea
                rows={2}
                value={examinationFindings}
                onChange={(e) => setExaminationFindings(e.target.value)}
                placeholder="Cardiovascular: S1, S2 present, no audible murmurs. Chest clear to auscultation bilaterally..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Working Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential (primary) hypertension - Stage 1"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ICD-10 Code</label>
                <input
                  type="text"
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  placeholder="e.g. I10"
                  className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Treatment & Management Plan *
              </label>
              <textarea
                rows={2}
                required
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="Pharmacotherapy initiated. Advised low sodium diet. Baseline CBC & Lipid panel ordered..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* AI Clinician Assistant Card */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      AI Clinician Documentation Assistant
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Synthesizes visit notes and vitals into structured SOAP/SBAR summaries with vital alert flags.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiSummary}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiLoading ? 'Synthesizing SOAP...' : 'Generate AI Clinical Summary'}
                </button>
              </div>

              {clinicalSummary && (
                <div className="mt-3">
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                    Editable AI Clinical Synthesis (SOAP Format):
                  </label>
                  <textarea
                    rows={7}
                    value={clinicalSummary}
                    onChange={(e) => setClinicalSummary(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prescription Builder */}
      {activeTab === 'prescription' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                Electronic Prescription Form
              </h3>
              <p className="text-xs text-slate-500">
                Prescribe medications with frequency, dosage timing, and safety notes.
              </p>
            </div>
            <button
              type="button"
              onClick={addMedicationRow}
              className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Drug Row
            </button>
          </div>

          {/* Medications Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medication Name</th>
                  <th className="p-3">Form</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Timing</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Instructions</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medications.map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Amlodipine"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={med.form}
                        onChange={(e) => handleMedChange(idx, 'form', e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                        <option value="Inhaler">Inhaler</option>
                        <option value="Drops">Drops</option>
                        <option value="Cream">Cream</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        placeholder="e.g. 5 mg"
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="As needed (SOS)">As needed (SOS)</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={med.timing}
                        onChange={(e) => handleMedChange(idx, 'timing', e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      >
                        <option value="Before meals">Before meals</option>
                        <option value="After meals">After meals</option>
                        <option value="With meals">With meals</option>
                        <option value="At bedtime">At bedtime</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        placeholder="e.g. 10 days"
                        className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                        placeholder="e.g. With water"
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeMedicationRow(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove drug"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                General Instructions
              </label>
              <textarea
                rows={2}
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                placeholder="e.g. Complete the entire course. Do not stop without consulting."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Advice</label>
              <textarea
                rows={2}
                value={dietaryAdvice}
                onChange={(e) => setDietaryAdvice(e.target.value)}
                placeholder="e.g. Low sodium DASH diet, hydrate adequately with 2.5L water daily."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Lab Order Creator */}
      {activeTab === 'labs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              Order Diagnostic Laboratory Test
            </h3>
            <p className="text-xs text-slate-500">
              Select standard tests to be performed by the pathology department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Laboratory Test Catalog</label>
              <select
                value={selectedLabServiceId}
                onChange={(e) => setSelectedLabServiceId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- No Lab Test Required --</option>
                {labServices.map((srv) => (
                  <option key={srv._id} value={srv._id}>
                    {srv.name} (${srv.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={labPriority}
                onChange={(e) => setLabPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT (Immediate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Indication</label>
              <input
                type="text"
                value={labClinicalIndication}
                onChange={(e) => setLabClinicalIndication(e.target.value)}
                placeholder="e.g. Baseline metabolic surveillance"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Patient Medical Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" /> Longitudinal Medical Record Stream
          </h3>
          <PatientTimeline timeline={timelineEvents} />
        </div>
      )}

      {/* Follow-up & Finalize Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Follow-up Date:</label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          />
        </div>

        <button
          type="button"
          onClick={handleFinalizeConsultation}
          disabled={submitting}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          {submitting ? 'Saving EMR Record...' : 'Finalize & Complete Consultation'}
        </button>
      </div>
    </div>
  );
};
