import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PermissionRoute = ({ module, access = 'view', children }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasPermission(module, access)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default PermissionRoute;
