import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HeartHandshake, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { submitCheckin } from '../services/api';
import { CheckinSubmission } from '../types';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mood, setMood] = useState<CheckinSubmission['mood']>('good');
  const [stressLevel, setStressLevel] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [threatLevel, setThreatLevel] = useState<number>(1);
  const [caseStage, setCaseStage] = useState<string>('investigation');
  const [reflection, setReflection] = useState<string>('');
  const [requestSupport, setRequestSupport] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const moods: { id: CheckinSubmission['mood']; emoji: string; label: string }[] = [
    { id: 'great', emoji: '😄', label: 'Great' },
    { id: 'good', emoji: '🙂', label: 'Good' },
    { id: 'okay', emoji: '😐', label: 'Okay' },
    { id: 'low', emoji: '😔', label: 'Low' },
    { id: 'distressed', emoji: '😣', label: 'Distressed' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitCheckin({
        mood,
        stress_level: stressLevel,
        sleep_hours: sleepHours,
        energy_level: energyLevel,
        threat_level: threatLevel,
        case_stage: caseStage,
        reflection,
        request_support: requestSupport,
      } as any);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7546F5', '#A78BFA', '#DCD2FF'],
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Check-in error:', err);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#7546F5', '#A78BFA'],
      });
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DCD2FF] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-[#F1ECFF] text-[#7546F5]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#242033]">
                Daily Voluntary Check-in
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7546F5]">
                SIH26094 • Dynamic Distress Predictor
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1ECFF] text-[#858098] hover:text-[#242033] flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#858098] mb-5">
          Your voluntary responses trigger real-time AI distress escalation analysis and connect you to rehabilitation and safety services when needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mood selection */}
          <div>
            <label className="block text-xs font-semibold text-[#242033] mb-2 uppercase tracking-wider">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-2xl border-2 transition-all cursor-pointer ${
                    mood === m.id
                      ? 'border-[#7546F5] bg-[#F1ECFF] shadow-sm scale-105'
                      : 'border-[#F1ECFF] hover:border-[#DCD2FF] bg-[#F8F5FF]'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-[11px] font-bold text-[#242033]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#242033]">
                Self-Reported Stress Level
              </label>
              <span className={`text-xs font-bold ${stressLevel >= 8 ? 'text-rose-600' : 'text-[#7546F5]'}`}>
                {stressLevel} / 10 {stressLevel >= 8 && '• High Distress'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-[#7546F5] cursor-pointer"
            />
          </div>

          {/* Threat / Safety Level (Atrocity / Witness protection context) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#242033] flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>External Pressure or Threat Level</span>
              </label>
              <span className={`text-xs font-bold ${threatLevel >= 4 ? 'text-rose-600' : 'text-[#7546F5]'}`}>
                {threatLevel === 1 ? '1 • Safe / No Threats' : threatLevel === 3 ? '3 • Moderate Pressure' : `${threatLevel} • Severe / Threat Faced`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={threatLevel}
              onChange={(e) => setThreatLevel(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Case Proceeding Stage */}
          <div>
            <label className="block text-xs font-semibold text-[#242033] mb-1.5">
              Current Case / Legal Proceeding Stage
            </label>
            <select
              value={caseStage}
              onChange={(e) => setCaseStage(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F8F5FF] border border-[#DCD2FF] text-xs font-semibold text-[#242033] focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
            >
              <option value="complaint_filed">1. Initial Complaint Filed (FIR Registered)</option>
              <option value="investigation">2. Under Police Investigation (Charge Sheet Pending)</option>
              <option value="trial_court">3. Active Court Trial & Hearing (Testimony Due)</option>
              <option value="rehabilitation">4. Rehabilitation & Compensation Assessment</option>
              <option value="witness_protection">5. Witness Protection Monitoring</option>
            </select>
          </div>

          {/* Sleep Hours & Energy */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#242033]">Sleep</label>
                <span className="text-xs font-bold text-[#7546F5]">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#7546F5] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#242033]">Energy</label>
                <span className="text-xs font-bold text-[#7546F5]">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-[#7546F5] cursor-pointer"
              />
            </div>
          </div>

          {/* Text Reflection (Analyzed by NLP Emotion AI) */}
          <div>
            <label className="block text-xs font-semibold text-[#242033] mb-1">
              Personal Situation & Feelings <span className="text-[#858098] font-normal">(Analyzed by Emotion AI for Trauma & Threat Detection)</span>
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Facing pressure from accused relatives, experiencing nightmares about court hearing..."
              className="w-full text-xs p-3 rounded-2xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] focus:outline-none focus:border-[#7546F5]"
            />
          </div>

          {/* Voluntary Counsellor Request */}
          <div className="p-3.5 rounded-2xl bg-[#F1ECFF]/70 border border-[#DCD2FF] flex items-start space-x-3">
            <input
              type="checkbox"
              id="counsellorCheck"
              checked={requestSupport}
              onChange={(e) => setRequestSupport(e.target.checked)}
              className="mt-0.5 rounded text-[#7546F5] accent-[#7546F5] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="counsellorCheck" className="text-xs text-[#242033] cursor-pointer">
              <span className="font-semibold block flex items-center gap-1.5 text-[#242033]">
                <HeartHandshake className="w-4 h-4 text-[#7546F5]" />
                Request Priority Intervention & Authority Follow-up
              </span>
              <span className="text-[11px] text-[#858098] leading-tight block mt-0.5">
                Immediately dispatches an emergency triage cue to your assigned psychologist and district liaison.
              </span>
            </label>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-[10px] text-[#858098]">
            <ShieldCheck className="w-4 h-4 text-[#7546F5] shrink-0" />
            <span>NHAA (14566) & MoSJE compliant. Encrypted in transit & at rest in MongoDB.</span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6035E0] transition-colors shadow-md shadow-[#7546F5]/25 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Analyzing & Recording...' : 'Submit Voluntary Check-in'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl bg-[#F1ECFF] text-[#242033] text-xs font-semibold hover:bg-[#DCD2FF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
