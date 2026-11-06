import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Calendar, TrendingUp, Moon, Zap, Smile } from 'lucide-react';
import { fetchCheckinsHistory } from '../services/api';

interface ProgressPageProps {
  onBackToDashboard: () => void;
  onOpenCheckin: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  onBackToDashboard,
  onOpenCheckin,
}) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchCheckinsHistory()
      .then((data) => setHistory(data))
      .catch((err) => console.error(err));
  }, []);

  const chartData = [
    { day: 'Mon', score: 52, sleep: 7.0, stress: 4 },
    { day: 'Tue', score: 60, sleep: 7.5, stress: 3 },
    { day: 'Wed', score: 48, sleep: 6.0, stress: 6 },
    { day: 'Thu', score: 70, sleep: 8.0, stress: 3 },
    { day: 'Fri', score: 92, sleep: 8.5, stress: 2 },
    { day: 'Sat', score: 75, sleep: 7.5, stress: 3 },
    { day: 'Sun', score: 82, sleep: 8.0, stress: 2 },
  ];

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
              Personal Well-being Progress & Analytics
            </h1>
            <p className="text-xs text-[#858098]">
              Continuous voluntary trend history compared against your personalized baseline
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCheckin}
          className="px-4 py-2 rounded-full bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors shadow-md shadow-[#7546F5]/20"
        >
          + Record Today's Check-in
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm">
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">7-Day Average Well-being</span>
            <Smile className="w-4 h-4 text-[#7546F5]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#242033]">71.2%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            ↑ +8.4% compared to baseline
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm">
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">Mean Sleep Duration</span>
            <Moon className="w-4 h-4 text-[#7546F5]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#242033]">7.6 hrs</div>
          <span className="text-[11px] text-[#858098] mt-1 block">
            Optimal restorative window maintained
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm">
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">Check-in Consistency</span>
            <Zap className="w-4 h-4 text-[#7546F5]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#242033]">100%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            7 of 7 days logged voluntarily
          </span>
        </div>
      </div>

      {/* Big Chart */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-[#242033]">
            Multi-Parameter Health Trend Analysis
          </h3>
          <span className="text-xs font-medium text-[#858098]">Continuous 7-Day Window</span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7546F5" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7546F5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#858098', fontSize: 11 }} />
              <YAxis hide domain={[20, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#242033] text-white p-3 rounded-xl text-xs space-y-1 shadow-md">
                        <p className="font-bold">{payload[0].payload.day}</p>
                        <p>Well-being: {payload[0].payload.score}%</p>
                        <p>Sleep: {payload[0].payload.sleep} hrs</p>
                        <p>Stress Level: {payload[0].payload.stress}/10</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#7546F5" strokeWidth={3} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Logs */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-[#242033] mb-4">
          Voluntary Check-in Historical Records
        </h3>

        <div className="space-y-3">
          {(history.length > 0 ? history : [
            { date: '2025-08-06', mood: 'great', composite_score: 92, sleep_hours: 8.5, stress_level: 2, reflection: 'Celebrated small recovery milestone after meditation session.' },
            { date: '2025-08-05', mood: 'good', composite_score: 70, sleep_hours: 8.0, stress_level: 3, reflection: 'Focusing on peaceful routines.' },
            { date: '2025-08-04', mood: 'okay', composite_score: 48, sleep_hours: 6.0, stress_level: 6, reflection: 'Busy workday, mindful breathing helped.' },
          ]).map((c: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F8F5FF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs text-[#242033]">{c.date}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#F1ECFF] text-[#7546F5]">
                    {c.mood}
                  </span>
                </div>
                {c.reflection && (
                  <p className="text-xs text-[#858098] mt-1 italic">
                    "{c.reflection}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium text-[#242033]">
                <span>Stress: {c.stress_level}/10</span>
                <span>Sleep: {c.sleep_hours}h</span>
                <span className="font-bold text-[#7546F5] bg-white px-2.5 py-1 rounded-xl shadow-xs">
                  {c.composite_score}% Score
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
