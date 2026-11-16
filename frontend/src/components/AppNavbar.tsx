import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, HeartHandshake, CalendarCheck2, TrendingUp, Settings, Bell, ChevronDown, Shield, LogOut } from 'lucide-react';

interface AppNavbarProps {
  userRole: string;
  userName: string;
  onOpenCheckin: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onLogout: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  userRole,
  userName,
  onOpenCheckin,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  // Define authorized portal destination
  const getHomePath = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'counsellor') return '/counsellor';
    return '/dashboard';
  };

  const getRoleDisplayName = () => {
    if (userRole === 'admin') return 'System Administrator';
    if (userRole === 'counsellor') return 'Psychiatrist / Counsellor';
    return 'Individual User';
  };

  return (
    <div className="w-full flex items-center justify-between py-2 px-2 sm:px-4">
      {/* Brand Identity */}
      <div 
        onClick={() => navigate(getHomePath())} 
        className="flex items-center space-x-3 cursor-pointer select-none group"
      >
        <div className="w-10 h-10 rounded-full bg-[#242033] flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-2xl tracking-tight text-[#242033]">
            Aarvya AI
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#858098] -mt-1">
            EVERY EMOTION MATTERS
          </span>
        </div>
      </div>

      {/* Center Navigation - STRICTLY ROLE-BASED */}
      <nav className="hidden md:flex items-center bg-[#F1ECFF]/80 backdrop-blur-md p-1.5 rounded-full border border-white/70 shadow-sm">
        {userRole === 'user' && (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentPath === '/dashboard'
                  ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
                  : 'text-[#858098] hover:text-[#242033]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={onOpenCheckin}
              className="flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all text-[#858098] hover:text-[#242033]"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Daily Check-in</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/progress')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentPath.includes('/progress')
                  ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
                  : 'text-[#858098] hover:text-[#242033]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>My Progress</span>
            </button>
          </>
        )}

        {userRole === 'counsellor' && (
          <button
            onClick={() => navigate('/counsellor')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentPath.startsWith('/counsellor')
                ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
                : 'text-[#858098] hover:text-[#242033]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Counsellor Clinical Console</span>
          </button>
        )}

        {userRole === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentPath.startsWith('/admin')
                ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
                : 'text-[#858098] hover:text-[#242033]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administrator Console</span>
          </button>
        )}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Settings Button */}
        <button 
          title="Platform Security & Governance"
          onClick={() => alert(`Aarvya AI Security Status:\n• Active Session: ${getRoleDisplayName()}\n• Data Isolation: Strict Role-Based\n• Encryption: AES-256\n• Primary Database: MongoDB via PyMongo`)}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-white/80 flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-sm transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button 
          onClick={onOpenNotifications}
          title="Activity Notifications"
          className="relative w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-white/80 flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-sm transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#7546F5] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Profile & Logout Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#7546F5] flex items-center justify-center text-white text-xs font-bold">
              {userName ? userName.charAt(0).toUpperCase() : (userRole === 'admin' ? 'A' : userRole === 'counsellor' ? 'C' : 'U')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#242033] leading-none">
                {userName || (userRole === 'counsellor' ? 'Dr. Jams' : userRole === 'admin' ? 'Administrator' : 'User')}
              </span>
              <span className="text-[10px] text-[#7546F5] font-medium capitalize">
                {getRoleDisplayName()}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#858098]" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#DCD2FF] p-2.5 z-50 animate-fadeIn"
            >
              <div className="px-3 py-2 border-b border-[#F1ECFF] mb-1">
                <p className="text-xs font-bold text-[#242033] truncate">{userName || 'Active Account'}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-[#7546F5] font-semibold">{getRoleDisplayName()}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate(getHomePath());
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#242033] hover:bg-[#F8F5FF] flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#7546F5]" />
                  <span>My Portal</span>
                </button>

                <div className="border-t border-[#F1ECFF] pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppNavbar;
