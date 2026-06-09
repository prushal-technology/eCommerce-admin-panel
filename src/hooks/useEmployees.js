import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    CREATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    UPDATE_EMPLOYEE_STATUS,
} from '../graphql/mutations';
import { GET_EMPLOYEES } from '../graphql/queries';

const formatEmployee = (emp) => ({
    id: emp.id,
    employeeId: emp.employeeId,
    firstName: emp.user?.firstName || '',
    lastName: emp.user?.lastName || '',
    name: `${emp.user?.firstName || ''} ${emp.user?.lastName || ''}`.trim(),
    email: emp.user?.email || '',
    phone: emp.user?.phone || '',
    roleName: emp.roleName,
    isActive: emp.isActive,
    status: emp.isActive ? 'active' : 'inactive',
    role: emp.roleName?.toLowerCase() || 'employee',
});

export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const { graphqlRequest } = await import('../api/graphql');
            const data = await graphqlRequest(GET_EMPLOYEES);
            setEmployees((data.employees?.employees || []).map(formatEmployee));
        } catch (error) {
            message.error('Failed to load employees: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const createEmployee = async (values) => {
        const { graphqlRequest } = await import('../api/graphql');
        await graphqlRequest(CREATE_EMPLOYEE, {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            employeeRoleName: values.employeeRoleName,
        });
        message.success('Employee added successfully');
        await loadEmployees();
    };

    const deleteEmployee = async (record) => {
        const { graphqlRequest } = await import('../api/graphql');
        await graphqlRequest(DELETE_EMPLOYEE, { employeeId: record.employeeId });
        message.success('Employee deleted successfully');
        await loadEmployees();
    };

    const toggleEmployeeStatus = async (record) => {
        const newIsActive = !record.isActive;
        const { graphqlRequest } = await import('../api/graphql');
        await graphqlRequest(UPDATE_EMPLOYEE_STATUS, {
            employeeId: record.employeeId,
            isActive: newIsActive,
        });
        message.success(`Employee ${newIsActive ? 'activated' : 'deactivated'} successfully`);
        await loadEmployees();
    };

    const filteredEmployees = useMemo(
        () =>
            employees.filter((emp) => {
                const matchesSearch =
                    emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
                    emp.phone.includes(searchText);
                const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
                const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
                return matchesSearch && matchesRole && matchesStatus;
            }),
        [employees, searchText, roleFilter, statusFilter]
    );

    const stats = useMemo(
        () => ({
            total: employees.length,
            active: employees.filter((e) => e.status === 'active').length,
            inactive: employees.filter((e) => e.status === 'inactive').length,
            admin: employees.filter((e) => e.role === 'admin').length,
            manager: employees.filter((e) => e.role === 'manager').length,
            employee: employees.filter((e) => e.role === 'employee').length,
        }),
        [employees]
    );

    const skeletonRows = useMemo(
        () => Array.from({ length: 6 }).map((_, i) => ({ id: `skeleton-${i}`, isSkeleton: true })),
        []
    );

    return {
        employees,
        filteredEmployees,
        loading,
        stats,
        skeletonRows,
        searchText,
        setSearchText,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,
        loadEmployees,
        createEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
    };
};