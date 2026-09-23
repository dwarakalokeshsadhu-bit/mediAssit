import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Calendar, Filter, Clock, Search } from 'lucide-react';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [dateFilter, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateFilter) params.date = dateFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/appointments', { params });
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await api.patch(`/appointments/${aptId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            My Appointment Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage daily schedule, view patient details, and handle status transitions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="checked_in">Checked In</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">No appointments found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Date & Slot</th>
                  <th className="px-6 py-3">Token</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Reason for Visit</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{apt.appointmentDate}</span>
                      <span className="text-[11px] font-mono text-slate-500">{apt.timeSlot}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-700">
                      #{apt.queueNumber}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{apt.patient?.name}</span>
                      <span className="text-[11px] text-slate-400">{apt.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">{apt.reasonForVisit}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="checked_in">Checked In</option>
                        <option value="in_consultation">In Consultation</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </select>
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
