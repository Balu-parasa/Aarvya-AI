import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
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
        reflection,
        request_support: requestSupport,
      });

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
      // Even if offline, close gracefully
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DCD2FF] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-[#F1ECFF] text-[#7546F5]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-heading font-bold text-2xl text-[#242033]">
              Daily Check-in
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1ECFF] text-[#858098] hover:text-[#242033] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#858098] mb-6">
          Your voluntary responses remain confidential and help detect shifts in your personal baseline over time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood selection */}
          <div>
            <label className="block text-xs font-semibold text-[#242033] mb-2">
              How are you feeling right now?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center border transition-all ${
                    mood === m.id
                      ? 'border-[#7546F5] bg-[#F1ECFF] shadow-xs'
                      : 'border-white/80 bg-[#F8F5FF] hover:bg-[#F1ECFF]/50'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-[11px] font-medium text-[#242033]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#242033]">
                Self-Reported Stress Level
              </label>
              <span className="text-xs font-bold text-[#7546F5]">
                {stressLevel} / 10 ({stressLevel <= 3 ? 'Low' : stressLevel <= 7 ? 'Moderate' : 'Elevated'})
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

          {/* Sleep Hours */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#242033]">
                Sleep Duration (Last Night)
              </label>
              <span className="text-xs font-bold text-[#7546F5]">
                {sleepHours} Hours
              </span>
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

          {/* Energy Level */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#242033]">
                Energy & Focus
              </label>
              <span className="text-xs font-bold text-[#7546F5]">
                {energyLevel} / 10
              </span>
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

          {/* Optional Reflection */}
          <div>
            <label className="block text-xs font-semibold text-[#242033] mb-1">
              Personal Reflection <span className="text-[#858098] font-normal">(Optional & Private)</span>
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What thoughts, events, or physical sensations are present for you today?"
              className="w-full text-xs p-3 rounded-2xl bg-[#F8F5FF] border border-[#DCD2FF] text-[#242033] focus:outline-none focus:border-[#7546F5]"
            />
          </div>

          {/* Voluntary Counsellor Request */}
          <div className="p-3.5 rounded-2xl bg-[#F1ECFF]/60 border border-[#DCD2FF] flex items-start space-x-3">
            <input
              type="checkbox"
              id="counsellorCheck"
              checked={requestSupport}
              onChange={(e) => setRequestSupport(e.target.checked)}
              className="mt-0.5 rounded text-[#7546F5] accent-[#7546F5] w-4 h-4"
            />
            <label htmlFor="counsellorCheck" className="text-xs text-[#242033] cursor-pointer">
              <span className="font-semibold block flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#7546F5]" />
                Request confidential counsellor follow-up
              </span>
              <span className="text-[11px] text-[#858098]">
                Check this if you would like Dr. Jams Alther to review your recent check-ins or reach out.
              </span>
            </label>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-[10px] text-[#858098]">
            <ShieldCheck className="w-4 h-4 text-[#7546F5]" />
            <span>Non-clinical monitoring platform. Encryption in transit & at rest enabled.</span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors shadow-md shadow-[#7546F5]/25 disabled:opacity-50"
            >
              {submitting ? 'Recording Check-in...' : 'Submit Voluntary Check-in'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-[#F1ECFF] text-[#242033] text-xs font-semibold hover:bg-[#DCD2FF] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

