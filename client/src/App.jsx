import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { DepartmentServices } from './pages/admin/DepartmentServices';
import { AuditLogs } from './pages/admin/AuditLogs';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { ConsultationRoom } from './pages/doctor/ConsultationRoom';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';

// Receptionist Pages
import { ReceptionDashboard } from './pages/receptionist/ReceptionDashboard';
import { PatientRegistration } from './pages/receptionist/PatientRegistration';
import { AppointmentBooking } from './pages/receptionist/AppointmentBooking';
import { QueueBoard } from './pages/receptionist/QueueBoard';
import { BillingCheckout } from './pages/receptionist/BillingCheckout';

// Lab Pages
import { LabDashboard } from './pages/lab/LabDashboard';
import { LabOrdersQueue } from './pages/lab/LabOrdersQueue';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { MyAppointments } from './pages/patient/MyAppointments';
import { MyPrescriptions } from './pages/patient/MyPrescriptions';
import { MyLabReports } from './pages/patient/MyLabReports';
import { MyInvoices } from './pages/patient/MyInvoices';
import { MyTimeline } from './pages/patient/MyTimeline';

// Protected Route Wrapper with Role Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        Loading MedAssist portal...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If not authorized for this specific portal, route to own role dashboard
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'doctor') return <Navigate to="/doctor" replace />;
    if (role === 'receptionist') return <Navigate to="/reception" replace />;
    if (role === 'lab_tech') return <Navigate to="/lab" replace />;
    if (role === 'patient') return <Navigate to="/patient" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Root redirector based on authenticated role
const RootRedirect = () => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        Loading MedAssist portal...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'doctor') return <Navigate to="/doctor" replace />;
  if (role === 'receptionist') return <Navigate to="/reception" replace />;
  if (role === 'lab_tech') return <Navigate to="/lab" replace />;
  if (role === 'patient') return <Navigate to="/patient" replace />;

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Home & Auth Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DepartmentServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/consultation"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <ConsultationRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route
            path="/reception"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <ReceptionDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/register"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <PatientRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/booking"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <AppointmentBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/queue"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <QueueBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/billing"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <BillingCheckout />
              </ProtectedRoute>
            }
          />

          {/* Lab Technician Routes */}
          <Route
            path="/lab"
            element={
              <ProtectedRoute allowedRoles={['lab_tech', 'admin']}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/queue"
            element={
              <ProtectedRoute allowedRoles={['lab_tech', 'admin']}>
                <LabOrdersQueue />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <MyPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-reports"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <MyLabReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/invoices"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <MyInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/timeline"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <MyTimeline />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
