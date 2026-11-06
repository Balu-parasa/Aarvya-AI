import React from 'react';
import { Target, Cloud, Compass } from 'lucide-react';
import { TelemetryItem } from '../types';

interface BrainVisualizationProps {
  userName: string;
  telemetry: {
    goal_progress: TelemetryItem;
    stress_level: TelemetryItem;
    focus_power: TelemetryItem;
  };
  onOpenCheckin: () => void;
}

export const BrainVisualization: React.FC<BrainVisualizationProps> = ({
  userName,
  telemetry,
  onOpenCheckin,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between py-2 pr-0 lg:pr-6">
      {/* Greeting Header */}
      <div className="mb-4 select-none">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-light text-[#242033] leading-tight">
          Hello, {userName} <span className="inline-block animate-wave origin-bottom-right">👋</span> How are
        </h1>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#242033] tracking-tight">
          you feeling today?
        </h2>
      </div>

      {/* Brain and Floating Metric Pills Container */}
      <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center">
        
        {/* SVG Connecting Pointer Line from Goal Progress to Brain */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block" 
          viewBox="0 0 500 360"
        >
          {/* Connector line from left card (x:150, y:230) up to brain coordinate (x:250, y:180) */}
          <path
            d="M 155 220 L 195 190 L 250 190"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="250" cy="190" r="4.5" fill="#FFFFFF" />
          <circle cx="250" cy="190" r="8" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>

        {/* Realistic Lavender 3D Brain Illustration */}
        <div className="relative z-0 group cursor-pointer" onClick={onOpenCheckin} title="Click to start daily check-in">
          <img
            src="/assets/lavender_brain.png"
            alt="3D Lavender Human Brain Illustration"
            className="w-56 sm:w-64 lg:w-72 h-auto object-contain drop-shadow-[0_20px_35px_rgba(117,70,245,0.22)] transition-transform duration-700 ease-out hover:scale-105"
          />

          {/* Interactive Neural Pulse Pinpoint on Brain */}
          <div className="absolute top-[38%] right-[42%] pointer-events-none">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white ring-4 ring-[#7546F5]/20 shadow-md"></span>
            </span>
          </div>
        </div>

        {/* Floating Card 1: Goal Progress (Left) */}
        <div 
          onClick={onOpenCheckin}
          className="absolute left-0 bottom-4 sm:bottom-10 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_12px_28px_rgba(117,70,245,0.08)] border border-white/80 w-[145px] sm:w-[170px] cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">
              {telemetry.goal_progress.label}
            </span>
            <Target className="w-4 h-4 text-[#858098]" />
          </div>
          <div className="text-[11px] text-[#858098]">
            Status: <span className="font-medium text-[#242033]">{telemetry.goal_progress.status}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-[#242033] mt-0.5">
            {telemetry.goal_progress.percentage}%
          </div>
        </div>

        {/* Floating Card 2: Stress Level (Top Right) */}
        <div 
          onClick={onOpenCheckin}
          className="absolute right-0 sm:right-6 top-2 sm:top-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_12px_28px_rgba(117,70,245,0.08)] border border-white/80 w-[145px] sm:w-[170px] cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">
              {telemetry.stress_level.label}
            </span>
            <Cloud className="w-4 h-4 text-[#858098]" />
          </div>
          <div className="text-[11px] text-[#858098]">
            Status: <span className="font-medium text-[#242033]">{telemetry.stress_level.status}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-[#242033] mt-0.5">
            {telemetry.stress_level.percentage}%
          </div>
        </div>

        {/* Floating Card 3: Focus Power (Bottom Right) */}
        <div 
          onClick={onOpenCheckin}
          className="absolute right-0 sm:right-6 bottom-2 sm:bottom-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_12px_28px_rgba(117,70,245,0.08)] border border-white/80 w-[145px] sm:w-[170px] cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between text-[#858098] mb-2">
            <span className="text-xs font-medium text-[#242033]">
              {telemetry.focus_power.label}
            </span>
            <Compass className="w-4 h-4 text-[#858098]" />
          </div>
          <div className="text-[11px] text-[#858098]">
            Status: <span className="font-medium text-[#242033]">{telemetry.focus_power.status}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-[#242033] mt-0.5 whitespace-nowrap">
            {telemetry.focus_power.minutes} <span className="text-lg font-normal text-[#858098]">mins</span>
          </div>
        </div>

      </div>
    </div>
  );
};

