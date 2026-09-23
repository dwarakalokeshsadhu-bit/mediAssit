import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Stethoscope,
  Calendar,
  FlaskConical,
  Receipt,
  ShieldCheck,
  ArrowRight,
  Clock,
  TrendingUp,
  Settings,
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/metrics');
      if (res.data.success) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Executive Clinic Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System overview, clinical volume, revenue performance, and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-4 h-4" /> Manage Staff
          </button>
          <button
            onClick={() => navigate('/admin/services')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4" /> Services & Fees
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Patients</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {metrics?.totalPatients || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Physicians</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {metrics?.totalDoctors || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Visits</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {metrics?.todayAppointments || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ${metrics?.totalRevenue || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Two Column Section: Clinical Pipeline + Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab & Diagnostic Pipeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-600" />
            Diagnostic & Lab Pipeline
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
              <span className="text-2xl font-black text-amber-800 block">
                {metrics?.pendingLabs || 0}
              </span>
              <span className="text-xs font-semibold text-amber-900 mt-1 block">
                Pending Specimens / Analysis
              </span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
              <span className="text-2xl font-black text-emerald-800 block">
                {metrics?.verifiedLabs || 0}
              </span>
              <span className="text-xs font-semibold text-emerald-900 mt-1 block">
                Verified & Released Reports
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs font-mono">
            <span>Outstanding Patient Balances:</span>
            <span className="font-bold text-rose-600">${metrics?.pendingBilling || 0}</span>
          </div>
        </div>

        {/* Security & Audit Trail Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Recent Immutable Audit Trail
            </h3>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
            >
              Full Log <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {metrics?.recentLogs?.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-800 block">{log.action}</span>
                  <span className="text-[11px] text-slate-500">
                    By {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-400">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
