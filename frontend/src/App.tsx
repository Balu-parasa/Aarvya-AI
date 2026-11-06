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
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { fetchDashboardOverview, fetchNotifications, markNotificationsAsRead } from './services/api';
import type { DashboardOverview } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin' | 'landing'>('dashboard');
  const [userRole, setUserRole] = useState<'user' | 'counsellor' | 'admin'>('user');
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  const loadOverview = async () => {
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    await markNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  useEffect(() => {
    loadOverview();
    loadNotifications();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#E9E2FF] flex flex-col font-sans antialiased text-[#242033] relative">
      {/* Subtle Ambient Glows */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-[#DCD2FF]/35 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-[#F8F5FF]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Header / Navigation with Fluid Full-Bleed Layout */}
      <header className="w-full border-b border-white/50 bg-white/20 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5">
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
            onOpenNotifications={() => setNotificationsOpen(true)}
            unreadNotificationsCount={notifications.filter((n) => !n.is_read).length}
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
      </header>

      {/* Main Web Page Content - Full Width Fluid Canvas without Left/Right Empty Gaps */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-10 flex flex-col justify-between relative z-10">
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
          <div className="flex-1 flex flex-col justify-between space-y-8 lg:space-y-10 animate-fadeIn">
            {/* Hero Section: Left Brain & Floating Metrics + Right Health Chart */}
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8 xl:gap-10">
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

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}

export default App;
