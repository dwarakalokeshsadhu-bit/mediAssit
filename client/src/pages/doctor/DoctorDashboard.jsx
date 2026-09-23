import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Stethoscope,
  Sparkles,
  AlertCircle,
  Search,
  Activity,
} from 'lucide-react';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayApts, setTodayApts] = useState([]);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const resQueue = await api.get('/appointments/queue/today');
      if (resQueue.data.success) {
        setQueue(resQueue.data.queue);
        setTodayApts(resQueue.data.queue);
      }
    } catch (err) {
      console.error('Error loading doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (apt) => {
    try {
      if (apt.status === 'checked_in') {
        await api.patch(`/appointments/${apt._id}/status`, { status: 'in_consultation' });
      }
      navigate(`/doctor/consultation?aptId=${apt._id}&patientId=${apt.patient?._id}`);
    } catch (err) {
      console.error('Failed to start consultation:', err);
    }
  };

  const waitingPatients = queue.filter((a) => a.status === 'checked_in');
  const inConsultation = queue.filter((a) => a.status === 'in_consultation');
  const completed = queue.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-6 page-transition font-display text-black">
      {/* Top Banner: Crisp White with Bold Black Font */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>CLINICAL WORKSPACE • OUTPATIENT QUEUE ACTIVE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-black uppercase">
            Doctor Clinical Operations
          </h1>
          <p className="text-xs text-slate-600 font-bold leading-relaxed">
            Outpatient queue tokens, vital parameter tracking, and AI-powered SOAP clinical synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor/consultation')}
            className="px-6 py-3 bg-black text-white hover:bg-slate-800 text-xs font-display font-black tracking-wider uppercase rounded-2xl shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Open Consultation Room
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards - Clean White Background with Bold Black Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              01 / WAITING ROOM
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-display text-4xl font-black text-black tracking-tight">
            {waitingPatients.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Patients in waiting lounge</p>
        </div>

        <div className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              02 / ACTIVE ROOM
            </span>
            <Stethoscope className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-display text-4xl font-black text-black tracking-tight">
            {inConsultation.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">In consultation right now</p>
        </div>

        <div className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              03 / TODAY'S SCHEDULE
            </span>
            <Calendar className="w-5 h-5 text-black" />
          </div>
          <h3 className="font-display text-4xl font-black text-black tracking-tight">
            {todayApts.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Total appointments booked</p>
        </div>

        <div className="editorial-card-light p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              04 / COMPLETED
            </span>
            <CheckCircle2 className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="font-display text-4xl font-black text-black tracking-tight">
            {completed.length}
          </h3>
          <p className="text-xs font-bold text-slate-600">Discharged & notes signed</p>
        </div>
      </div>

      {/* Patient Queue Table - Crisp White Surface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-display text-base font-black text-black tracking-tight uppercase">
              Today's Outpatient Token Queue
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Sequential queue tokens and active patient status
            </p>
          </div>
          <button
            onClick={fetchTodayData}
            className="text-xs font-mono font-bold text-black hover:underline underline-offset-4"
          >
            Refresh Queue
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold text-xs">
            No patients currently in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-display">
              <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[11px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-6 py-4">Token #</th>
                  <th className="px-6 py-4">Time Slot</th>
                  <th className="px-6 py-4">Patient Details</th>
                  <th className="px-6 py-4">Reason for Visit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {queue.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-black">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-bold">
                        #{apt.queueNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">{apt.timeSlot}</td>
                    <td className="px-6 py-4">
                      <span className="font-black text-black block text-sm">{apt.patient?.name}</span>
                      <span className="text-xs text-slate-500 font-mono font-bold">{apt.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-bold max-w-xs truncate">
                      {apt.reasonForVisit}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {apt.status === 'checked_in' ? (
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="px-4 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ml-auto shadow-sm transition-all"
                        >
                          Call Patient <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : apt.status === 'in_consultation' ? (
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ml-auto shadow-sm transition-all"
                        >
                          Resume Room <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                        >
                          Review Record
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
