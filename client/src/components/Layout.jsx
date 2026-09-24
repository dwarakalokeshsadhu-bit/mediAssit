import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import {
  HeartPulse,
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Receipt,
  UserPlus,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Activity,
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { user, role, logout, quickLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard },
          { to: '/admin/users', label: 'Staff & Patient Directory', icon: Users },
          { to: '/admin/services', label: 'Departments & Pricing', icon: Settings },
          { to: '/admin/audit-logs', label: 'Security & Audit Logs', icon: ShieldCheck },
        ];
      case 'doctor':
        return [
          { to: '/doctor', label: 'Doctor Dashboard', icon: LayoutDashboard },
          { to: '/doctor/consultation', label: 'Consultation Room & AI', icon: Stethoscope },
          { to: '/doctor/appointments', label: 'My Appointments', icon: Calendar },
        ];
      case 'receptionist':
        return [
          { to: '/reception', label: 'Reception Dashboard', icon: LayoutDashboard },
          { to: '/reception/register', label: 'Patient Registration', icon: UserPlus },
          { to: '/reception/booking', label: 'Book Appointment', icon: Calendar },
          { to: '/reception/queue', label: 'Live Queue Board', icon: Clock },
          { to: '/reception/billing', label: 'Billing & Cashier', icon: Receipt },
        ];
      case 'lab_tech':
        return [
          { to: '/lab', label: 'Lab Dashboard', icon: LayoutDashboard },
          { to: '/lab/queue', label: 'Test Orders & Verification', icon: FlaskConical },
        ];
      case 'patient':
        return [
          { to: '/patient', label: 'Patient Portal', icon: LayoutDashboard },
          { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
          { to: '/patient/prescriptions', label: 'My Prescriptions', icon: Pill },
          { to: '/patient/lab-reports', label: 'Lab Reports', icon: FlaskConical },
          { to: '/patient/invoices', label: 'Billing & Receipts', icon: Receipt },
          { to: '/patient/timeline', label: 'My Health Timeline', icon: Activity },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleQuickSwitch = async (targetRole) => {
    try {
      await quickLogin(targetRole);
      setRoleSwitcherOpen(false);
      if (targetRole === 'admin') navigate('/admin');
      if (targetRole === 'doctor') navigate('/doctor');
      if (targetRole === 'receptionist') navigate('/reception');
      if (targetRole === 'lab_tech') navigate('/lab');
      if (targetRole === 'patient') navigate('/patient');
    } catch (e) {
      console.error('Role switch failed:', e.message);
    }
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-text flex flex-col font-sans selection:bg-neutral-200 selection:text-neutral-900">
      {/* Top Navbar: Surface with subtle 1px border */}
      <header className="sticky top-0 z-40 bg-theme-surface border-b border-theme-border shadow-xs no-print">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-theme-textMuted hover:text-theme-text bg-theme-surface hover:bg-theme-surfaceHover rounded-full transition-colors border border-theme-border"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-theme-surface border border-theme-border text-theme-text flex items-center justify-center font-semibold shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-base font-semibold tracking-tight text-theme-text flex items-center gap-1.5 leading-tight">
                  MEDASSIST
                  <span className="text-[10px] font-mono font-medium uppercase tracking-widest bg-theme-surfaceHover text-theme-textMuted px-1.5 py-0.5 rounded border border-theme-border">
                    2.0
                  </span>
                </span>
                <span className="text-[11px] text-theme-textMuted block hidden sm:block font-normal">
                  Clinic Operations & Patient Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Demo Switcher + User Info */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-xs font-mono font-medium text-theme-text transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-theme-textMuted" />
                <span className="hidden md:inline text-theme-textMuted">ROLE:</span>
                <span className="uppercase text-theme-text font-semibold">{role?.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-theme-textMuted" />
              </button>

              {roleSwitcherOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-theme-surface rounded-lg shadow-xl border border-theme-border p-1.5 z-50 animate-in fade-in duration-150"
                  onClick={() => setRoleSwitcherOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-theme-textMuted border-b border-theme-border mb-1 flex items-center justify-between">
                    <span>SWITCH PERSONA</span>
                    <span className="text-theme-text font-semibold">1-CLICK</span>
                  </div>
                  {Object.entries(DEMO_CREDENTIALS).map(([rKey, cred]) => (
                    <button
                      key={rKey}
                      onClick={() => handleQuickSwitch(rKey)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                        role === rKey
                          ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                          : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceHover'
                      }`}
                    >
                      <span className="truncate pr-2">{cred.label}</span>
                      {role === rKey && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current User Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-theme-border">
              <div className="w-8 h-8 rounded-full bg-theme-surfaceHover border border-theme-border text-theme-text flex items-center justify-center font-display font-semibold text-xs shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-theme-text leading-none">{user?.name}</p>
                <span className="text-[10px] uppercase tracking-wider text-theme-textMuted mt-0.5 block font-medium">
                  {role?.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 text-theme-textMuted hover:text-theme-text bg-theme-surface hover:bg-theme-surfaceHover rounded-full transition-colors border border-theme-border"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop: Surface with subtle border */}
        <aside className="hidden lg:flex flex-col justify-between w-64 bg-theme-surface border-r border-theme-border p-4 space-y-1 shrink-0 no-print">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-theme-textMuted font-medium">
              {role?.replace('_', ' ')} WORKSPACE
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceHover'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-theme-textMuted'}`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Minimal Status Card in Sidebar */}
          <div className="p-3.5 rounded-lg border border-theme-border bg-theme-base space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-theme-textMuted uppercase font-medium">
              <span>SYSTEM ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-theme-text">
              HL7 / HIPAA Architecture
            </p>
            <p className="text-[10px] text-theme-textMuted">Audit trail secured</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 h-full bg-theme-surface p-5 space-y-3 border-r border-theme-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-theme-border">
                <span className="font-semibold text-theme-text text-sm">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-theme-textMuted hover:text-theme-text bg-theme-surface hover:bg-theme-surfaceHover rounded-full border border-theme-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                        : 'text-theme-textMuted hover:bg-theme-surfaceHover hover:text-theme-text'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Viewport Content with Base Background */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full page-transition bg-theme-base text-theme-text">
          {children}
        </main>
      </div>
    </div>
  );
};
