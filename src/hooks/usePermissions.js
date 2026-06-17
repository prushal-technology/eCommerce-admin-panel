import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const auth = useAuth();

  return useMemo(
    () => ({
      user: auth.user,
      permissions: auth.permissions,
      employeeId: auth.employeeId,
      roleName: auth.roleName,
      isAdmin: auth.isAdmin,
      hasPermission: auth.hasPermission,
      canView: (module) => auth.hasPermission(module, 'view'),
      canUpdate: (module) => auth.hasPermission(module, 'update'),
    }),
    [auth]
  );
};

export default usePermissions;
