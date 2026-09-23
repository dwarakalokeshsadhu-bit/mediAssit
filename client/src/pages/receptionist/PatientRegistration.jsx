import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { UserPlus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export const PatientRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Patient@123', // Default temporary password for walk-in patients
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: 'Unknown',
    street: '',
    city: '',
    allergies: '',
    chronicConditions: '',
    emergencyName: '',
    emergencyPhone: '',
  });

  const [createdPatient, setCreatedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        role: 'patient',
        address: { street: formData.street, city: formData.city },
        emergencyContact: { name: formData.emergencyName, phone: formData.emergencyPhone },
        allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : [],
        chronicConditions: formData.chronicConditions
          ? formData.chronicConditions.split(',').map((s) => s.trim())
          : [],
      };

      const res = await api.post('/auth/register', payload);
      if (res.data.success) {
        setCreatedPatient(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Patient registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-emerald-600" />
            Walk-In Patient Registration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register new clinic patients and automatically generate Medical Record Number (MRN).
          </p>
        </div>
      </div>

      {createdPatient ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Patient Registered Successfully!</h3>
          <p className="text-xs text-slate-600">
            Medical Record Number:{' '}
            <strong className="font-mono text-emerald-700 text-sm">
              {createdPatient.profile?.mrn}
            </strong>
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setCreatedPatient(null);
                setFormData({
                  name: '',
                  email: '',
                  password: 'Patient@123',
                  phone: '',
                  dateOfBirth: '',
                  gender: 'male',
                  bloodGroup: 'Unknown',
                  street: '',
                  city: '',
                  allergies: '',
                  chronicConditions: '',
                  emergencyName: '',
                  emergencyPhone: '',
                });
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Register Another Patient
            </button>
            <button
              onClick={() =>
                navigate(`/reception/booking?patientId=${createdPatient.user?.id}`)
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Appointment Now
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Patient Demographics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full patient legal name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Clinical Flags & Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Sulfa"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Name & Phone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Record...' : 'Complete Patient Registration & Issue MRN'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
