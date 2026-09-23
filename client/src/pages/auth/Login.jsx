import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { AuthHeader } from '../../components/AuthHeader';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  User,
  ShieldCheck,
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [portalMode, setPortalMode] = useState('staff'); // 'staff' | 'patient'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      redirectRole(data.user.role);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please verify your email/username and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleKey) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      if (roleKey === 'patient') {
        setPortalMode('patient');
      } else {
        setPortalMode('staff');
      }
      setError('');
    }
  };

  const redirectRole = (r) => {
    if (r === 'admin') navigate('/admin');
    else if (r === 'doctor') navigate('/doctor');
    else if (r === 'receptionist') navigate('/reception');
    else if (r === 'lab_tech') navigate('/lab');
    else if (r === 'patient') navigate('/patient');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-text font-sans flex flex-col justify-between selection:bg-theme-border selection:text-theme-text">
      {/* Focused Minimal Auth Header */}
      <AuthHeader subtitle="CLINICAL OPERATIONS & PATIENT LOGIN" />

      {/* Main Container: Centered Single-Column Form Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-theme-surface border border-theme-border rounded-lg p-8 sm:p-10 shadow-lg space-y-6">
          {/* Card Header & Role-Aware Framing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-text">
                  Portal Login
                </h1>
                <p className="text-xs text-theme-textMuted mt-0.5">
                  {portalMode === 'staff'
                    ? 'Clinical operations & staff access'
                    : 'Outpatient self-service portal'}
                </p>
              </div>

              {/* Simple, Non-gimmicky Role Framing Toggle */}
              <div className="inline-flex rounded-md bg-theme-base border border-theme-border p-0.5">
                <button
                  type="button"
                  onClick={() => setPortalMode('staff')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded ${
                    portalMode === 'staff'
                      ? 'bg-theme-surface text-theme-text font-semibold shadow-sm'
                      : 'text-theme-textMuted hover:text-theme-text'
                  } transition-colors`}
                  title="Reception, Medical Staff, Administration"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortalMode('patient')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded ${
                    portalMode === 'patient'
                      ? 'bg-theme-surface text-theme-text font-semibold shadow-sm'
                      : 'text-theme-textMuted hover:text-theme-text'
                  } transition-colors`}
                  title="Patient Portal"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient</span>
                </button>
              </div>
            </div>

            {portalMode === 'staff' ? (
              <div className="text-xs text-theme-textMuted bg-theme-base/50 p-2.5 rounded border border-theme-border flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-theme-text shrink-0" />
                <span>Authorized for physicians, receptionists, nurses & administrators.</span>
              </div>
            ) : (
              <div className="text-xs text-theme-textMuted bg-theme-base/50 p-2.5 rounded border border-theme-border flex items-center gap-2">
                <User className="w-4 h-4 text-theme-text shrink-0" />
                <span>Access your prescriptions, appointments, and diagnostic results.</span>
              </div>
            )}
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
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-theme-text mb-1.5"
              >
                {portalMode === 'staff' ? 'Institutional Email / Username' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-theme-textMuted absolute left-3 top-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    portalMode === 'staff' ? 'staff@medassist.clinic' : 'patient@example.com'
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-theme-base border border-theme-border rounded-md text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-theme-text transition-colors"
                />
              </div>
            </div>

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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Remember Me Checkbox & Forgot Password Link */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-theme-textMuted hover:text-theme-text">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-theme-base border-theme-border text-theme-text focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert(
                    'For security, password resets are coordinated through your clinic administrator or front-desk verification.'
                  )
                }
                className="text-theme-textMuted hover:text-theme-text transition-colors underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-theme-text text-theme-base font-semibold text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 shadow-sm mt-2"
            >
              {loading ? 'Verifying Credentials...' : 'Log In'}
            </button>
          </form>

          {/* Clean Demo Quick-Fill for Evaluation */}
          <div className="pt-2 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="w-full text-center text-[11px] font-mono text-theme-textMuted hover:text-theme-text transition-colors"
            >
              {showDemoCredentials ? '▲ Hide Quick-Fill Accounts' : '▼ Quick-Fill Test Roles'}
            </button>

            {showDemoCredentials && (
              <div className="mt-2.5 grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                {[
                  { key: 'admin', label: 'Admin' },
                  { key: 'doctor', label: 'Doctor' },
                  { key: 'receptionist', label: 'Reception' },
                  { key: 'lab_tech', label: 'Lab Tech' },
                  { key: 'patient', label: 'Patient' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleQuickFill(item.key)}
                    className="py-1 px-1.5 rounded text-[10px] font-mono border border-theme-border bg-theme-base hover:bg-theme-surface text-theme-textMuted hover:text-theme-text text-center transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Small link below card: Register */}
          <div className="pt-4 border-t border-theme-border text-center text-xs text-theme-textMuted">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="text-theme-text font-semibold hover:underline underline-offset-2"
            >
              Register
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
