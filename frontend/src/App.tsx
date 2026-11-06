import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BrainVisualization } from './components/BrainVisualization';
import { HealthImprovementChart } from './components/HealthImprovementChart';
import { BottomSection } from './components/BottomSection';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { CounsellorPortal } from './components/CounsellorPortal';
import { ProgressPage } from './components/ProgressPage';
import { AdminPortal } from './components/AdminPortal';
import { LandingPage } from './components/LandingPage';
import { fetchDashboardOverview } from './services/api';
import { DashboardOverview } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin' | 'landing'>('dashboard');
  const [userRole, setUserRole] = useState<'user' | 'counsellor' | 'admin'>('user');
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#C8C1E3] p-3 sm:p-6 lg:p-8 flex items-center justify-center font-sans antialiased text-[#242033]">
      {/* Primary Rounded Dashboard Canvas matching the Mindo Reference */}
      <main className="w-full max-w-[1440px] bg-gradient-to-b from-[#E9E2FF] via-[#EFE8FF] to-[#E9E2FF] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(117,70,245,0.18)] border border-white/70 p-4 sm:p-7 lg:p-9 flex flex-col justify-between min-h-[92vh] relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DCD2FF]/40 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F8F5FF]/50 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Global Navigation */}
        <div className="relative z-10">
          <Navbar
            activeTab={activeTab === 'landing' ? 'dashboard' : activeTab}
            setActiveTab={(tab) => {
              if (tab === 'checkin') {
                setCheckinOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenCheckin={() => setCheckinOpen(true)}
            userRole={userRole}
            setUserRole={(role) => {
              setUserRole(role);
              if (role === 'counsellor') setActiveTab('counsellor');
              else if (role === 'admin') setActiveTab('admin');
              else setActiveTab('dashboard');
            }}
            userName={overview?.greeting.name || 'Sara'}
          />
        </div>

        {/* Main View Router */}
        <div className="relative z-10 flex-1 flex flex-col justify-between my-2">
          {activeTab === 'landing' && (
            <LandingPage onEnterApp={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'counsellor' && (
            <CounsellorPortal onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'progress' && (
            <ProgressPage
              onBackToDashboard={() => setActiveTab('dashboard')}
              onOpenCheckin={() => setCheckinOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPortal onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'dashboard' && overview && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              {/* Hero Section: Left Brain & Floating Metrics + Right Health Chart */}
              <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 my-2">
                <BrainVisualization
                  userName={overview.greeting.name}
                  telemetry={overview.telemetry}
                  onOpenCheckin={() => setCheckinOpen(true)}
                />

                <HealthImprovementChart
                  title={overview.health_improvement.title}
                  subtitle={overview.health_improvement.subtitle}
                  data={overview.health_improvement.data}
                />
              </div>

              {/* Bottom Section: Reports, Upcoming Session, Active Path */}
              <BottomSection
                reports={overview.reports}
                upcomingSession={overview.upcoming_session}
                activePath={overview.active_path}
              />
            </div>
          )}
        </div>

        {/* Daily Check-in Modal */}
        <DailyCheckinModal
          isOpen={checkinOpen}
          onClose={() => setCheckinOpen(false)}
          onSuccess={loadOverview}
        />
      </main>
    </div>
  );
}

export default App;
