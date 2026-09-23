import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';
import { ShieldCheck, Search, Filter, Eye, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [roleFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/admin/audit-logs', { params });
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.actorName?.toLowerCase().includes(q) ||
      l.resource?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Security & Clinical Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system logs tracking authentication, medical records, prescriptions, lab releases, and billing.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search action or actor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="lab_tech">Lab Technician</option>
            <option value="patient">Patient</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit history...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold">No audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 font-sans">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Actor & Role</th>
                  <th className="px-6 py-3">Resource</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 font-mono">
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-800">
                      {log.action}
                    </td>
                    <td className="px-6 py-3 font-sans">
                      <span className="font-bold text-slate-800 block">{log.actorName}</span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-sans text-slate-700">{log.resource}</td>
                    <td className="px-6 py-3 text-slate-400">{log.ipAddress}</td>
                    <td className="px-6 py-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        title="View payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record — ${selectedLog.action}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Actor</span>
                <span className="font-bold text-slate-900">{selectedLog.actorName} ({selectedLog.actorRole})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Resource</span>
                <span className="font-mono text-slate-900">{selectedLog.resource} ({selectedLog.resourceId || 'N/A'})</span>
              </div>
            </div>

            <div>
              <span className="text-slate-700 font-bold block mb-1">Payload / Change Metadata:</span>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
