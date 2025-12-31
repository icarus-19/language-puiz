import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-page-loading">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
