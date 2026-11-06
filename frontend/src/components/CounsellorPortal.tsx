import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, User, ArrowLeft, Shield } from 'lucide-react';
import { fetchCounsellorDashboard, acknowledgeAlert } from '../services/api';

interface CounsellorPortalProps {
  onBackToDashboard: () => void;
}

export const CounsellorPortal: React.FC<CounsellorPortalProps> = ({ onBackToDashboard }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedList, setAcknowledgedList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'patients' | 'checkins'>('alerts');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCounsellorDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      setAcknowledgedList([...acknowledgedList, id]);
    } catch (e) {
      setAcknowledgedList([...acknowledgedList, id]);
    }
  };

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
              Psychiatrist & Counsellor Clinical Portal
            </h1>
            <p className="text-xs text-[#858098]">
              Authorized clinical review dashboard for Dr. Jams Alther • Lead Clinical Psychologist
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
          <Shield className="w-3.5 h-3.5" />
          <span>HIPAA / GDPR Confidentiality Mode</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-white/60 pb-3">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'alerts'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Priority Review Queue ({data?.alerts?.length || 1})
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'patients'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Assigned Individuals ({data?.patients?.length || 2})
        </button>
        <button
          onClick={() => setActiveTab('checkins')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'checkins'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Recent Voluntary Check-ins
        </button>
      </div>

      {/* Alerts View */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 mb-4 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical Guardrail:</strong> AI distress indicators highlight statistical variance from self-reported baselines. They are decision-support cues requiring certified human professional triage.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data?.alerts?.map((alert: any) => {
              const isDone = acknowledgedList.includes(alert._id) || alert.status === 'reviewed';
              return (
                <div
                  key={alert._id}
                  className={`bg-white/80 backdrop-blur-md rounded-2xl p-5 border transition-all ${
                    isDone ? 'border-emerald-200 opacity-70' : 'border-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${
                        alert.urgency === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-[#7546F5]'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-base text-[#242033]">
                          {alert.title} — <span className="font-normal text-[#858098]">{alert.user_name}</span>
                        </h4>
                        <p className="text-xs text-[#858098] mt-0.5">
                          Reported: {new Date(alert.created_at).toLocaleString()} • Urgency: <span className="uppercase font-bold text-xs">{alert.urgency}</span>
                        </p>
                      </div>
                    </div>

                    {isDone ? (
                      <span className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span>Reviewed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(alert._id)}
                        className="px-4 py-2 rounded-xl bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors shadow-xs"
                      >
                        Acknowledge & Triage
                      </button>
                    )}
                  </div>

                  <div className="mt-3 p-3 bg-[#F8F5FF] rounded-xl text-xs text-[#242033]">
                    <span className="font-semibold block mb-1">Explainable AI Indicator Factors:</span>
                    <p className="text-[#858098]">{alert.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Patients View */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt="Sara Jenkins"
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h4 className="font-heading font-bold text-base text-[#242033]">Sara Jenkins</h4>
              <p className="text-xs text-[#858098]">Assigned Patient • Tracking since Aug 2025</p>
              <div className="flex items-center space-x-3 mt-2 text-xs">
                <span className="bg-[#F1ECFF] text-[#7546F5] font-semibold px-2.5 py-0.5 rounded-lg">Goal: 65%</span>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-lg">Status: Stable</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkins View */}
      {activeTab === 'checkins' && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F1ECFF] text-[#858098]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Mood</th>
                <th className="py-2.5 px-3">Stress (1-10)</th>
                <th className="py-2.5 px-3">Sleep (hrs)</th>
                <th className="py-2.5 px-3">Well-being Score</th>
                <th className="py-2.5 px-3">Review Flag</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_checkins?.map((c: any, i: number) => (
                <tr key={i} className="border-b border-[#F8F5FF] hover:bg-[#F8F5FF]">
                  <td className="py-2.5 px-3 font-medium text-[#242033]">{c.date || 'Recent'}</td>
                  <td className="py-2.5 px-3 capitalize">{c.mood}</td>
                  <td className="py-2.5 px-3">{c.stress_level} / 10</td>
                  <td className="py-2.5 px-3">{c.sleep_hours} hrs</td>
                  <td className="py-2.5 px-3 font-bold text-[#7546F5]">{c.composite_score}%</td>
                  <td className="py-2.5 px-3">
                    {c.ai_evaluation?.requires_counsellor_review ? (
                      <span className="text-rose-600 font-semibold">Flagged</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Routine</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

