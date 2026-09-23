import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Clock, AlertCircle, CheckCircle2, User, Stethoscope } from 'lucide-react';

export const AppointmentBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(preselectedPatientId || '');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('routine');

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '', token: null });

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadSlots(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const loadMetadata = async () => {
    try {
      const [ptRes, dpRes, docRes] = await Promise.all([
        api.get('/admin/users?role=patient'),
        api.get('/admin/departments'),
        api.get('/admin/users?role=doctor'),
      ]);

      if (ptRes.data.success) setPatients(ptRes.data.users);
      if (dpRes.data.success) {
        setDepartments(dpRes.data.departments);
        if (dpRes.data.departments.length > 0) {
          setSelectedDept(dpRes.data.departments[0]._id);
        }
      }
      if (docRes.data.success) {
        setDoctors(docRes.data.users);
        if (docRes.data.users.length > 0) {
          setSelectedDoctor(docRes.data.users[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load booking metadata:', err);
    }
  };

  const loadSlots = async (docId, date) => {
    setLoadingSlots(true);
    try {
      const res = await api.get(`/appointments/slots?doctorId=${docId}&date=${date}`);
      if (res.data.success) {
        setSlots(res.data.slots);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !selectedDoctor || !selectedDept || !selectedDate || !selectedSlot || !reason) {
      setNotification({ type: 'error', text: 'Please complete all appointment fields and select an available time slot.' });
      return;
    }

    setSubmitting(true);
    setNotification({ type: '', text: '' });

    try {
      const res = await api.post('/appointments', {
        patientId: selectedPatient,
        doctorId: selectedDoctor,
        departmentId: selectedDept,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reasonForVisit: reason,
        type,
      });

      if (res.data.success) {
        setNotification({
          type: 'success',
          text: `Appointment booked successfully! Token #${res.data.appointment?.queueNumber}`,
          token: res.data.appointment?.queueNumber,
        });
        setSelectedSlot('');
        setReason('');
        loadSlots(selectedDoctor, selectedDate);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Failed to book appointment due to conflict or error.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Schedule Clinic Appointment
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select physician, check real-time availability slots, prevent double booking, and issue queue tokens.
        </p>
      </div>

      {notification.text && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          {notification.token && (
            <button
              onClick={() => navigate('/reception/queue')}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              View on Queue Board →
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Step 1: Select Patient, Department & Doctor */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phone || p.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Doctor *</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Date & Slots */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" /> Select Date & Available Time Slot
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-300" /> Booked
              </span>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          {/* Slot Grid */}
          {loadingSlots ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading doctor's availability...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {slots.map((s) => {
                const isSelected = selectedSlot === s.slot;
                return (
                  <button
                    key={s.slot}
                    type="button"
                    disabled={!s.isAvailable}
                    onClick={() => setSelectedSlot(s.slot)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-semibold transition-all border ${
                      !s.isAvailable
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 hover:border-blue-300 border-slate-200 hover:bg-blue-50/50'
                    }`}
                  >
                    {s.slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Reason & Appointment Type */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Follow-up for blood pressure and review laboratory results"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Encounter Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            >
              <option value="routine">Routine Check-Up</option>
              <option value="follow_up">Follow-Up</option>
              <option value="walk_in">Walk-In Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedSlot}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? 'Checking Conflicts & Booking...' : `Confirm Booking for ${selectedSlot || 'Selected Slot'}`}
        </button>
      </form>
    </div>
  );
};
