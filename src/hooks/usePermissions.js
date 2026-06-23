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
      canView: (module, subModule = null) => auth.hasPermission(module, 'view', subModule),
      canUpdate: (module, subModule = null) => auth.hasPermission(module, 'update', subModule),
    }),
    [auth]
  );
};

export default usePermissions;