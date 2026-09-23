import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TestTube,
} from 'lucide-react';

export const LabDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/lab/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching lab dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCollection = orders.filter((o) => o.status === 'ordered');
  const sampleCollected = orders.filter((o) => o.status === 'sample_collected' || o.status === 'processing');
  const readyToVerify = orders.filter((o) => o.status === 'completed');
  const verified = orders.filter((o) => o.status === 'verified');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-amber-600" />
            Diagnostic Laboratory Management (LIMS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Specimen tracking, biochemistry analysis, result verification, and report release.
          </p>
        </div>

        <button
          onClick={() => navigate('/lab/queue')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
        >
          <TestTube className="w-4 h-4" /> Open Test Orders Queue
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting Sample</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{pendingCollection.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Processing</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{sampleCollected.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ready to Verify</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{readyToVerify.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified & Released</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{verified.length}</h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Test Orders Queue</h3>
          <button
            onClick={() => navigate('/lab/queue')}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading lab orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">No active lab orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Order #</th>
                  <th className="px-6 py-3">Test Name</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Sample Type</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{order.testName}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">{order.patient?.name}</td>
                    <td className="px-6 py-3.5 text-slate-600">{order.sampleType}</td>
                    <td className="px-6 py-3.5 font-mono uppercase text-[10px] font-bold text-slate-500">
                      {order.priority}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => navigate('/lab/queue')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
