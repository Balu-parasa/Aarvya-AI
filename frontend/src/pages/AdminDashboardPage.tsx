import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminPortal } from '../components/AdminPortal';
import { MultiLevelSurveillanceDashboard } from '../components/MultiLevelSurveillanceDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <Routes>
      <Route path="surveillance" element={<MultiLevelSurveillanceDashboard />} />
      <Route
        path="*"
        element={
          <div className="w-full mx-auto px-6 py-8 flex-1 animate-fadeIn">
            <AdminPortal onBackToDashboard={() => {}} />
          </div>
        }
      />
    </Routes>
  );
};

export default AdminDashboardPage;
