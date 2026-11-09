import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { fetchNotifications, markNotificationsAsRead } from './services/api';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CounsellorDashboardPage from './pages/CounsellorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AppNavbar from './components/AppNavbar';

export function App() {
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [userName, setUserName] = useState<string>('');

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

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('aarvya_token');
    const storedUser = localStorage.getItem('aarvya_user');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserRole(user.role || 'user');
        setUserName(user.display_name || user.name || '');
        loadNotifications();
      } catch {}
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserRole(user.role || 'user');
    setUserName(user.display_name || user.name || '');
    loadNotifications();
  };

  const handleLogout = () => {
    localStorage.removeItem('aarvya_token');
    localStorage.removeItem('aarvya_user');
    setIsLoggedIn(false);
    setUserRole('user');
    setUserName('');
    setNotifications([]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#E9E2FF] flex flex-col font-sans antialiased text-[#242033] relative">
        {/* Ambient glows */}
        <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-[#DCD2FF]/35 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-[#F8F5FF]/50 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header — only show when logged in */}
        {isLoggedIn && (
          <header className="w-full border-b border-white/50 bg-white/20 backdrop-blur-md sticky top-0 z-40 shadow-xs">
            <div className="w-full mx-auto px-6 py-3.5">
              <AppNavbar
                userRole={userRole}
                userName={userName}
                onOpenCheckin={() => setCheckinOpen(true)}
                onOpenNotifications={() => setNotificationsOpen(true)}
                unreadNotificationsCount={notifications.filter((n) => !n.is_read).length}
                onLogout={handleLogout}
              />
            </div>
          </header>
        )}

        {/* Main Content - Routes */}
        <main className="flex-1 w-full relative z-10">
          <Routes>
            <Route path="/login" element={
              isLoggedIn
                ? <Navigate to={userRole === 'admin' ? '/admin' : userRole === 'counsellor' ? '/counsellor' : '/dashboard'} replace />
                : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/register" element={
              isLoggedIn
                ? <Navigate to={userRole === 'admin' ? '/admin' : userRole === 'counsellor' ? '/counsellor' : '/dashboard'} replace />
                : <RegisterPage />
            } />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboardPage onOpenCheckin={() => setCheckinOpen(true)} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counsellor/*"
              element={
                <ProtectedRoute allowedRoles={['counsellor']}>
                  <CounsellorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        {/* Modals & Drawers */}
        <DailyCheckinModal isOpen={checkinOpen} onClose={() => setCheckinOpen(false)} onSuccess={() => {}} />
        <NotificationsDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
