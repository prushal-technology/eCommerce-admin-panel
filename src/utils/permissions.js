// const ACCESS_RANK = {
//   no_access: 0,
//   view: 1,
//   update: 2,
// };

// const MODULE_ALIASES = {
//   products: 'product',
//   categories: 'category',
//   orders: 'order',
//   carts: 'cart',
// };

// export const normalizePermissionValue = (value) =>
//   String(value || '').trim().toLowerCase();

// export const normalizeModule = (module) => {
//   const normalized = normalizePermissionValue(module);
//   return MODULE_ALIASES[normalized] || normalized;
// };

// export const normalizeAccess = (access) =>
//   normalizePermissionValue(access) || 'no_access';

// export const normalizePermissions = (permissions = []) =>
//   permissions
//     .filter(Boolean)
//     .map((permission) => ({
//       ...permission,
//       module: normalizeModule(permission.module),
//       access: normalizeAccess(permission.access),
//     }));

// export const isAdminUser = (user) => {
//   const role = normalizePermissionValue(user?.role);
//   const roleName = normalizePermissionValue(user?.roleName);
//   return role === 'admin' || role === 'company_admin' || roleName === 'admin';
// };

// export const canAccessPermission = (user, module, requiredAccess = 'view') => {
//   if (isAdminUser(user)) return true;

//   const targetModule = normalizeModule(module);
//   const targetAccess = normalizeAccess(requiredAccess || 'view');

//   if (!targetModule) return false;

//   const permission = normalizePermissions(user?.permissions).find(
//     (item) => item.module === targetModule
//   );

//   if (!permission || permission.access === 'no_access') return false;

//   const currentRank = ACCESS_RANK[permission.access] ?? 0;
//   const requiredRank = ACCESS_RANK[targetAccess] ?? ACCESS_RANK.view;

//   return currentRank >= requiredRank;
// };



// const ACCESS_RANK = {
//   no_access: 0,
//   view: 1,
//   update: 2,
// };

// const MODULE_ALIASES = {
//   products: 'product',
//   categories: 'category',
//   orders: 'order',
//   carts: 'cart',
// };

// export const normalizePermissionValue = (value) =>
//   String(value || '').trim().toLowerCase();

// export const normalizeModule = (module) => {
//   const normalized = normalizePermissionValue(module);
//   return MODULE_ALIASES[normalized] || normalized;
// };

// export const normalizeAccess = (access) =>
//   normalizePermissionValue(access) || 'no_access';

// export const normalizePermissions = (permissions = []) =>
//   permissions
//     .filter(Boolean)
//     .map((permission) => ({
//       ...permission,
//       module: normalizeModule(permission.module),
//       sub_module: permission.sub_module
//         ? normalizePermissionValue(permission.sub_module)
//         : null,
//       access: normalizeAccess(permission.access),
//     }));

// export const isAdminUser = (user) => {
//   const role = normalizePermissionValue(user?.role);
//   const roleName = normalizePermissionValue(user?.roleName);
//   return role === 'admin' || role === 'company_admin' || roleName === 'admin';
// };

// /**
//  * Check if user has at least `requiredAccess` for a given module/sub_module.
//  *
//  * Usage:
//  *   canAccessPermission(user, 'product')            // non-order module
//  *   canAccessPermission(user, 'order', 'view', 'system')  // order sub-module
//  */
// export const canAccessPermission = (
//   user,
//   module,
//   requiredAccess = 'view',
//   subModule = null
// ) => {
//   if (isAdminUser(user)) return true;

//   const targetModule = normalizeModule(module);
//   const targetAccess = normalizeAccess(requiredAccess || 'view');
//   const targetSubModule = subModule ? normalizePermissionValue(subModule) : null;

//   if (!targetModule) return false;

//   const allPerms = normalizePermissions(user?.permissions);

//   let permission;

//   if (targetModule === 'order' && targetSubModule) {
//     // Match on both module AND sub_module
//     permission = allPerms.find(
//       (p) => p.module === 'order' && p.sub_module === targetSubModule
//     );
//   } else if (targetModule === 'order' && !targetSubModule) {
//     // Generic order check: user has access if ANY sub_module grants it
//     permission = allPerms
//       .filter((p) => p.module === 'order')
//       .sort((a, b) => (ACCESS_RANK[b.access] ?? 0) - (ACCESS_RANK[a.access] ?? 0))[0];
//   } else {
//     permission = allPerms.find((p) => p.module === targetModule);
//   }

//   if (!permission || permission.access === 'no_access') return false;

//   const currentRank = ACCESS_RANK[permission.access] ?? 0;
//   const requiredRank = ACCESS_RANK[targetAccess] ?? ACCESS_RANK.view;

//   return currentRank >= requiredRank;
// };



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
    .map((permission) => {
      // Accept both camelCase (subModule) from GraphQL and
      // snake_case (sub_module) from older tokenAuth responses
      const rawSubModule =
        permission.subModule !== undefined
          ? permission.subModule
          : (permission.sub_module ?? null);

      return {
        ...permission,
        module: normalizeModule(permission.module),
        subModule: rawSubModule
          ? normalizePermissionValue(rawSubModule)
          : null,
        access: normalizeAccess(permission.access),
      };
    });

export const isAdminUser = (user) => {
  const role = normalizePermissionValue(user?.role);
  const roleName = normalizePermissionValue(user?.roleName);
  return role === 'admin' || role === 'company_admin' || roleName === 'admin';
};

/**
 * Check if user has at least `requiredAccess` for a given module/sub_module.
 *
 * canAccessPermission(user, 'product')                   → non-order
 * canAccessPermission(user, 'order', 'view', 'system')   → order sub-module
 */
export const canAccessPermission = (
  user,
  module,
  requiredAccess = 'view',
  subModule = null
) => {
  if (isAdminUser(user)) return true;

  const targetModule = normalizeModule(module);
  const targetAccess = normalizeAccess(requiredAccess || 'view');
  const targetSubModule = subModule ? normalizePermissionValue(subModule) : null;

  if (!targetModule) return false;

  const allPerms = normalizePermissions(user?.permissions);

  let permission;

  if (targetModule === 'order' && targetSubModule) {
    // 1. Exact sub-module match
    permission = allPerms.find(
      (p) => p.module === 'order' && p.subModule === targetSubModule
    );

    // 2. Fallback: generic order permission with no subModule
    //    (covers tokenAuth responses that omit subModule)
    if (!permission) {
      permission = allPerms.find(
        (p) => p.module === 'order' && !p.subModule
      );
    }
  } else if (targetModule === 'order' && !targetSubModule) {
    // Generic order check: highest-ranked across all order permissions
    permission = allPerms
      .filter((p) => p.module === 'order')
      .sort((a, b) => (ACCESS_RANK[b.access] ?? 0) - (ACCESS_RANK[a.access] ?? 0))[0];
  } else {
    permission = allPerms.find((p) => p.module === targetModule);
  }

  if (!permission || permission.access === 'no_access') return false;

  const currentRank = ACCESS_RANK[permission.access] ?? 0;
  const requiredRank = ACCESS_RANK[targetAccess] ?? ACCESS_RANK.view;

  return currentRank >= requiredRank;
};