import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPortal } from '../components/AdminPortal';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto px-6 py-8 flex-1 animate-fadeIn">
      <AdminPortal onBackToDashboard={() => navigate('/dashboard')} />
    </div>
  );
};

export default AdminDashboardPage;

