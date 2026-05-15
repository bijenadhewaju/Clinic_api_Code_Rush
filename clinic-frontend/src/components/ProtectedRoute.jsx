import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthManager';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/dashboard/doctor" replace />;
    if (user.role === 'patient') return <Navigate to="/dashboard/patient" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
