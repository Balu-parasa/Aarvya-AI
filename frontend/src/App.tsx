import { useState, useEffect } from 'react';
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
import type { DashboardOverview } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin' | 'landing'>('dashboard');
  const [userRole, setUserRole] = useState<'user' | 'counsellor' | 'admin'>('user');
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  const loadOverview = async () => {
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#E9E2FF] flex flex-col font-sans antialiased text-[#242033] relative">
      {/* Subtle Ambient Glows */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-[#DCD2FF]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-[#F8F5FF]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Header / Navigation with Clean Full-Width Spacing */}
      <div className="w-full border-b border-white/50 bg-white/20 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
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
      </div>

      {/* Main Web Page Content with Perfect Margins & Proportions */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between relative z-10">
        {/* Router Views */}
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
          <div className="flex-1 flex flex-col justify-between space-y-8 animate-fadeIn">
            {/* Hero Section: Left Brain & Floating Metrics + Right Health Chart */}
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8">
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
      </main>

      {/* Daily Check-in Modal */}
      <DailyCheckinModal
        isOpen={checkinOpen}
        onClose={() => setCheckinOpen(false)}
        onSuccess={loadOverview}
      />
    </div>
  );
}

export default App;
