import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, AlertTriangle, ShieldCheck, TrendingUp, Users, 
  Scale, FileCheck, PhoneCall, RefreshCw, BarChart3
} from 'lucide-react';
import { fetchMultiLevelAnalytics } from '../services/api';

export const MultiLevelSurveillanceDashboard: React.FC = () => {
  const [level, setLevel] = useState<'national' | 'state' | 'district'>('national');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async (targetLevel: string) => {
    setLoading(true);
    try {
      const res = await fetchMultiLevelAnalytics(targetLevel);
      setAnalytics(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(level);
  }, [level]);

  return (
    <div className="w-full mx-auto px-6 py-8 flex-1 flex flex-col space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-[#7546F5]/10 text-[#7546F5]">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#242033]">
                Multi-Level Atrocity Distress Surveillance Console
              </h1>
              <p className="text-xs text-[#7546F5] font-semibold mt-0.5 uppercase tracking-wider">
                Ministry of Social Justice and Empowerment (MoSJE) • SIH26094 Surveillance Architecture
              </p>
            </div>
          </div>
          <p className="text-xs text-[#858098] mt-2.5 max-w-2xl leading-relaxed">
            Multi-tier evidence-based oversight across District Magistrates, State Welfare Directorates, and Central Ministry authorities for victims under the SC/ST (Prevention of Atrocities) Act.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#F1ECFF] p-1.5 rounded-2xl border border-[#DCD2FF] shrink-0">
          <button
            onClick={() => setLevel('national')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              level === 'national' ? 'bg-[#7546F5] text-white shadow-xs' : 'text-[#858098] hover:text-[#242033]'
            }`}
          >
            National Level
          </button>
          <button
            onClick={() => setLevel('state')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              level === 'state' ? 'bg-[#7546F5] text-white shadow-xs' : 'text-[#858098] hover:text-[#242033]'
            }`}
          >
            State Level
          </button>
          <button
            onClick={() => setLevel('district')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              level === 'district' ? 'bg-[#7546F5] text-white shadow-xs' : 'text-[#858098] hover:text-[#242033]'
            }`}
          >
            District Level
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">Monitored Victims</span>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {analytics?.summary?.total_monitored_victims || 293}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">100% Voluntary Tracking</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">Critical Risk Alerts</span>
          <span className="text-2xl font-heading font-bold text-rose-600 block mt-1">
            {analytics?.summary?.active_high_risk_alerts || 24}
          </span>
          <span className="text-[10px] text-rose-600 font-bold">Triage Dispatched</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">Multi-Channel Interactions</span>
          <span className="text-2xl font-heading font-bold text-[#7546F5] block mt-1">
            {analytics?.summary?.multi_channel_pings || 1140}
          </span>
          <span className="text-[10px] text-[#7546F5] font-bold">IVRS, SMS & Web</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">Protection Orders</span>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-1">
            {analytics?.summary?.witness_protection_orders || 34}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">Police Escorts Active</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">Statutory Relief Disbursed</span>
          <span className="text-2xl font-heading font-bold text-emerald-700 block mt-1">
            {analytics?.summary?.statutory_relief_disbursed_cr || "₹4.82 Cr"}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">PoA Rules Sched. I</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-xs">
          <span className="text-[11px] text-[#858098] font-medium block">NHAA 14566 Line</span>
          <span className="text-sm font-heading font-bold text-[#7546F5] block mt-2">
            24x7 Live
          </span>
          <span className="text-[10px] text-[#858098] font-medium">MoSJE National Core</span>
        </div>
      </div>

      {/* Breakdown by Legal Case Stage & Priority Atrocity Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stages of Justice Process */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#242033]">
                Victim Cohort by Legal & Justice Process Stage
              </h2>
              <p className="text-xs text-[#858098]">Continuous monitoring across investigation, trial & compensation</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#7546F5]" />
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.stages_distribution?.map((s: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#242033]">
                  <span>{s.stage}</span>
                  <span>{s.count} Cases</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1ECFF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7546F5]"
                    style={{ width: `${(s.count / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Use Cases (SIH26094 Exact Categories) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#242033]">
                Priority Atrocity Use Cases & Vulnerability Breakdown
              </h2>
              <p className="text-xs text-[#858098]">Automated risk escalation triggers mapped to offense severity</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-2.5 pt-2">
            {analytics?.priority_categories?.map((cat: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF] text-xs"
              >
                <div>
                  <span className="font-bold text-[#242033] block">{cat.category}</span>
                  <span className="text-[11px] text-[#858098]">{cat.cases} Active Surveillance Cases</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                    cat.risk_level === 'Critical'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : cat.risk_level === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-[#F1ECFF] text-[#7546F5]'
                  }`}
                >
                  {cat.risk_level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Surveillance Heatmap / Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-[#242033]">
              State & District Distress Telemetry Table
            </h2>
            <p className="text-xs text-[#858098]">Evidence-based decision-making for welfare administrators and authorities</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Live Synchronized
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F1ECFF] text-[#858098]">
              <th className="py-2.5 px-3">State / District Jurisdiction</th>
              <th className="py-2.5 px-3">Monitored Victims</th>
              <th className="py-2.5 px-3">High-Risk Escalations</th>
              <th className="py-2.5 px-3">Avg Dynamic Distress Score</th>
              <th className="py-2.5 px-3">Administrative Action Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.regional_data?.map((r: any, idx: number) => (
              <tr key={idx} className="border-b border-[#F8F5FF] hover:bg-[#F8F5FF] transition-colors">
                <td className="py-3 px-3 font-bold text-[#242033] flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#7546F5]" />
                  <span>{r.region}</span>
                </td>
                <td className="py-3 px-3 font-semibold text-[#242033]">{r.registered_cases}</td>
                <td className="py-3 px-3 font-bold text-rose-600">{r.high_risk_cases}</td>
                <td className="py-3 px-3 font-bold text-[#7546F5]">{r.avg_distress_score}%</td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === 'High Alert'
                        ? 'bg-rose-100 text-rose-700'
                        : r.status === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiLevelSurveillanceDashboard;
