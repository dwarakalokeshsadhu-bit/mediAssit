import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Search,
} from 'lucide-react';

export const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const [todayApts, setTodayApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingStats, setBillingStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const [aptRes, billRes] = await Promise.all([
        api.get(`/appointments?date=${today}`),
        api.get('/billing/stats'),
      ]);

      if (aptRes.data.success) {
        setTodayApts(aptRes.data.appointments);
      }
      if (billRes.data.success) {
        setBillingStats(billRes.data.stats);
      }
    } catch (err) {
      console.error('Error fetching reception dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (aptId) => {
    try {
      await api.patch(`/appointments/${aptId}/status`, { status: 'checked_in' });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to check in patient:', err);
    }
  };

  const waitingCount = todayApts.filter((a) => a.status === 'checked_in').length;
  const inConsultCount = todayApts.filter((a) => a.status === 'in_consultation').length;
  const scheduledCount = todayApts.filter((a) => a.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Front Desk & Reception Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient registration, queue management, doctor appointments, and cashier settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/reception/register')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Register Walk-In
          </button>
          <button
            onClick={() => navigate('/reception/booking')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
          <button
            onClick={() => navigate('/reception/queue')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4" /> Queue Board
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Waiting Lounge</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{waitingCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting Arrival</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{scheduledCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">With Doctor</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{inConsultCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Collected</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ${billingStats?.totalCollected || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Today's Check-in List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Appointments & Fast Check-In</h3>
            <p className="text-xs text-slate-400">Click Check-in when a patient arrives at reception</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : todayApts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Token</th>
                  <th className="px-6 py-3">Slot</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Doctor & Dept</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayApts.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                      #{apt.queueNumber}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">{apt.timeSlot}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{apt.patient?.name}</span>
                      <span className="text-[11px] text-slate-400">{apt.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-800 block">{apt.doctor?.name}</span>
                      <span className="text-[11px] text-slate-500">{apt.department?.name}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {apt.status === 'scheduled' ? (
                        <button
                          onClick={() => handleCheckIn(apt._id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check In
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          {apt.status === 'checked_in' ? 'In Queue' : 'Processed'}
                        </span>
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
