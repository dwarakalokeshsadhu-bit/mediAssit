import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  HeartPulse,
  Calendar,
  Pill,
  FlaskConical,
  Receipt,
  Activity,
  ArrowRight,
  Sparkles,
  Droplet,
  Shield,
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientPortalData();
  }, []);

  const fetchPatientPortalData = async () => {
    try {
      setLoading(true);
      const [aptRes, rxRes, labRes, invRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/clinical/prescriptions'),
        api.get('/lab/orders'),
        api.get('/billing/invoices'),
      ]);

      if (aptRes.data.success) setAppointments(aptRes.data.appointments);
      if (rxRes.data.success) setPrescriptions(rxRes.data.prescriptions);
      if (labRes.data.success) setLabReports(labRes.data.orders);
      if (invRes.data.success) setInvoices(invRes.data.invoices);
    } catch (err) {
      console.error('Error fetching patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingApt = appointments.find(
    (a) => a.status === 'scheduled' || a.status === 'checked_in'
  );
  const activeRx = prescriptions[0];

  return (
    <div className="space-y-6 page-transition font-display text-black">
      {/* Patient Header Card - White Surface */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 text-black font-bold">
              MRN: {profile?.mrn || 'MRN-2026-0001'}
            </span>
            <span className="text-slate-400 font-mono">•</span>
            <span className="text-[11px] font-mono text-rose-600 font-bold flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-rose-600" />
              BLOOD GROUP: {profile?.bloodGroup || 'B+'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-black uppercase">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs font-mono font-bold text-slate-500">
            Outpatient Health Portal • Longitudinal Medical Records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patient/timeline')}
            className="px-5 py-3 rounded-2xl bg-black text-white hover:bg-slate-800 text-xs font-display font-black tracking-wider uppercase flex items-center gap-2 shadow-md transition-all"
          >
            <Activity className="w-4 h-4" /> View Full Health Timeline
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/patient/appointments')}
          className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              01 / APPOINTMENTS
            </span>
            <Calendar className="w-5 h-5 text-black" />
          </div>
          <h3 className="font-display text-4xl font-black text-black">
            {appointments.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Recorded visits</p>
        </div>

        <div
          onClick={() => navigate('/patient/prescriptions')}
          className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              02 / PRESCRIPTIONS
            </span>
            <Pill className="w-5 h-5 text-black" />
          </div>
          <h3 className="font-display text-4xl font-black text-black">
            {prescriptions.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Active medical regimens</p>
        </div>

        <div
          onClick={() => navigate('/patient/lab-reports')}
          className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              03 / LAB ORDERS
            </span>
            <FlaskConical className="w-5 h-5 text-black" />
          </div>
          <h3 className="font-display text-4xl font-black text-black">
            {labReports.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Diagnostic investigations</p>
        </div>

        <div
          onClick={() => navigate('/patient/invoices')}
          className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              04 / BILLING
            </span>
            <Receipt className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-display text-4xl font-black text-black">
            {invoices.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Statements & receipts</p>
        </div>
      </div>

      {/* Active Encounters & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-black text-black uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black" />
              Upcoming Consultation
            </h3>
            {upcomingApt && <StatusBadge status={upcomingApt.status} />}
          </div>

          {upcomingApt ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-base text-black block">
                    {upcomingApt.doctor?.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {upcomingApt.department?.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-black block">
                    {upcomingApt.appointmentDate}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {upcomingApt.timeSlot}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <span>Queue Token Assigned:</span>
                <span className="font-black text-black text-sm">#{upcomingApt.queueNumber}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No upcoming appointments. Schedule one through reception.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-black text-black uppercase flex items-center gap-2">
              <Pill className="w-4 h-4 text-black" />
              Active Medication Regimen
            </h3>
            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="text-xs font-mono font-black text-black hover:underline flex items-center gap-1"
            >
              All RX <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {activeRx ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-black">
                    {activeRx.prescriptionNumber}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Dr. {activeRx.doctor?.name}
                  </span>
                </div>
                <p className="font-display font-black text-xs text-black">
                  Diagnosis: {activeRx.diagnosis || 'Clinical follow-up'}
                </p>

                <div className="space-y-1 pt-1 border-t border-slate-200">
                  {activeRx.medications?.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-mono">
                      <span className="text-black font-bold">{m.name}</span>
                      <span className="text-slate-600 font-bold">{m.dosage} • {m.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/patient/prescriptions')}
                className="w-full py-3 rounded-xl bg-black text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Explain Regimen in Plain English (AI)
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No active prescriptions on file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
