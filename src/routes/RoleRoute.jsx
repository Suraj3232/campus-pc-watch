import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoadingState from '../components/ui/LoadingState';

/** Requires user to have a specific role */
const RoleRoute = ({ role, children }) => {
  const { userRole, loading } = useAuth();
  if (loading) return <LoadingState message="Checking permissions..." />;
  if (userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }
  return children;
};

export default RoleRoute;
