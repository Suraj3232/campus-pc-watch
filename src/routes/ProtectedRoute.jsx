import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoadingState from '../components/ui/LoadingState';

/** Requires user to be authenticated */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState message="Authenticating..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
