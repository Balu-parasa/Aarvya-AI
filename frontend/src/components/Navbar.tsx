import React, { useState } from 'react';
import { LayoutDashboard, HeartHandshake, CalendarCheck2, TrendingUp, Settings, Bell, ChevronDown, Shield, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin' | 'landing';
  setActiveTab: (tab: 'dashboard' | 'counsellor' | 'checkin' | 'progress' | 'admin' | 'landing') => void;
  onOpenCheckin: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  userRole: 'user' | 'counsellor' | 'admin';
  setUserRole: (role: 'user' | 'counsellor' | 'admin') => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckin,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  userRole,
  setUserRole,
  userName,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between py-2 px-2 sm:px-4">
      {/* Brand Identity */}
      <div 
        onClick={() => setActiveTab('dashboard')} 
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

      {/* Floating Pill Center Navigation */}
      <nav className="hidden md:flex items-center bg-[#F1ECFF]/80 backdrop-blur-md p-1.5 rounded-full border border-white/70 shadow-sm">
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
          onClick={() => alert("Platform Settings:\n• Encryption: Active (AES-256)\n• Informed Consent: Verified\n• Primary Database: MongoDB (PyMongo)\n• AI Engine: Baseline Deviation Analyzer")}
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

        {/* Interactive Role & Dashboard Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#242033] leading-none">
                {activeTab === 'counsellor' ? 'Dr. Jams' : activeTab === 'admin' ? 'Admin' : userName}
              </span>
              <span className="text-[10px] text-[#7546F5] font-medium capitalize">
                {activeTab === 'counsellor' ? 'Psychiatrist' : activeTab === 'admin' ? 'System Admin' : 'Individual'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#858098]" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#DCD2FF] p-2.5 z-50 animate-fadeIn"
            >
              <div className="px-3 py-2 border-b border-[#F1ECFF] mb-1">
                <p className="text-xs font-bold text-[#242033]">Switch Dashboard View</p>
                <p className="text-[11px] text-[#858098]">Select any role to view its dedicated portal</p>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setUserRole('user');
                    setActiveTab('dashboard');
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    activeTab === 'dashboard' ? 'bg-[#F1ECFF] text-[#7546F5] font-semibold' : 'text-[#242033] hover:bg-[#F8F5FF]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>1. Main User Dashboard</span>
                  </span>
                  {activeTab === 'dashboard' && <span className="text-[10px] bg-[#7546F5] text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setUserRole('counsellor');
                    setActiveTab('counsellor');
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    activeTab === 'counsellor' ? 'bg-[#F1ECFF] text-[#7546F5] font-semibold' : 'text-[#242033] hover:bg-[#F8F5FF]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🩺</span>
                    <span>2. Psychiatrist Portal</span>
                  </span>
                  {activeTab === 'counsellor' && <span className="text-[10px] bg-[#7546F5] text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('progress');
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    activeTab === 'progress' ? 'bg-[#F1ECFF] text-[#7546F5] font-semibold' : 'text-[#242033] hover:bg-[#F8F5FF]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>3. Progress & Trends</span>
                  </span>
                  {activeTab === 'progress' && <span className="text-[10px] bg-[#7546F5] text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setUserRole('admin');
                    setActiveTab('admin');
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    activeTab === 'admin' ? 'bg-[#F1ECFF] text-[#7546F5] font-semibold' : 'text-[#242033] hover:bg-[#F8F5FF]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Shield className="w-3.5 h-3.5 text-[#7546F5]" />
                    <span>4. Administrator Portal</span>
                  </span>
                  {activeTab === 'admin' && <span className="text-[10px] bg-[#7546F5] text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <div className="border-t border-[#F1ECFF] pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('landing');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 ${
                      activeTab === 'landing' ? 'bg-[#F1ECFF] text-[#7546F5] font-semibold' : 'text-[#242033] hover:bg-[#F8F5FF]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#858098]" />
                    <span>5. Public Landing Page</span>
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
