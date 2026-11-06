import React from 'react';
import { LayoutDashboard, HeartHandshake, CalendarCheck2, TrendingUp, Settings, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin') => void;
  onOpenCheckin: () => void;
  userRole: 'user' | 'counsellor' | 'admin';
  setUserRole: (role: 'user' | 'counsellor' | 'admin') => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckin,
  userRole,
  setUserRole,
  userName,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-4 px-2 sm:px-6">
      {/* Brand Identity */}
      <div 
        onClick={() => setActiveTab('dashboard')} 
        className="flex items-center space-x-3 cursor-pointer select-none group"
      >
        <div className="w-10 h-10 rounded-full bg-[#242033] flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
          M
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-2xl tracking-tight text-[#242033]">
            MindGuard
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#858098] -mt-1">
            AARVYA AI
          </span>
        </div>
      </div>

      {/* Floating Pill Center Navigation */}
      <nav className="hidden md:flex items-center bg-[#F1ECFF]/70 backdrop-blur-md p-1.5 rounded-full border border-white/60 shadow-sm">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'dashboard'
              ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
              : 'text-[#858098] hover:text-[#242033]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('counsellor')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'counsellor'
              ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
              : 'text-[#858098] hover:text-[#242033]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Psychiatrist</span>
        </button>

        <button
          onClick={onOpenCheckin}
          className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'checkin'
              ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
              : 'text-[#858098] hover:text-[#242033]'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Session</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'progress'
              ? 'bg-white text-[#242033] shadow-md shadow-[#7546F5]/10 font-semibold'
              : 'text-[#858098] hover:text-[#242033]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Progress</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Settings Button */}
        <button 
          title="Platform Settings"
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-white/80 flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-sm transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button 
          title="Notifications"
          className="relative w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-white/80 flex items-center justify-center text-[#242033] hover:text-[#7546F5] shadow-sm transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#7546F5] ring-2 ring-white"></span>
        </button>

        {/* User Profile & Role Selector */}
        <div className="relative group">
          <div className="flex items-center space-x-2 pl-2 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>

          {/* Quick Role & Portal Switcher Dropdown */}
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#DCD2FF] p-2 hidden group-hover:block group-focus-within:block z-50">
            <div className="px-3 py-2 border-b border-[#F1ECFF]">
              <p className="text-xs font-semibold text-[#242033]">{userName}</p>
              <p className="text-[11px] text-[#858098] capitalize">Active Role: {userRole}</p>
            </div>
            
            <div className="py-1">
              <button
                onClick={() => { setUserRole('user'); setActiveTab('dashboard'); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                  userRole === 'user' ? 'bg-[#F1ECFF] text-[#7546F5]' : 'text-[#242033] hover:bg-[#F8F5FF]'
                }`}
              >
                👤 Victim / Individual View
              </button>
              <button
                onClick={() => { setUserRole('counsellor'); setActiveTab('counsellor'); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                  userRole === 'counsellor' ? 'bg-[#F1ECFF] text-[#7546F5]' : 'text-[#242033] hover:bg-[#F8F5FF]'
                }`}
              >
                🩺 Counsellor Clinical Portal
              </button>
              <button
                onClick={() => { setUserRole('admin'); setActiveTab('admin'); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                  userRole === 'admin' ? 'bg-[#F1ECFF] text-[#7546F5]' : 'text-[#242033] hover:bg-[#F8F5FF]'
                }`}
              >
                🛡️ System Administrator Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
