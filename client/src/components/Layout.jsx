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
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] flex flex-col font-sans selection:bg-[#262626] selection:text-[#fafafa]">
      {/* Top Navbar: Surface #171717 with subtle #262626 1px border */}
      <header className="sticky top-0 z-40 bg-[#171717] border-b border-[#262626] shadow-xs no-print">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#a3a3a3] hover:text-[#fafafa] bg-[#262626] hover:bg-[#333333] rounded-full transition-colors border border-[#262626]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#262626] border border-[#333333] text-[#fafafa] flex items-center justify-center font-semibold shadow-sm">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-base font-semibold tracking-tight text-[#fafafa] flex items-center gap-1.5 leading-tight">
                  MEDASSIST
                  <span className="text-[10px] font-mono font-medium uppercase tracking-widest bg-[#262626] text-[#a3a3a3] px-1.5 py-0.5 rounded border border-[#333333]">
                    2.0
                  </span>
                </span>
                <span className="text-[11px] text-[#a3a3a3] block hidden sm:block font-normal">
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#262626] bg-[#171717] hover:bg-[#212121] text-xs font-mono font-medium text-[#fafafa] transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a3a3a3]" />
                <span className="hidden md:inline text-[#a3a3a3]">ROLE:</span>
                <span className="uppercase text-[#fafafa] font-semibold">{role?.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#a3a3a3]" />
              </button>

              {roleSwitcherOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-[#171717] rounded-lg shadow-2xl border border-[#262626] p-1.5 z-50 animate-in fade-in duration-150"
                  onClick={() => setRoleSwitcherOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#a3a3a3] border-b border-[#262626] mb-1 flex items-center justify-between">
                    <span>SWITCH PERSONA</span>
                    <span className="text-[#fafafa] font-semibold">1-CLICK</span>
                  </div>
                  {Object.entries(DEMO_CREDENTIALS).map(([rKey, cred]) => (
                    <button
                      key={rKey}
                      onClick={() => handleQuickSwitch(rKey)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                        role === rKey
                          ? 'bg-[#262626] text-[#fafafa] font-semibold border border-[#333333]'
                          : 'text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#212121]'
                      }`}
                    >
                      <span className="truncate pr-2">{cred.label}</span>
                      {role === rKey && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fafafa] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current User Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#262626]">
              <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#333333] text-[#fafafa] flex items-center justify-center font-display font-semibold text-xs shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#fafafa] leading-none">{user?.name}</p>
                <span className="text-[10px] uppercase tracking-wider text-[#a3a3a3] mt-0.5 block font-medium">
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
              className="p-2 text-[#a3a3a3] hover:text-[#fafafa] bg-[#262626] hover:bg-[#333333] rounded-full transition-colors border border-[#262626]"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop: Surface #171717 with subtle #262626 border */}
        <aside className="hidden lg:flex flex-col justify-between w-64 bg-[#171717] border-r border-[#262626] p-4 space-y-1 shrink-0 no-print">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#a3a3a3] font-medium">
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
                      ? 'bg-[#262626] text-[#fafafa] border border-[#333333] font-semibold'
                      : 'text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#212121]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#fafafa]' : 'text-[#a3a3a3]'}`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Minimal Status Card in Sidebar */}
          <div className="p-3.5 rounded-lg border border-[#262626] bg-[#121212] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#a3a3a3] uppercase font-medium">
              <span>SYSTEM ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fafafa] animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-[#fafafa]">
              HL7 / HIPAA Architecture
            </p>
            <p className="text-[10px] text-[#a3a3a3]">Audit trail secured</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 h-full bg-[#171717] p-5 space-y-3 border-r border-[#262626] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <span className="font-semibold text-[#fafafa] text-sm">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#a3a3a3] hover:text-[#fafafa] bg-[#262626] rounded-full border border-[#262626]"
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
                        ? 'bg-[#262626] text-[#fafafa] font-semibold border border-[#333333]'
                        : 'text-[#a3a3a3] hover:bg-[#212121] hover:text-[#fafafa]'
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

        {/* Viewport Content with Base #0a0a0a Background */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full page-transition bg-[#0a0a0a] text-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  );
};
