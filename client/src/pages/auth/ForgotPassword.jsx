import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthHeader } from '../../components/AuthHeader';
import {
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step 1: Request Code | Step 2: Verify Code | Step 3: Reset Password | Step 4: Success
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [previewCode, setPreviewCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Step 1: Submit email to receive 6-digit code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        if (res.data.previewCode) {
          setPreviewCode(res.data.previewCode);
          setCode(res.data.previewCode); // auto-fill for convenience in test/demo mode
        }
        setStep(2);
        setCooldown(30);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to send verification code. Please check the email and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend code
  const handleResendCode = async () => {
    if (cooldown > 0 || loading) return;
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccessMessage('A fresh verification code has been dispatched.');
        if (res.data.previewCode) {
          setPreviewCode(res.data.previewCode);
          setCode(res.data.previewCode);
        }
        setCooldown(30);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend code. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (code.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-reset-code', {
        email,
        code: code.trim(),
      });
      if (res.data.success) {
        setSuccessMessage('Verification code confirmed! Now enter your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        code: code.trim(),
        newPassword,
      });

      if (res.data.success) {
        setStep(4);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password. The code may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-text font-sans flex flex-col justify-between selection:bg-neutral-200 selection:text-neutral-900">
      <AuthHeader subtitle="ACCOUNT SECURITY & RECOVERY" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-theme-surface border border-theme-border rounded-xl p-8 sm:p-10 shadow-lg space-y-6">
          {/* Card Header & Step Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-text">
                  Reset Password
                </h1>
                <p className="text-xs text-theme-textMuted mt-0.5">
                  Two-step clinical identity verification
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step >= 1
                      ? 'bg-neutral-900 text-white'
                      : 'bg-theme-surfaceHover text-theme-textMuted border border-theme-border'
                  }`}
                >
                  1
                </span>
                <div
                  className={`w-4 h-0.5 ${step >= 2 ? 'bg-neutral-900' : 'bg-theme-border'}`}
                />
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step >= 2
                      ? 'bg-neutral-900 text-white'
                      : 'bg-theme-surfaceHover text-theme-textMuted border border-theme-border'
                  }`}
                >
                  2
                </span>
                <div
                  className={`w-4 h-0.5 ${step >= 3 ? 'bg-neutral-900' : 'bg-theme-border'}`}
                />
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step >= 3
                      ? 'bg-neutral-900 text-white'
                      : 'bg-theme-surfaceHover text-theme-textMuted border border-theme-border'
                  }`}
                >
                  3
                </span>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Success / Notification Banner */}
            {successMessage && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div className="flex-1 font-medium">{successMessage}</div>
              </div>
            )}
          </div>

          {/* STEP 1: Enter Email Address */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Enter your registered MedAssist account email. We will generate and dispatch a 6-digit verification code.
              </p>

              <div>
                <label className="block text-xs font-mono font-medium text-theme-text uppercase tracking-wider mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-textMuted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org or patient@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-theme-surface border border-theme-border rounded-md text-theme-text placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-mono transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 px-4 rounded-md bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-theme-textMuted leading-relaxed">
                  Enter the 6-digit code sent to <strong className="text-theme-text font-medium">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  className="text-[11px] text-theme-textMuted hover:text-theme-text underline"
                >
                  Change
                </button>
              </div>

              {/* Dev Preview Helper Box */}
              {previewCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Direct Verification Code Preview</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Your code is <strong className="font-mono text-sm tracking-wider text-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">{previewCode}</strong>. (Auto-filled below).
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-medium text-theme-text uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-textMuted">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 text-center text-lg tracking-[0.5em] font-mono font-bold bg-theme-surface border border-theme-border rounded-md text-theme-text placeholder-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-theme-textMuted mt-1 block">
                  Code remains active for 15 minutes.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || code.trim().length !== 6}
                className="w-full py-2.5 px-4 rounded-md bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Continue</span>
                  </>
                )}
              </button>

              {/* Resend Action */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={cooldown > 0 || loading}
                  className="text-xs text-theme-textMuted hover:text-theme-text disabled:opacity-50 transition-colors font-medium"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Did not receive code? Resend'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Choose a strong new password with at least 6 characters.
              </p>

              <div>
                <label className="block text-xs font-mono font-medium text-theme-text uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-textMuted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-theme-surface border border-theme-border rounded-md text-theme-text placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-textMuted hover:text-theme-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-theme-text uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-textMuted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-theme-surface border border-theme-border rounded-md text-theme-text placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-mono transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full py-2.5 px-4 rounded-md bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Set New Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-theme-text">
                  Password Updated!
                </h3>
                <p className="text-xs text-theme-textMuted max-w-xs mx-auto">
                  Your account password has been successfully reset. You can now log into MedAssist using your new credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-md bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Proceed to Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Back to Login Footer Link */}
          {step !== 4 && (
            <div className="pt-4 border-t border-theme-border text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-theme-textMuted hover:text-theme-text transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-theme-textMuted border-t border-theme-border">
        <span>© 2026 MedAssist Healthcare Systems. Secure Clinical Identity Gateway.</span>
      </footer>
    </div>
  );
};
