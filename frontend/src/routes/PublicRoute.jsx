import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token && user) {
    // Allow logged-in students to visit instructor login/register pages
    if (user?.role === 'student' && location.pathname.startsWith('/instructor')) {
      return children;
    }

    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;