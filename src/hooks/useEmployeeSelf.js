/**
 * useEmployeeSelf
 *
 * Used in the App/Layout wrapper for employees.
 * Fetches the logged-in employee's own permissions so the Sidebar
 * can show only what they're allowed to see.
 *
 * Usage in your App layout:
 *
 *   const { permissions, loading } = useEmployeeSelf(employeeId);
 *   <Sidebar role="employee" permissions={permissions} ... />
 */

import { useEffect, useState } from 'react';
import { graphqlRequest } from '../api/graphql';
import { GET_EMPLOYEE_PERMISSIONS } from '../graphql/employeeQueries';

export const useEmployeeSelf = (employeeId) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!employeeId) return;

        const fetchPerms = async () => {
            setLoading(true);
            try {
                const data = await graphqlRequest(GET_EMPLOYEE_PERMISSIONS, {
                    employeeId: Number(employeeId),
                });
                setPermissions(data.employeePermissions || []);
            } catch (err) {
                console.error('Could not fetch self permissions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerms();
    }, [employeeId]);

    /**
     * Check if employee can access a module.
     * minLevel: 'view' (any access) | 'update' (update access only)
     */
    const canAccess = (moduleKey, minLevel = 'view') => {
        const perm = permissions.find((p) => p.module === moduleKey);
        if (!perm || perm.access === 'no_access') return false;
        if (minLevel === 'update') return perm.access === 'update';
        return true; // 'view' or 'update' both satisfy minLevel='view'
    };

    return { permissions, loading, canAccess };
};


/**
 * useEmployeeSelf
 *
 * For a logged-in employee, this hook:
 *  1. Calls `myEmployeeProfile { id }` to get the Employee model PK
 *     (because the login token only gives us the Django User id, not Employee id)
 *  2. Then calls `employeePermissions(employeeId: id)` to get their permissions
 *  3. Exposes `canAccess(moduleKey, minLevel)` for route guards
 *
 * Pass `enabled=false` for admin/manager so no requests are made.
 */

// import { useEffect, useState } from 'react';
// import { graphqlRequest } from '../api/graphql';
// import { GET_EMPLOYEE_PERMISSIONS, GET_MY_EMPLOYEE_PROFILE } from '../graphql/employeeQueries';

// export const useEmployeeSelf = (enabled = false) => {
//     const [permissions, setPermissions] = useState([]);
//     const [employeeId, setEmployeeId] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!enabled) return;

//         const fetchAll = async () => {
//             setLoading(true);
//             try {
//                 // Step 1 — resolve Employee PK from the logged-in user's token
//                 const profileData = await graphqlRequest(GET_MY_EMPLOYEE_PROFILE);
//                 const empId = profileData?.myEmployeeProfile?.id;

//                 if (!empId) {
//                     console.warn('useEmployeeSelf: myEmployeeProfile returned no id');
//                     return;
//                 }

//                 setEmployeeId(empId);

//                 // Step 2 — fetch permissions for that employee
//                 const permData = await graphqlRequest(GET_EMPLOYEE_PERMISSIONS, {
//                     employeeId: empId,
//                 });
//                 setPermissions(permData?.employeePermissions || []);
//             } catch (err) {
//                 console.error('Could not fetch employee self profile/permissions:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAll();
//     }, [enabled]);

//     /**
//      * Check if employee can access a module.
//      * minLevel: 'view' (any non-blocked access) | 'update' (update only)
//      */
//     const canAccess = (moduleKey, minLevel = 'view') => {
//         const perm = permissions.find((p) => p.module === moduleKey);
//         if (!perm || perm.access === 'no_access') return false;
//         if (minLevel === 'update') return perm.access === 'update';
//         return true;
//     };

//     return { permissions, employeeId, loading, canAccess };
// };