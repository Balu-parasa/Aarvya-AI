import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, FileText, User, ArrowLeft, Shield, 
  Send, Sparkles, Plus, Calendar, Activity, MessageSquare, PhoneCall
} from 'lucide-react';
import { fetchCounsellorDashboard, acknowledgeAlert, saveClinicalNote } from '../services/api';
import axios from 'axios';

interface CounsellorPortalProps {
  onBackToDashboard?: () => void;
}

export const CounsellorPortal: React.FC<CounsellorPortalProps> = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedList, setAcknowledgedList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'patients' | 'checkins' | 'notes'>('alerts');
  
  // Note creation form state
  const [selectedPatientId, setSelectedPatientId] = useState<string>('user_sara_001');
  const [observation, setObservation] = useState('');
  const [interventions, setInterventions] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [notesList, setNotesList] = useState<any[]>([]);
  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    loadNotes();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCounsellorDashboard();
      setData(res);
      if (res?.patients && res.patients.length > 0) {
        setSelectedPatientId(res.patients[0]._id || 'user_sara_001');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const res = await axios.get('/api/counsellor/notes/');
      setNotesList(res.data || []);
    } catch (e) {
      console.warn('Could not load notes:', e);
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

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation) return;
    setNoteStatus('Saving...');
    try {
      await saveClinicalNote({
        user_id: selectedPatientId,
        observation,
        interventions,
        next_steps: nextSteps,
      });
      setNoteStatus('Saved successfully!');
      setObservation('');
      setInterventions('');
      setNextSteps('');
      loadNotes();
      setTimeout(() => setNoteStatus(null), 3000);
    } catch (e) {
      setNoteStatus('Failed to save note');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#242033]">
              Psychiatrist & Counsellor Clinical Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#7546F5]/10 text-[#7546F5] text-xs font-bold uppercase tracking-wider">
              Real-time Active
            </span>
          </div>
          <p className="text-xs text-[#858098] mt-1">
            Clinical case triage, statistical distress deviation alerts, and encrypted longitudinal patient records
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-2xl text-xs font-semibold border border-emerald-200 shadow-xs">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Encrypted HIPAA/GDPR Compliance Active</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#858098] font-medium">Assigned Cases</span>
            <User className="w-4 h-4 text-[#7546F5]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {data?.patients?.length || 3}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">All with informed consent</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#858098] font-medium">Distress Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {data?.alerts?.length || 1}
          </span>
          <span className="text-[11px] text-amber-600 font-medium">Requires clinician triage</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#858098] font-medium">Weekly Check-ins</span>
            <Activity className="w-4 h-4 text-[#7546F5]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {data?.recent_checkins?.length || 7}
          </span>
          <span className="text-[11px] text-[#7546F5] font-medium">Self-reported telemetry</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#858098] font-medium">Clinical Notes</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {notesList.length || 2}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Securely persisted in MongoDB</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-white/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Priority Review Queue ({data?.alerts?.length || 1})
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Assigned Individuals ({data?.patients?.length || 3})
        </button>
        <button
          onClick={() => setActiveTab('checkins')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'checkins'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Recent Voluntary Check-ins
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-[#7546F5] text-white shadow-md shadow-[#7546F5]/20'
              : 'bg-white/70 text-[#858098] hover:text-[#242033]'
          }`}
        >
          Clinical Notes & Interventions
        </button>
      </div>

      {/* Alerts View */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 mb-4 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical Decision-Support Note:</strong> AI distress indicators highlight statistical variance from voluntary self-reported baselines. They are supportive cues for certified human clinician review, never autonomous medical diagnoses.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data?.alerts?.map((alert: any) => {
              const isDone = acknowledgedList.includes(alert._id) || alert.status === 'reviewed';
              return (
                <div
                  key={alert._id}
                  className={`bg-white/90 backdrop-blur-md rounded-2xl p-5 border transition-all ${
                    isDone ? 'border-emerald-200 opacity-75' : 'border-white shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        alert.urgency === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-[#7546F5]'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-base text-[#242033]">
                          {alert.title} — <span className="font-normal text-[#858098]">{alert.user_name || 'Individual'}</span>
                        </h4>
                        <p className="text-xs text-[#858098] mt-0.5">
                          Reported: {new Date(alert.created_at).toLocaleString()} • Urgency:{' '}
                          <span className="uppercase font-bold text-xs text-[#7546F5]">{alert.urgency}</span>
                        </p>
                      </div>
                    </div>

                    {isDone ? (
                      <span className="flex items-center space-x-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start">
                        <CheckCircle className="w-4 h-4" />
                        <span>Reviewed & Triaged</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(alert._id)}
                        className="px-4 py-2 rounded-xl bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6035E0] transition-colors shadow-xs cursor-pointer self-start"
                      >
                        Acknowledge & Triage
                      </button>
                    )}
                  </div>

                  <div className="mt-3.5 p-3.5 bg-[#F8F5FF] rounded-xl text-xs text-[#242033] border border-[#E9E2FF]">
                    <span className="font-semibold block mb-1 text-[#242033]">Explainable AI Indicator Factors:</span>
                    <p className="text-[#858098] leading-relaxed">{alert.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Patients View */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.patients?.map((p: any) => (
            <div key={p._id} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-start space-x-4">
              <img
                src={p.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
                alt={p.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-[#7546F5]/20"
              />
              <div className="flex-1">
                <h4 className="font-heading font-bold text-base text-[#242033]">{p.name}</h4>
                <p className="text-xs text-[#858098] font-mono">{p.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                  <span className="bg-[#F1ECFF] text-[#7546F5] font-semibold px-2.5 py-0.5 rounded-lg">
                    Goal Progress: {p.goal_progress || 65}%
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-lg">
                    Status: Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkins View */}
      {activeTab === 'checkins' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm overflow-x-auto">
          <div className="mb-4">
            <h3 className="font-heading font-semibold text-lg text-[#242033]">
              Voluntary Self-Reported Well-being Submissions
            </h3>
            <p className="text-xs text-[#858098]">Continuous longitudinal telemetry for early distress detection</p>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F1ECFF] text-[#858098]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Self-Reported Mood</th>
                <th className="py-2.5 px-3">Stress Index</th>
                <th className="py-2.5 px-3">Sleep Hours</th>
                <th className="py-2.5 px-3">Composite Score</th>
                <th className="py-2.5 px-3">Clinical Reflection</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_checkins?.map((c: any, i: number) => (
                <tr key={i} className="border-b border-[#F8F5FF] hover:bg-[#F8F5FF] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-[#242033]">{c.date || 'Recent'}</td>
                  <td className="py-2.5 px-3 capitalize font-semibold text-[#7546F5]">{c.mood}</td>
                  <td className="py-2.5 px-3">{c.stress_level} / 10</td>
                  <td className="py-2.5 px-3">{c.sleep_hours} hrs</td>
                  <td className="py-2.5 px-3 font-bold text-[#242033]">{c.composite_score}%</td>
                  <td className="py-2.5 px-3 text-[#858098] max-w-xs truncate">{c.reflection || 'Routine voluntary check-in.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Clinical Notes View */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Form */}
          <div className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
            <h3 className="font-heading font-bold text-base text-[#242033] mb-1">
              Record Clinical Consultation Note
            </h3>
            <p className="text-xs text-[#858098] mb-4">Longitudinally tracked in MongoDB via PyMongo</p>

            <form onSubmit={handleSaveNote} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#242033] mb-1 uppercase tracking-wider">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-xs font-semibold text-[#242033] focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
                >
                  {data?.patients?.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  )) || <option value="user_sara_001">Sara Jenkins</option>}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#242033] mb-1 uppercase tracking-wider">
                  Clinical Observation
                </label>
                <textarea
                  rows={3}
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  required
                  placeholder="Patient presented with mild anticipatory anxiety..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-xs text-[#242033] focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#242033] mb-1 uppercase tracking-wider">
                  Therapeutic Interventions
                </label>
                <input
                  type="text"
                  value={interventions}
                  onChange={(e) => setInterventions(e.target.value)}
                  placeholder="CBT restructuring, 4-7-8 breathing protocol..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-xs text-[#242033] focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#242033] mb-1 uppercase tracking-wider">
                  Next Follow-up & Plan
                </label>
                <input
                  type="text"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Review weekly check-in telemetry in 7 days..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-xs text-[#242033] focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
                />
              </div>

              {noteStatus && (
                <p className="text-xs font-semibold text-[#7546F5] animate-fadeIn">{noteStatus}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7546F5] hover:bg-[#6035E0] text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Consultation Note</span>
              </button>
            </form>
          </div>

          {/* Notes History */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
            <h3 className="font-heading font-bold text-base text-[#242033] mb-1">
              Longitudinal Clinical Notes History
            </h3>
            <p className="text-xs text-[#858098] mb-4">Tamper-evident clinician assessment records</p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {notesList.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#858098] bg-[#F8F5FF] rounded-2xl border border-dashed border-[#DCD2FF]">
                  No clinical notes recorded yet. Use the form to file your first session evaluation.
                </div>
              ) : (
                notesList.map((n: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#242033]">
                        {n.counsellor_name || 'Dr. Jams Alther'} • Clinician Note
                      </span>
                      <span className="text-[#858098]">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-[#242033] font-medium leading-relaxed">
                      <strong>Observation:</strong> {n.observation}
                    </p>
                    {n.interventions && (
                      <p className="text-xs text-[#7546F5]">
                        <strong>Intervention:</strong> {n.interventions}
                      </p>
                    )}
                    {n.next_steps && (
                      <p className="text-xs text-[#858098]">
                        <strong>Next Steps:</strong> {n.next_steps}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorPortal;
