import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Filter, CheckCircle2, Calendar } from 'lucide-react';
import { ReportItem, UpcomingSession, ActiveActivity } from '../types';

interface BottomSectionProps {
  reports: ReportItem[];
  upcomingSession: UpcomingSession;
  activePath: {
    overall_score: number;
    activities: ActiveActivity[];
  };
}

export const BottomSection: React.FC<BottomSectionProps> = ({
  reports,
  upcomingSession,
  activePath,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activitiesState, setActivitiesState] = useState(activePath.activities);

  const handleDownload = (report: ReportItem) => {
    setDownloadToast(`Preparing encrypted diagnostic report: "${report.title}"...`);
    setTimeout(() => {
      // Simulate file download
      const element = document.createElement('a');
      const file = new Blob([
        `MINDGUARD AI - CLINICAL OBSERVATION REPORT\n` +
        `==========================================\n` +
        `Report: ${report.title}\n` +
        `Date: ${report.date}\n` +
        `Counsellor: ${report.doctor_name}\n` +
        `Category: ${report.category}\n` +
        `Integrity Check: Verified (SHA-256)\n\n` +
        `Note: This document contains voluntary monitoring metrics and explainable trend indices strictly for clinical guidance.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${report.title.replace(/\s+/g, '_')}_${report.date}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadToast(`Downloaded "${report.title}" successfully.`);
      setTimeout(() => setDownloadToast(null), 3500);
    }, 600);
  };

  const filteredReports = filterCategory === 'All'
    ? reports
    : reports.filter((r) => r.category.toLowerCase() === filterCategory.toLowerCase());

  const handleIncrementActivity = (index: number) => {
    const updated = [...activitiesState];
    updated[index].percentage = Math.min(100, updated[index].percentage + 5);
    setActivitiesState(updated);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 mt-6 lg:mt-8">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242033] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-[#7546F5]/40 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* CARD 1: Reports (5 cols) */}
      <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 xl:p-8 border border-white/90 shadow-[0_12px_28px_rgba(117,70,245,0.06)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-medium text-xl sm:text-2xl text-[#242033] tracking-tight">
            Reports
          </h3>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#858098] hover:text-[#242033] border border-[#DCD2FF] shadow-xs"
            >
              <span>Filters</span>
              <Filter className="w-3 h-3 text-[#858098]" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#DCD2FF] py-1 z-30 text-xs">
                {['All', 'Therapy', 'Assessment', 'Sleep', 'Wellness'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilterCategory(cat);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 font-medium ${
                      filterCategory === cat ? 'text-[#7546F5] bg-[#F1ECFF]' : 'text-[#242033] hover:bg-[#F8F5FF]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List of Reports */}
        <div className="space-y-3.5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between py-1 group hover:translate-x-1 transition-transform"
            >
              <div className="flex flex-col">
                <span className="font-heading font-medium text-sm text-[#242033] group-hover:text-[#7546F5] transition-colors">
                  {report.title}
                </span>
                <span className="text-[11px] text-[#858098]">
                  {report.date}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={report.doctor_avatar}
                    alt={report.doctor_name}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-xs"
                  />
                  <span className="text-xs font-medium text-[#242033] hidden sm:inline">
                    {report.doctor_name}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(report)}
                  title="Download Secure Report"
                  className="w-8 h-8 rounded-full bg-white border border-[#DCD2FF] hover:border-[#7546F5] flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-xs transition-all hover:scale-105"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2: Upcoming Session (3 cols) */}
      <div className="lg:col-span-3 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 xl:p-8 border border-white/90 shadow-[0_12px_28px_rgba(117,70,245,0.06)] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading font-medium text-xl sm:text-2xl text-[#242033] tracking-tight leading-tight">
              Upcoming
            </h3>
            <h4 className="font-heading font-medium text-xl sm:text-2xl text-[#242033] tracking-tight">
              Session
            </h4>
          </div>

          <button
            onClick={() => setSessionModalOpen(true)}
            title="View Support Session Details"
            className="w-8 h-8 rounded-full bg-white border border-[#DCD2FF] hover:border-[#7546F5] flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-xs transition-all hover:scale-105"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3">
          <span className="text-xs text-[#858098] block">Remaining</span>
          <div className="font-heading font-semibold text-3xl sm:text-[34px] xl:text-[38px] text-[#242033] tracking-tight whitespace-nowrap mt-1">
            {upcomingSession.remaining_hours} <span className="text-xl font-normal text-[#858098]">hr</span> {upcomingSession.remaining_mins} <span className="text-xl font-normal text-[#858098]">min</span>
          </div>
        </div>

        {/* Assigned Counsellor Profile Pill */}
        <div 
          onClick={() => setSessionModalOpen(true)}
          className="bg-white/90 rounded-2xl p-2.5 sm:p-3 flex items-center space-x-3 border border-white shadow-xs cursor-pointer hover:bg-white transition-all"
        >
          <img
            src={upcomingSession.counsellor_avatar}
            alt={upcomingSession.counsellor_name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs sm:text-sm font-semibold text-[#242033] truncate">
              {upcomingSession.counsellor_name}
            </span>
            <span className="text-[10px] sm:text-xs text-[#858098] truncate">
              {upcomingSession.counsellor_title || 'Lead Clinical Psychologist'}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: Active Path this week (4 cols) */}
      <div className="lg:col-span-4 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 xl:p-8 border border-white/90 shadow-[0_12px_28px_rgba(117,70,245,0.06)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-medium text-xl sm:text-2xl text-[#242033] tracking-tight">
            Active path <span className="text-sm font-normal text-[#858098]">this week</span>
          </h3>

          <span className="font-heading font-semibold text-2xl sm:text-3xl text-[#242033]">
            {activePath.overall_score}%
          </span>
        </div>

        {/* Horizontal Progress Bars */}
        <div className="space-y-3.5 my-auto">
          {activitiesState.map((act, idx) => (
            <div 
              key={act.name}
              onClick={() => handleIncrementActivity(idx)}
              className="relative w-full h-11 bg-[#F1ECFF]/70 rounded-2xl flex items-center justify-between px-4 cursor-pointer overflow-hidden border border-white/80 group"
              title="Click to log activity progress (+5%)"
            >
              {/* Filled background progress */}
              <div
                className={`absolute left-0 top-0 bottom-0 rounded-2xl transition-all duration-500 ${
                  act.is_highlight
                    ? 'bg-[#7546F5]'
                    : 'bg-[#DCD2FF]/60'
                }`}
                style={{ width: `${act.percentage}%` }}
              />

              {/* Text label */}
              <span className={`relative z-10 text-xs font-medium ${
                act.is_highlight ? 'text-white' : 'text-[#242033]'
              }`}>
                {act.name}
              </span>

              {/* Percentage label */}
              <span className={`relative z-10 text-xs font-semibold ${
                act.is_highlight ? 'text-white' : 'text-[#242033]'
              }`}>
                {act.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Session Modal */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DCD2FF]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-[#242033]">
                Upcoming Support Session
              </h3>
              <button
                onClick={() => setSessionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1ECFF] text-[#858098] hover:text-[#242033] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-[#F8F5FF] rounded-2xl mb-4">
              <img
                src={upcomingSession.counsellor_avatar}
                alt={upcomingSession.counsellor_name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h4 className="font-bold text-[#242033] text-sm">
                  {upcomingSession.counsellor_name}
                </h4>
                <p className="text-xs text-[#858098]">
                  {upcomingSession.counsellor_title || 'Lead Clinical Psychologist'}
                </p>
                <div className="flex items-center space-x-1.5 text-xs text-[#7546F5] font-semibold mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Remaining: {upcomingSession.remaining_hours}h {upcomingSession.remaining_mins}m</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#858098] mb-6">
              This session provides a safe, confidential space to discuss your emotional trajectory and daily reflections with your assigned psychologist.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  alert('Session meeting link generated: https://meet.mindguard.ai/room-sara-jams');
                  setSessionModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#7546F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors shadow-md shadow-[#7546F5]/25"
              >
                Join Video Room
              </button>
              <button
                onClick={() => {
                  alert('Reschedule request sent to Dr. Jams Alther.');
                  setSessionModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#F1ECFF] text-[#242033] text-xs font-semibold hover:bg-[#DCD2FF] transition-colors"
              >
                Request Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

