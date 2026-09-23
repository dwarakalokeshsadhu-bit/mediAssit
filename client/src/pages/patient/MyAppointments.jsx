import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Calendar, Clock, Plus, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Failed to load patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookModal = async () => {
    setBookModalOpen(true);
    setNotification('');
    try {
      const [dpRes, docRes] = await Promise.all([
        api.get('/admin/departments'),
        api.get('/admin/users?role=doctor'),
      ]);
      if (dpRes.data.success) setDepartments(dpRes.data.departments);
      if (docRes.data.success) {
        setDoctors(docRes.data.users);
        if (docRes.data.users.length > 0) {
          setSelectedDoc(docRes.data.users[0]._id);
          loadSlots(docRes.data.users[0]._id, selectedDate);
        }
      }
    } catch (e) {
      console.error('Error fetching departments:', e);
    }
  };

  const loadSlots = async (docId, date) => {
    try {
      const res = await api.get(`/appointments/slots?doctorId=${docId}&date=${date}`);
      if (res.data.success) setSlots(res.data.slots);
    } catch (e) {
      console.error('Error loading slots:', e);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !selectedSlot || !reason) return;

    setSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        doctorId: selectedDoc,
        departmentId: selectedDept || departments[0]?._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reasonForVisit: reason,
      });

      if (res.data.success) {
        setBookModalOpen(false);
        fetchMyAppointments();
      }
    } catch (err) {
      setNotification(err.response?.data?.message || 'Booking conflict or error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            My Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View your consultation schedule, check queue tokens, and schedule new visits.
          </p>
        </div>

        <button
          onClick={handleOpenBookModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule New Visit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">You have no scheduled appointments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time Slot</th>
                  <th className="px-6 py-3">Doctor & Dept</th>
                  <th className="px-6 py-3">Token #</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{apt.appointmentDate}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">{apt.timeSlot}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{apt.doctor?.name}</span>
                      <span className="text-[11px] text-slate-500">{apt.department?.name}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">#{apt.queueNumber}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">{apt.reasonForVisit}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <Modal
          isOpen={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          title="Book Doctor Appointment"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleBookSubmit} className="space-y-4">
            {notification && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Physician *</label>
              <select
                value={selectedDoc}
                onChange={(e) => {
                  setSelectedDoc(e.target.value);
                  loadSlots(e.target.value, selectedDate);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Date *</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  loadSlots(selectedDoc, e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Slots *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                {slots.map((s) => (
                  <button
                    key={s.slot}
                    type="button"
                    disabled={!s.isAvailable}
                    onClick={() => setSelectedSlot(s.slot)}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-mono font-semibold border ${
                      !s.isAvailable
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                        : selectedSlot === s.slot
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s.slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chronic blood pressure check"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
