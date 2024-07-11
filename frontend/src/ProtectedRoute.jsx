// ProtectedRoute Component
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children, admin = false }) => {
  const { currentUser, isAdmin } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (admin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
