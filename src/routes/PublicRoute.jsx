import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoadingState from '../components/ui/LoadingState';

/** Redirects authenticated users away from public pages */
const PublicRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <LoadingState message="Loading..." />;
  if (user && userRole) {
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }
  return children;
};

export default PublicRoute;
