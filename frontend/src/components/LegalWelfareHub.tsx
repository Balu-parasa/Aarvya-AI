import React, { useState } from 'react';
import { 
  Shield, PhoneCall, Scale, HeartHandshake, FileText, CheckCircle2, 
  MapPin, AlertCircle, Building2, ExternalLink
} from 'lucide-react';

export const LegalWelfareHub: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<string>('act_relief');

  const helplines = [
    {
      name: "NHAA National Helpline (MoSJE)",
      number: "14566",
      desc: "National Helpline Against Atrocities (Scheduled Castes and Scheduled Tribes)",
      availability: "24x7 Toll-Free • Multi-lingual",
      badge: "Official MoSJE Channel"
    },
    {
      name: "Tele-MANAS Comprehensive Care",
      number: "14416 / 1800-891-4416",
      desc: "Govt. of India 24/7 mental health & acute psychological distress counseling",
      availability: "24x7 Free • 20+ Regional Languages",
      badge: "Psychological Triage"
    },
    {
      name: "National Legal Services Authority (NALSA)",
      number: "15100",
      desc: "Free legal aid & specialized legal defense counsel under legal services authority",
      availability: "Direct Legal Aid Helpline",
      badge: "Judicial Legal Defense"
    },
    {
      name: "National Emergency Response Support",
      number: "112",
      desc: "Immediate police, medical, and emergency dispatch services across all states",
      availability: "Immediate Emergency Dispatch",
      badge: "Emergency Police"
    }
  ];

  return (
    <div className="w-full mx-auto px-6 py-8 flex-1 flex flex-col space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-[#7546F5]/10 text-[#7546F5]">
              <Scale className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#242033]">
                Legal Aid & Rehabilitation Welfare Hub
              </h1>
              <p className="text-xs text-[#7546F5] font-semibold mt-0.5 uppercase tracking-wider">
                SC/ST (Prevention of Atrocities) Act, 1989 Welfare & Redressal Protocols
              </p>
            </div>
          </div>
          <p className="text-xs text-[#858098] mt-2.5 max-w-2xl leading-relaxed">
            Statutory legal aid, mandatory victim compensation relief, witness protection measures, and immediate multi-agency rehabilitation support mandated by the Ministry of Social Justice and Empowerment (MoSJE).
          </p>
        </div>

        <div className="bg-[#F1ECFF] p-4 rounded-2xl border border-[#DCD2FF] text-left shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7546F5] block">
            National Helpline (NHAA)
          </span>
          <span className="text-2xl font-heading font-bold text-[#242033] block mt-0.5">
            14566
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            24/7 Active Voice Line
          </span>
        </div>
      </div>

      {/* Helplines Grid */}
      <div>
        <h2 className="font-heading font-bold text-lg text-[#242033] mb-3 flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-[#7546F5]" />
          <span>Verified Government & Legal Hotlines</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((h, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#7546F5]/10 text-[#7546F5] inline-block mb-2">
                  {h.badge}
                </span>
                <h3 className="font-heading font-bold text-sm text-[#242033]">{h.name}</h3>
                <p className="text-xs text-[#858098] mt-1 leading-relaxed">{h.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F1ECFF]">
                <a
                  href={`tel:${h.number.split('/')[0].trim()}`}
                  className="font-heading font-bold text-lg text-[#7546F5] hover:underline flex items-center justify-between"
                >
                  <span>{h.number}</span>
                  <PhoneCall className="w-4 h-4" />
                </a>
                <span className="text-[10px] text-[#858098] block mt-0.5">{h.availability}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Rights & Compensation Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#242033] flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#7546F5]" />
            <span>Statutory Victim Protection & Relief Measures</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF]">
              <h3 className="font-bold text-sm text-[#242033] mb-1">Mandatory Relief & Compensation</h3>
              <p className="text-xs text-[#858098] leading-relaxed">
                Under the PoA Rules 1995 (Schedule I), relief amounts ranging from ₹85,000 to ₹8,25,000 are sanctioned at FIR, Charge-sheet, and Trial conclusion stages regardless of court outcome.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF]">
              <h3 className="font-bold text-sm text-[#242033] mb-1">Witness & Victim Protection</h3>
              <p className="text-xs text-[#858098] leading-relaxed">
                Right to safe transportation, relocation assistance, police escort during trial appearances, and confidential court proceedings without exposure to accused pressure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF]">
              <h3 className="font-bold text-sm text-[#242033] mb-1">Free Legal Aid & Special Counsel</h3>
              <p className="text-xs text-[#858098] leading-relaxed">
                Entitlement to an advocate of personal choice engaged through District Legal Services Authority (DLSA) with state-paid legal fees.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E9E2FF]">
              <h3 className="font-bold text-sm text-[#242033] mb-1">Periodic Psychological Monitoring</h3>
              <p className="text-xs text-[#858098] leading-relaxed">
                Continuous digital mental health tracking and proactive escalation prediction to prevent suicide, acute anxiety, and trauma distress.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Escalation Protocol Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-base text-[#242033]">
              Need Immediate Protection or Witness Escort?
            </h2>
            <p className="text-xs text-[#858098] mt-1.5 leading-relaxed">
              If you or your family are facing direct threats, intimidation, or social boycott related to your case, your assigned counsellor and district magistrate liaison can be notified instantly.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F1ECFF]">
            <a
              href="tel:14566"
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-rose-600/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Dial 14566 Atrocity Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalWelfareHub;
