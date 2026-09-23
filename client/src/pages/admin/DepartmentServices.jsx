import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';
import { Settings, Plus, Building2, FlaskConical, DollarSign, CheckCircle2 } from 'lucide-react';

export const DepartmentServices = () => {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Department Modal
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '', location: 'Main Building' });

  // Service Modal
  const [srvModalOpen, setSrvModalOpen] = useState(false);
  const [newSrv, setNewSrv] = useState({
    name: '',
    code: '',
    department: '',
    category: 'consultation',
    price: 500,
    description: '',
    sampleType: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dRes, sRes] = await Promise.all([
        api.get('/admin/departments'),
        api.get('/admin/services'),
      ]);
      if (dRes.data.success) {
        setDepartments(dRes.data.departments);
        if (dRes.data.departments.length > 0) {
          setNewSrv((prev) => ({ ...prev, department: dRes.data.departments[0]._id }));
        }
      }
      if (sRes.data.success) setServices(sRes.data.services);
    } catch (err) {
      console.error('Failed to load clinic catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/departments', newDept);
      setDeptModalOpen(false);
      setNewDept({ name: '', code: '', description: '', location: 'Main Building' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleCreateSrv = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/services', newSrv);
      setSrvModalOpen(false);
      setNewSrv({
        name: '',
        code: '',
        department: departments[0]?._id || '',
        category: 'consultation',
        price: 500,
        description: '',
        sampleType: '',
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-800" />
            Departments & Service Fee Master
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure clinical specialties, lab investigations, turnaround times, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeptModalOpen(true)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-4 h-4" /> Add Department
          </button>
          <button
            onClick={() => setSrvModalOpen(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service / Test
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" /> Clinical Departments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-slate-900">{dept.name}</span>
                <span className="font-mono text-[10px] font-bold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  {dept.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{dept.description}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">📍 {dept.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Service & Diagnostic Catalog
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Service Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 font-mono text-right">Price ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv._id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{srv.code}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-800">{srv.name}</td>
                  <td className="px-6 py-3.5 text-slate-600">{srv.department?.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="capitalize font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {srv.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 text-right">
                    ${srv.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {deptModalOpen && (
        <Modal isOpen={deptModalOpen} onClose={() => setDeptModalOpen(false)} title="Add Department" maxWidth="max-w-md">
          <form onSubmit={handleCreateDept} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
              <input
                type="text"
                required
                value={newDept.name}
                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                placeholder="e.g. Neurology"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department Code *</label>
              <input
                type="text"
                required
                value={newDept.code}
                onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                placeholder="e.g. NEURO"
                className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Floor</label>
              <input
                type="text"
                value={newDept.location}
                onChange={(e) => setNewDept({ ...newDept, location: e.target.value })}
                placeholder="e.g. Block B, Level 3"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={newDept.description}
                onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
            >
              Save Department
            </button>
          </form>
        </Modal>
      )}

      {/* Add Service Modal */}
      {srvModalOpen && (
        <Modal isOpen={srvModalOpen} onClose={() => setSrvModalOpen(false)} title="Add Clinical Service / Test" maxWidth="max-w-md">
          <form onSubmit={handleCreateSrv} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service / Test Name *</label>
              <input
                type="text"
                required
                value={newSrv.name}
                onChange={(e) => setNewSrv({ ...newSrv, name: e.target.value })}
                placeholder="e.g. Fasting Blood Glucose"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Code *</label>
              <input
                type="text"
                required
                value={newSrv.code}
                onChange={(e) => setNewSrv({ ...newSrv, code: e.target.value.toUpperCase() })}
                placeholder="e.g. LAB-GLU-01"
                className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <select
                value={newSrv.department}
                onChange={(e) => setNewSrv({ ...newSrv, department: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newSrv.category}
                  onChange={(e) => setNewSrv({ ...newSrv, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  <option value="consultation">Consultation</option>
                  <option value="lab_test">Lab Test</option>
                  <option value="radiology">Radiology</option>
                  <option value="procedure">Procedure</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  required
                  value={newSrv.price}
                  onChange={(e) => setNewSrv({ ...newSrv, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
            >
              Add Service to Catalog
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
