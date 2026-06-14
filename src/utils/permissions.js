const ACCESS_RANK = {
  no_access: 0,
  view: 1,
  update: 2,
};

const MODULE_ALIASES = {
  products: 'product',
  categories: 'category',
  orders: 'order',
  carts: 'cart',
};

export const normalizePermissionValue = (value) =>
  String(value || '').trim().toLowerCase();

export const normalizeModule = (module) => {
  const normalized = normalizePermissionValue(module);
  return MODULE_ALIASES[normalized] || normalized;
};

export const normalizeAccess = (access) =>
  normalizePermissionValue(access) || 'no_access';

export const normalizePermissions = (permissions = []) =>
  permissions
    .filter(Boolean)
    .map((permission) => ({
      ...permission,
      module: normalizeModule(permission.module),
      access: normalizeAccess(permission.access),
    }));

export const isAdminUser = (user) => {
  const role = normalizePermissionValue(user?.role);
  const roleName = normalizePermissionValue(user?.roleName);
  return role === 'admin' || role === 'company_admin' || roleName === 'admin';
};

export const canAccessPermission = (user, module, requiredAccess = 'view') => {
  if (isAdminUser(user)) return true;

  const targetModule = normalizeModule(module);
  const targetAccess = normalizeAccess(requiredAccess || 'view');

  if (!targetModule) return false;

  const permission = normalizePermissions(user?.permissions).find(
    (item) => item.module === targetModule
  );

  if (!permission || permission.access === 'no_access') return false;

  const currentRank = ACCESS_RANK[permission.access] ?? 0;
  const requiredRank = ACCESS_RANK[targetAccess] ?? ACCESS_RANK.view;

  return currentRank >= requiredRank;
};

