import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between py-6 px-4 max-w-5xl mx-auto">
      {/* Brand Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#242033] flex items-center justify-center text-white font-heading font-bold text-lg">
            A
          </div>
          <div>
            <span className="font-heading font-bold text-2xl tracking-tight text-[#242033]">
              Aarvya AI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#858098] block -mt-1">
              HEALTHTECH MENTAL WELLNESS PLATFORM
            </span>
          </div>
        </div>

        <button
          onClick={onEnterApp}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-all shadow-md shadow-[#7546F5]/20 hover:scale-105"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="my-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#DCD2FF] text-[#7546F5] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Dynamic Distress Prediction & Mental Wellness</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#242033] leading-tight tracking-tight">
            Every Emotion Matters.<br />
            <span className="text-[#7546F5]">Every Voice Deserves Support.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#858098] leading-relaxed">
            A secure digital platform empowering individuals who have experienced trauma, abuse, or discrimination to voluntarily record their emotional well-being through periodic check-ins, backed by explainable AI trend analysis and dedicated counsellor review.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              onClick={onEnterApp}
              className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#7546F5] text-white font-semibold text-sm hover:bg-[#6232e0] transition-all shadow-xl shadow-[#7546F5]/30 hover:scale-105"
            >
              <span>Explore Interactive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 text-xs text-[#858098] px-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Confidential & Informed Consent First</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="lg:w-1/2 flex items-center justify-center relative">
          <div className="relative p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-[0_20px_45px_rgba(117,70,245,0.12)]">
            <img
              src="/assets/lavender_brain.png"
              alt="3D Lavender Human Brain Illustration"
              className="w-72 sm:w-80 h-auto object-contain drop-shadow-2xl animate-float"
            />
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white">
              <span className="text-xs text-[#858098] block">Personal Baseline</span>
              <span className="text-xl font-heading font-bold text-[#7546F5]">Explainable Trends</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#F1ECFF] text-[#7546F5] flex items-center justify-center mb-3">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-[#242033] mb-1">
            Explainable AI Analysis
          </h3>
          <p className="text-xs text-[#858098] leading-relaxed">
            Evaluates individual moving baselines across mood, stress, sleep, and energy without automated clinical labeling.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#F1ECFF] text-[#7546F5] flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-[#242033] mb-1">
            Human-Centred Triage
          </h3>
          <p className="text-xs text-[#858098] leading-relaxed">
            Notifies authorised psychologists when concerning deviations or explicit requests for support arise.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#F1ECFF] text-[#7546F5] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-[#242033] mb-1">
            Privacy & Governance
          </h3>
          <p className="text-xs text-[#858098] leading-relaxed">
            Role-based access, end-to-end audit trails, and strict informed consent ensure victim safety.
          </p>
        </div>
      </div>

      {/* Ethical Disclaimer Footer */}
      <footer className="mt-6 pt-6 border-t border-white/60 text-center text-xs text-[#858098] space-y-1">
        <p>
          <strong>Notice:</strong> Aarvya AI is designed for supportive monitoring and early distress detection, not medical diagnosis or autonomous psychiatric decisions.
        </p>
        <p>© 2026 Aarvya AI • HealthTech Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

