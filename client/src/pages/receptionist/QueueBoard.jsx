import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Clock, Users, ArrowRight, CheckCircle2, RotateCw, Stethoscope } from 'lucide-react';

export const QueueBoard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // 15s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get(`/appointments?date=${today}`);
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching queue board:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchQueue();
    } catch (err) {
      console.error('Status transition failed:', err);
    }
  };

  const scheduled = appointments.filter((a) => a.status === 'scheduled');
  const waiting = appointments.filter((a) => a.status === 'checked_in');
  const inConsult = appointments.filter((a) => a.status === 'in_consultation');
  const completed = appointments.filter((a) => a.status === 'completed');

  const renderQueueColumn = (title, items, borderTopColor, emptyMsg, nextAction) => (
    <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col min-h-[500px]">
      <div className={`border-t-4 ${borderTopColor} pt-2 mb-3 flex items-center justify-between`}>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-bold flex items-center justify-center shadow-xs">
          {items.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 italic">{emptyMsg}</div>
        ) : (
          items.map((apt) => (
            <div
              key={apt._id}
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  Token #{apt.queueNumber}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{apt.timeSlot}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{apt.patient?.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{apt.doctor?.name}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{apt.reasonForVisit}</p>
              </div>

              {nextAction && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => updateStatus(apt._id, nextAction.status)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors ${nextAction.color}`}
                  >
                    {nextAction.label} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-800" />
            Live Clinic Queue Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time outpatient status tracker from check-in to consultation and completion.
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" /> Refresh Live
        </button>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderQueueColumn(
          '1. Expected Arrivals',
          scheduled,
          'border-blue-500',
          'No scheduled arrivals waiting',
          { label: 'Check In', status: 'checked_in', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' }
        )}

        {renderQueueColumn(
          '2. Waiting in Lounge',
          waiting,
          'border-amber-500',
          'Waiting room is clear',
          { label: 'Call Patient', status: 'in_consultation', color: 'bg-amber-600 hover:bg-amber-700 text-white' }
        )}

        {renderQueueColumn(
          '3. In Consultation',
          inConsult,
          'border-emerald-500',
          'No active consultations',
          { label: 'Mark Done', status: 'completed', color: 'bg-slate-800 hover:bg-slate-900 text-white' }
        )}

        {renderQueueColumn(
          '4. Completed Today',
          completed,
          'border-slate-400',
          'No completed visits yet today',
          null
        )}
      </div>
    </div>
  );
};
