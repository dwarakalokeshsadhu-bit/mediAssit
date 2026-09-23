import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthHeader } from '../../components/AuthHeader';
import {
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // 'patient' | 'receptionist' | 'doctor'
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter a contact phone number.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!formData.acceptTerms) {
      setError('You must acknowledge and accept the Terms of Clinical Service and Privacy Notice.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      };

      const res = await register(payload);

      // Route based on role
      if (formData.role === 'patient') {
        navigate('/patient');
      } else if (formData.role === 'receptionist') {
        navigate('/reception');
      } else if (formData.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration could not be completed. An account with this email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-text font-sans flex flex-col justify-between selection:bg-theme-border selection:text-theme-text">
      {/* Focused Minimal Auth Header */}
      <AuthHeader subtitle="CLINICAL OPERATIONS & PATIENT REGISTRATION" />

      {/* Main Container: Centered Single-Column Form Card (Matching Login visual weight & spacing) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-theme-surface border border-theme-border rounded-lg p-8 sm:p-10 shadow-lg space-y-6">
          {/* Card Header */}
          <div className="border-b border-theme-border pb-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-text">
              Create an Account
            </h1>
            <p className="text-xs text-theme-textMuted mt-0.5">
              Register for MedAssist patient care or clinical operations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-md flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection: Simple, non-decorative radio group */}
            <div>
              <label className="block text-xs font-medium text-theme-text mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-xs cursor-pointer transition-colors ${
                    formData.role === 'patient'
                      ? 'border-theme-text bg-theme-base text-theme-text font-semibold'
                      : 'border-theme-border bg-theme-base/50 text-theme-textMuted hover:text-theme-text'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === 'patient'}
                    onChange={handleChange}
                    className="text-theme-text bg-theme-base border-theme-border focus:ring-0"
                  />
                  <span>Patient (Outpatient)</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-xs cursor-pointer transition-colors ${
                    formData.role === 'receptionist'
                      ? 'border-theme-text bg-theme-base text-theme-text font-semibold'
                      : 'border-theme-border bg-theme-base/50 text-theme-textMuted hover:text-theme-text'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="receptionist"
                    checked={formData.role === 'receptionist'}
                    onChange={handleChange}
                    className="text-theme-text bg-theme-base border-theme-border focus:ring-0"
                  />
                  <span>Clinic Staff (Reception)</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jane.doe@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-theme-textMuted hover:text-theme-text transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-theme-textMuted hover:text-theme-text transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Acceptance Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-theme-textMuted hover:text-theme-text">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded bg-theme-base border-theme-border text-theme-text focus:ring-0"
                />
                <span className="leading-snug">
                  I agree to the MedAssist{' '}
                  <span className="text-theme-text underline underline-offset-2">
                    Terms of Clinical Service
                  </span>{' '}
                  and acknowledge the{' '}
                  <span className="text-theme-text underline underline-offset-2">
                    HIPAA Privacy Notice
                  </span>
                  .
                </span>
              </label>
            </div>

            {/* Primary Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-theme-text text-theme-base font-semibold text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 shadow-sm mt-3"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Small link below card: Login */}
          <div className="pt-4 border-t border-theme-border text-center text-xs text-theme-textMuted">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-theme-text font-semibold hover:underline underline-offset-2"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-theme-textMuted border-t border-theme-border">
        <span>© 2026 MedAssist Healthcare Systems. Confidential Clinical Portal.</span>
      </footer>
    </div>
  );
};
