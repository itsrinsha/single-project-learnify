import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const location = useLocation();

  const getLoginPath = () => {
    if (location.pathname.startsWith('/admin')) return '/admin/login';
    if (location.pathname.startsWith('/instructor')) return '/instructor/login';
    return '/login';
  };

  // If no user or no token, redirect to login
  if (!user || !token) {
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  // If roles are restricted and user's role doesn't match
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role.toLowerCase()))) {
    // If there is a role mismatch (e.g. testing Admin in the same browser as Instructor),
    // we must clear the token, otherwise PublicRoute will auto-redirect them back to the Admin dashboard.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Using window.location to force a hard reload and clear Redux state
    window.location.href = getLoginPath();
    return null;
  }

  // Global Block Check
  if (user.isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  // Special check for Instructors: Must be approved to access dashboard/courses
  if (user.role === 'instructor') {
    const isVerificationPage = location.pathname.includes('/instructor/verify');
    const isPendingPage = location.pathname.includes('/instructor/pending');

    if (user.approvalStatus === 'approved') {
      if (isVerificationPage || isPendingPage) {
        return <Navigate to="/instructor/dashboard" replace />;
      }
    } else if (user.approvalStatus === 'rejected') {
      if (!isVerificationPage && !isPendingPage) {
        return <Navigate to="/instructor/pending" replace />;
      }
    } else if (user.approvalStatus === 'pending') {
      if (!isPendingPage) {
        return <Navigate to="/instructor/pending" replace />;
      }
    } else {
      // unverified
      if (!isVerificationPage) {
        return <Navigate to="/instructor/verify" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
