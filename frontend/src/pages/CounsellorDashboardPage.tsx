import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CounsellorPortal } from '../components/CounsellorPortal';

const CounsellorDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto px-6 py-8 flex-1 animate-fadeIn">
      <CounsellorPortal onBackToDashboard={() => navigate('/dashboard')} />
    </div>
  );
};

export default CounsellorDashboardPage;

