import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { graphqlRequest } from '../api/graphql';
import {
    CREATE_EMPLOYEE_PERMISSION,
    DELETE_EMPLOYEE_PERMISSION,
    UPDATE_EMPLOYEE_PERMISSION,
} from '../graphql/employeeMutations';
import { GET_EMPLOYEE_PERMISSIONS } from '../graphql/employeeQueries';

// All modules available in the system — add/remove to match your sidebar
export const ALL_MODULES = [
    { key: 'product', label: 'Product Management' },
    { key: 'category', label: 'Category Management' },
    { key: 'order', label: 'Order Management' },
    { key: 'stock', label: 'Stock Management' },


];

export const ACCESS_LEVELS = [
    { value: 'view', label: 'View', color: 'blue' },
    { value: 'update', label: 'Update', color: 'green' },
    { value: 'no_access', label: 'No Access', color: 'red' },
];

export const useEmployeePermissions = (employeeId) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadPermissions = useCallback(async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const data = await graphqlRequest(GET_EMPLOYEE_PERMISSIONS, {
                employeeId: Number(employeeId),
            });
            setPermissions(
                (data.employeePermissions || []).map((p) => ({
                    ...p,
                    module: p.module.toLowerCase(),
                    access: p.access.toLowerCase(),
                }))
            );
        } catch (error) {
            message.error('Failed to load permissions: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [employeeId]);
    //console.log('permissions:', permissions);

    useEffect(() => {
        loadPermissions();
    }, [loadPermissions]);

    // Find existing permission record for a module
    const getPermissionForModule = (moduleKey) =>
        permissions.find((p) => p.module === moduleKey) || null;

    // Called when user changes access level in the UI
    const handleAccessChange = async (moduleKey, newAccess) => {
        setSaving(true);
        try {
            const existing = getPermissionForModule(moduleKey);

            if (!existing) {
                // No record yet → create
                await graphqlRequest(CREATE_EMPLOYEE_PERMISSION, {
                    employeeId: Number(employeeId),
                    module: moduleKey,
                    access: newAccess,
                });
                message.success(`Permission set for ${moduleKey}`);
            } else {
                // Update existing (no_access is a valid stored value)
                await graphqlRequest(UPDATE_EMPLOYEE_PERMISSION, {
                    id: Number(existing.id),
                    access: newAccess,
                });
                message.success(`Permission updated for ${moduleKey}`);
            }

            await loadPermissions();
        } catch (error) {
            message.error('Failed to update permission: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const deletePermission = async (permissionId) => {
        setSaving(true);
        try {
            await graphqlRequest(DELETE_EMPLOYEE_PERMISSION, {
                id: Number(permissionId),
            });
            message.success('Permission removed');
            await loadPermissions();
        } catch (error) {
            message.error('Failed to remove permission: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return {
        permissions,
        loading,
        saving,
        loadPermissions,
        getPermissionForModule,
        handleAccessChange,
        deletePermission,
    };
};