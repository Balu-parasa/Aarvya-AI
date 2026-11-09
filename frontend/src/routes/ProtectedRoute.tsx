import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('aarvya_token');
  const storedUser = localStorage.getItem('aarvya_user');

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (!allowedRoles.includes(user.role)) {
      // Redirect to the user's own dashboard
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'counsellor') return <Navigate to="/counsellor" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

