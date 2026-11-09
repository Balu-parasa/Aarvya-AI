import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BrainVisualization } from '../components/BrainVisualization';
import { HealthImprovementChart } from '../components/HealthImprovementChart';
import { BottomSection } from '../components/BottomSection';
import { ProgressPage } from '../components/ProgressPage';
import { fetchDashboardOverview } from '../services/api';
import type { DashboardOverview } from '../types';

interface UserDashboardPageProps {
  onOpenCheckin: () => void;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onOpenCheckin }) => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardOverview();
        setOverview(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  if (!overview) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#7546F5]/30 border-t-[#7546F5] rounded-full animate-spin" />
          <p className="text-sm text-[#858098] font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="progress"
        element={
          <div className="w-full mx-auto px-6 py-8 flex-1 animate-fadeIn">
            <ProgressPage
              onBackToDashboard={() => navigate('/dashboard')}
              onOpenCheckin={onOpenCheckin}
            />
          </div>
        }
      />
      <Route
        path="*"
        element={
          <div className="w-full mx-auto px-6 py-8 flex-1 flex flex-col space-y-8 lg:space-y-10 animate-fadeIn">
            {/* Top row: Brain & Floating Cards + Health Improvement Chart */}
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8 xl:gap-10">
              <BrainVisualization
                userName={overview.greeting.name}
                telemetry={overview.telemetry}
                onOpenCheckin={onOpenCheckin}
              />
              <HealthImprovementChart
                title={overview.health_improvement.title}
                subtitle={overview.health_improvement.subtitle}
                data={overview.health_improvement.data}
              />
            </div>

            {/* Bottom Section */}
            <BottomSection
              reports={overview.reports}
              upcomingSession={overview.upcoming_session}
              activePath={overview.active_path}
            />
          </div>
        }
      />
    </Routes>
  );
};

export default UserDashboardPage;
