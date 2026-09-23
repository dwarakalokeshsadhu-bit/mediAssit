import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@medassist.com', password: 'Admin@123', label: 'Clinic Admin (Dr. Vance)' },
  doctor: { email: 'dr.sharma@medassist.com', password: 'Doctor@123', label: 'Doctor (Dr. Sharma - Cardiology)' },
  receptionist: { email: 'reception@medassist.com', password: 'Reception@123', label: 'Receptionist (Emily Clark)' },
  lab_tech: { email: 'lab@medassist.com', password: 'LabTech@123', label: 'Lab Technician (Marcus Chen)' },
  patient: { email: 'patient.john@example.com', password: 'Patient@123', label: 'Patient (John Doe)' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err.message);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const quickLogin = async (role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (!creds) throw new Error(`Unknown role: ${role}`);
    return await login(creds.email, creds.password);
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        quickLogin,
        register,
        logout,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
