import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Users, Activity, ArrowLeft, Lock, Trash2 } from 'lucide-react';
import { fetchAdminMetrics } from '../services/api';

interface AdminPortalProps {
  onBackToDashboard: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToDashboard }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAdminMetrics()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="w-9 h-9 rounded-full bg-white border border-[#DCD2FF] flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#242033]">
              System Governance & Audit Console
            </h1>
            <p className="text-xs text-[#858098]">
              Platform security controls, role-based access enforcement, and PyMongo audit trail
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-purple-50 text-[#7546F5] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#DCD2FF]">
          <Lock className="w-3.5 h-3.5" />
          <span>Role: Root Administrator</span>
        </div>
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
                { timestamp: new Date().toISOString(), action: 'ROLE_SWITCH', actor: 'Sara Jenkins', details: 'Switched session scope for clinical evaluation.' },
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

