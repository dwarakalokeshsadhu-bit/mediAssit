import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HeartPulse,
  Calendar,
  Users,
  FileText,
  Clock,
  ShieldCheck,
  Lock,
  Stethoscope,
  FlaskConical,
  Receipt,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-theme-base text-theme-text font-sans flex flex-col relative selection:bg-theme-border selection:text-theme-text">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 w-full bg-theme-surface/95 backdrop-blur-md border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-md bg-theme-base border border-theme-border text-theme-text flex items-center justify-center font-semibold shadow-sm transition-transform duration-150 group-hover:scale-105">
              <HeartPulse className="w-4 h-4 text-theme-text" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-theme-text block leading-none">
                MedAssist
              </span>
              <span className="text-[10px] font-mono text-theme-textMuted uppercase mt-0.5 block font-medium">
                Clinic Operations & Patient Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-theme-textMuted">
            <a href="#features" className="hover:text-theme-text transition-colors">
              Features
            </a>
            <a href="#for-clinics" className="hover:text-theme-text transition-colors">
              For Clinics
            </a>
            <a href="#for-patients" className="hover:text-theme-text transition-colors">
              For Patients
            </a>
            <a href="#trust" className="hover:text-theme-text transition-colors">
              Security & Trust
            </a>
            <a href="#contact" className="hover:text-theme-text transition-colors">
              Contact
            </a>
          </nav>

          {/* Top-Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-theme-text hover:bg-neutral-100 border border-theme-border rounded-md transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-neutral-900 text-white font-semibold text-xs rounded-md hover:bg-neutral-800 transition-all shadow-xs"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-theme-textMuted hover:text-theme-text"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-theme-border bg-theme-surface px-6 py-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm text-theme-textMuted">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-theme-text"
              >
                Features
              </a>
              <a
                href="#for-clinics"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-theme-text"
              >
                For Clinics
              </a>
              <a
                href="#for-patients"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-theme-text"
              >
                For Patients
              </a>
              <a
                href="#trust"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-theme-text"
              >
                Security & Trust
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-theme-text"
              >
                Contact
              </a>
            </nav>
            <div className="pt-3 border-t border-theme-border flex items-center gap-3">
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-xs font-semibold border border-theme-border rounded-md text-theme-text"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 text-xs font-semibold bg-theme-text text-theme-base rounded-md"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Focused on real operational clinic care */}
      <section className="w-full border-b border-theme-border bg-theme-surface/30">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 text-center">
          {/* Operational Pre-Heading Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>CLINIC OPERATIONS & PATIENT CARE SYSTEM</span>
          </div>

          {/* Real Operational Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-theme-text max-w-4xl mx-auto leading-[1.15] mb-6">
            Clinic operations and patient care, unified in one reliable portal.
          </h1>

          {/* Contextual Subtitle */}
          <p className="text-base sm:text-lg text-theme-textMuted max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Designed for outpatient healthcare environments. MedAssist equips clinic receptionists,
            nurses, and physicians to coordinate daily schedules, manage patient queues, and
            document consultations—while providing patients with direct self-service access to
            appointments, prescriptions, and diagnostic records.
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-12">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Access Clinic Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-theme-surface border border-theme-border text-theme-text font-semibold text-sm hover:bg-theme-base transition-colors flex items-center justify-center gap-2"
            >
              <span>Patient Registration</span>
            </button>
          </div>

          {/* Low Cognitive Load Badges */}
          <div className="pt-6 border-t border-theme-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-theme-textMuted">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-theme-text" />
              <span>Real-Time Triage Queue</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-theme-text" />
              <span>Centralized EHR Records</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-theme-text" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-theme-text" />
              <span>Immediate Patient Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "What This Does" Section: Broken into 2 Real Audiences */}
      <section id="what-it-does" className="w-full py-16 sm:py-24 border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-theme-textMuted font-semibold block mb-2">
              PURPOSE-BUILT ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-theme-text">
              Engineered for both sides of outpatient care
            </h2>
            <p className="text-sm sm:text-base text-theme-textMuted mt-3 leading-relaxed">
              Healthcare operations fall apart when staff tools and patient experiences are disconnected.
              MedAssist connects front-desk workflow, medical consultations, and patient records in a
              single synchronized system.
            </p>
          </div>

          {/* 2 Audience Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Audience 1: For Clinic Staff */}
            <div
              id="for-clinics"
              className="bg-theme-surface border border-theme-border rounded-lg p-8 sm:p-10 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-text tracking-tight">
                    For Clinic Staff
                  </h3>
                  <p className="text-xs text-theme-textMuted font-mono uppercase">
                    Receptionists, Nurses, Physicians, Administrators
                  </p>
                </div>
              </div>

              <p className="text-sm text-theme-textMuted leading-relaxed">
                Streamline outpatient operations during peak clinic hours with intuitive, fast-loading
                tools that prevent double-booking and eliminate paper chart confusion.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Appointment Scheduling & Slot Coordination
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Manage physician availability calendars, prevent overbooked time slots, and schedule walk-ins rapidly at the front desk.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Centralized Electronic Health Records
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Instant retrieval of patient demographics, known allergies, chronic conditions, and past consultation histories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <Users className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Live Queue & Token Management
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Real-time queue tracking from patient arrival to consultation room check-in, keeping waiting areas organized.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <FlaskConical className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Inter-Department & Lab Coordination
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Direct electronic requisition routing from doctors to diagnostic labs, with automatic specimen status tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audience 2: For Patients */}
            <div
              id="for-patients"
              className="bg-theme-surface border border-theme-border rounded-lg p-8 sm:p-10 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-text tracking-tight">
                    For Patients
                  </h3>
                  <p className="text-xs text-theme-textMuted font-mono uppercase">
                    Outpatient Self-Service & Care Continuity
                  </p>
                </div>
              </div>

              <p className="text-sm text-theme-textMuted leading-relaxed">
                Take charge of your healthcare without waiting on phone holds. Access your clinic records,
                prescriptions, and test outcomes securely from any browser.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Self-Service Appointment Booking
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Select your preferred clinical specialty, choose an available doctor, and reserve time slots directly online.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Digital Prescriptions & Visit Summaries
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Clear medication directions, dosage instructions, and doctor notes available immediately following your visit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <FlaskConical className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Diagnostic Laboratory Reports
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Access verified pathology and blood work results as soon as they are signed off by the diagnostic technician.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text shrink-0 mt-0.5">
                    <Receipt className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-theme-text">
                      Itemized Invoices & Billing Receipts
                    </h4>
                    <p className="text-xs text-theme-textMuted mt-0.5 leading-normal">
                      Transparent record of consultation and laboratory charges with downloadable receipts for insurance claims.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Section */}
      <section id="features" className="w-full py-16 sm:py-24 border-b border-theme-border bg-theme-surface/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-theme-textMuted font-semibold block mb-2">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-theme-text">
              Built for real clinical operational demands
            </h2>
            <p className="text-sm sm:text-base text-theme-textMuted mt-3 leading-relaxed">
              Every feature in MedAssist is designed for speed, low cognitive load, and absolute reliability under busy clinic conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Front-Desk Triage & Intake</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Register new patients, issue Medical Record Numbers (MRN), record vital signs, and assign sequential waiting tokens in under two minutes.
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Physician Consultation Room</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Structured clinical documentation (Subjective, Objective, Assessment, Plan) with drug allergy alerts and rapid electronic prescribing.
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Diagnostic Lab Workstation</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Track blood work, radiology, and specimen tests through pending, processing, and verified completion stages with barcode alignment.
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Outpatient Checkout & Billing</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Consolidated billing combining doctor consultation charges, diagnostic tests, and pharmacy line items into clean printable invoices.
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Five Role-Based Security Profiles</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Strict partition of responsibilities across Clinic Admin, Doctor, Receptionist, Lab Technician, and Patient user portals.
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-theme-text">Comprehensive Audit Log</h3>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Immutable chronological logging of all record lookups, prescription issuance, and clinical updates for complete institutional oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Credibility Section: Healthcare Data Security & Compliance */}
      <section id="trust" className="w-full py-16 sm:py-24 border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="bg-theme-surface border border-theme-border rounded-lg p-8 sm:p-12">
            <div className="max-w-3xl mb-8">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-theme-textMuted mb-2">
                <ShieldCheck className="w-4 h-4 text-theme-text" />
                <span>DATA INTEGRITY & SECURITY STANDARD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-theme-text">
                Designed around healthcare confidentiality and trust
              </h2>
              <p className="text-sm text-theme-textMuted mt-2 leading-relaxed">
                Handling patient medical data requires strict safeguards. MedAssist is architected
                with healthcare privacy protocols and administrative controls at every layer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-theme-border">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-theme-text">
                  Role-Based Data Partitioning
                </h3>
                <p className="text-xs text-theme-textMuted leading-relaxed">
                  Front-desk staff see scheduling information, technicians see specimen orders, and only treating medical providers access complete clinical consultation notes.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-theme-text">
                  Cryptographic Safeguards
                </h3>
                <p className="text-xs text-theme-textMuted leading-relaxed">
                  All communication between client browsers and the clinic database is encrypted using industry-standard TLS with salted cryptographic hashing for all credentials.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-theme-text">
                  Immutable Audit Governance
                </h3>
                <p className="text-xs text-theme-textMuted leading-relaxed">
                  Every chart access, medication change, and test approval is tracked with strict user IDs and timestamps, creating a clear clinical trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact & Clinical Operational Support Section */}
      <section id="contact" className="w-full py-16 border-b border-theme-border bg-theme-surface/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-theme-textMuted font-semibold">
                CLINIC ADMINISTRATION & SUPPORT
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-theme-text">
                Contact MedAssist Clinical Operations
              </h2>
              <p className="text-sm text-theme-textMuted leading-relaxed">
                For administrative onboarding, staff credentialing, patient portal assistance, or clinic deployment inquiries, our operational team is available during standard clinic hours.
              </p>

              <div className="space-y-3 pt-2 text-xs text-theme-textMuted">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-theme-text shrink-0" />
                  <span>Front Desk Hotline: +1 (800) MED-ASST / (800) 633-2778</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-theme-text shrink-0" />
                  <span>Clinical Registry: support@medassist.clinic</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-theme-text shrink-0" />
                  <span>100 Medical Center Plaza, Healthcare City, Suite 400</span>
                </div>
              </div>
            </div>

            {/* Emergency & Operational Hours Box */}
            <div className="bg-theme-surface border border-theme-border rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-md text-xs text-amber-200/90">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block text-amber-300">
                    Medical Emergency Notice
                  </span>
                  <p className="leading-relaxed">
                    MedAssist is an outpatient scheduling and records tool. If you or someone you know is experiencing a life-threatening medical emergency, please call 911 or proceed to the nearest emergency room immediately.
                  </p>
                </div>
              </div>

              <div className="text-xs space-y-1 pt-1 text-theme-textMuted">
                <div className="flex justify-between py-1 border-b border-theme-border">
                  <span>Outpatient Clinic Hours:</span>
                  <span className="font-medium text-theme-text">Monday – Friday: 8:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-theme-border">
                  <span>Saturday Clinic:</span>
                  <span className="font-medium text-theme-text">9:00 AM – 3:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sunday:</span>
                  <span className="font-medium text-theme-text">Closed (On-call Triage Only)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Standard Footer */}
      <footer className="w-full bg-theme-surface border-t border-theme-border py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-theme-textMuted">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-theme-base border border-theme-border flex items-center justify-center text-theme-text">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span>© 2026 MedAssist Healthcare Systems Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="hover:text-theme-text transition-colors">
              Features
            </a>
            <a href="#for-clinics" className="hover:text-theme-text transition-colors">
              For Clinics
            </a>
            <a href="#for-patients" className="hover:text-theme-text transition-colors">
              For Patients
            </a>
            <a href="#trust" className="hover:text-theme-text transition-colors">
              Privacy & HIPAA
            </a>
            <a href="#contact" className="hover:text-theme-text transition-colors">
              Contact
            </a>
            <Link to="/login" className="hover:text-theme-text transition-colors font-medium">
              Staff Login
            </Link>
            <Link to="/register" className="hover:text-theme-text transition-colors font-medium">
              Patient Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
