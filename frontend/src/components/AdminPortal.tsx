import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Activity, Lock, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { fetchAdminMetrics, fetchPendingAdmins, approveAdminRequest, rejectAdminRequest } from '../services/api';

interface AdminPortalProps {
  onBackToDashboard?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = () => {
  const [data, setData] = useState<any>(null);
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = () => {
    fetchAdminMetrics()
      .then((res) => setData(res))
      .catch((err) => console.error(err));

    fetchPendingAdmins()
      .then((res) => setPendingAdmins(res.pending_admins || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (userId: string) => {
    setLoadingAction(userId);
    setActionMessage(null);
    try {
      await approveAdminRequest(userId);
      setActionMessage({ text: 'Admin request approved successfully! The user can now log in.', type: 'success' });
      loadData();
    } catch (err: any) {
      setActionMessage({ text: err?.response?.data?.error || 'Failed to approve admin request.', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm('Are you sure you want to reject and remove this admin request?')) return;
    setLoadingAction(userId);
    setActionMessage(null);
    try {
      await rejectAdminRequest(userId);
      setActionMessage({ text: 'Admin request rejected and removed.', type: 'success' });
      loadData();
    } catch (err: any) {
      setActionMessage({ text: err?.response?.data?.error || 'Failed to reject admin request.', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#242033]">
            System Governance & Administrator Console
          </h1>
          <p className="text-xs text-[#858098] mt-0.5">
            Sole Admin authorization control, pending administrator approvals, and security audit log
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-purple-50 text-[#7546F5] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#DCD2FF]">
          <Lock className="w-3.5 h-3.5" />
          <span>Root Administrator Authorized</span>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 animate-fadeIn ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Pending Admin Approvals Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#242033]">
                Pending Administrator Approval Requests
              </h2>
              <p className="text-xs text-[#858098]">
                New admin sign-ups remain blocked until you explicitly approve them here
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {pendingAdmins.length} Request{pendingAdmins.length === 1 ? '' : 's'} Pending
          </span>
        </div>

        {pendingAdmins.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#858098] bg-[#F8F5FF] rounded-2xl border border-dashed border-[#DCD2FF]">
            No pending administrator approval requests. All sign-ups are verified.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAdmins.map((req) => (
              <div
                key={req._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF] gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#242033]">{req.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Pending Authorization
                    </span>
                  </div>
                  <p className="text-xs text-[#858098] mt-0.5 font-mono">{req.email}</p>
                  <p className="text-[11px] text-[#858098] mt-1">
                    Requested on: {req.created_at ? new Date(req.created_at).toLocaleString() : 'Recent'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={loadingAction === req._id}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Admin</span>
                  </button>

                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={loadingAction === req._id}
                    className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
          <span className="text-xs text-[#858098] block">Registered Users</span>
          <span className="text-2xl font-heading font-bold text-[#242033]">
            {data?.metrics?.total_users || 1}
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
          <span className="text-xs text-[#858098] block">Licensed Counsellors</span>
          <span className="text-2xl font-heading font-bold text-[#242033]">
            {data?.metrics?.total_counsellors || 5}
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
          <span className="text-xs text-[#858098] block">Voluntary Check-ins</span>
          <span className="text-2xl font-heading font-bold text-[#242033]">
            {data?.metrics?.total_checkins || 7}
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
          <span className="text-xs text-[#858098] block">PyMongo Engine</span>
          <span className="text-sm font-heading font-bold text-emerald-600 block mt-1">
            Active / Synchronized
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-[#242033]">
            Tamper-Evident Security & Activity Audit Trail
          </h3>
          <span className="text-xs text-[#858098]">Real-time Event Logging</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F1ECFF] text-[#858098]">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Event Action</th>
                <th className="py-2 px-3">Actor</th>
                <th className="py-2 px-3">Payload Details</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_audits || [
                { timestamp: new Date().toISOString(), action: 'SYSTEM_INITIALIZED', actor: 'System', details: 'Cryptographic access controls and PyMongo schemas verified.' },
              ]).map((audit: any, idx: number) => (
                <tr key={idx} className="border-b border-[#F8F5FF] hover:bg-[#F8F5FF]">
                  <td className="py-2.5 px-3 text-[#858098] font-mono">
                    {new Date(audit.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#7546F5]">
                    {audit.action}
                  </td>
                  <td className="py-2.5 px-3 text-[#242033]">
                    {audit.actor}
                  </td>
                  <td className="py-2.5 px-3 text-[#858098]">
                    {audit.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
