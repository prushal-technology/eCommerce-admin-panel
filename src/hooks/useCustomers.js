import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI || 'http://192.168.1.40:8000/graphql/';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(localStorage.getItem('authToken') && {
        Authorization: `JWT ${localStorage.getItem('authToken')}`,
    }),
});

export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [searchText, setSearchText] = useState('');

    const initialFetchDone = useRef(false);
    const skipSearchEffect = useRef(true);

    // Initial load
    useEffect(() => {
        if (initialFetchDone.current) return;
        initialFetchDone.current = true;
        loadCustomers(null, true);
    }, []);

    // Debounced search
    useEffect(() => {
        if (skipSearchEffect.current) {
            skipSearchEffect.current = false;
            return;
        }
        const timer = setTimeout(() => loadCustomers(null, true), 500);
        return () => clearTimeout(timer);
    }, [searchText]);

    const loadCustomers = async (cursor = null, isNewSearch = false) => {
        isNewSearch ? setLoading(true) : setFetchingMore(true);

        try {
            let queryArgs = 'first: 10';
            if (cursor) queryArgs += `, after: "${cursor}"`;
            if (searchText) queryArgs += `, search: ${JSON.stringify(searchText)}`;

            const response = await fetch(GRAPHQL_URI, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    query: `
            query {
              customers(${queryArgs}) {
                customers {
                  id
                  user { firstName lastName email phone }
                }
                nextCursor
                hasMore
              }
            }
          `,
                }),
            });

            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            const transformed = (result.data?.customers?.customers || []).map((c) => ({
                id: c.id,
                customerId: c.id,
                firstName: c.user?.firstName || '',
                lastName: c.user?.lastName || '',
                email: c.user?.email || 'N/A',
                phone: c.user?.phone || null,
                fullName: `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || 'N/A',
            }));

            setCustomers((prev) => {
                if (isNewSearch) return transformed;
                const newIds = new Set(transformed.map((c) => c.id));
                return [...prev.filter((c) => !newIds.has(c.id)), ...transformed];
            });

            setNextCursor(result.data?.customers?.nextCursor);
            setHasMore(result.data?.customers?.hasMore);
        } catch (error) {
            message.error('Failed to load customers: ' + error.message);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(GRAPHQL_URI, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    query: `
            mutation {
              deleteCustomer(id: ${parseInt(id)}) { ok }
            }
          `,
                }),
            });

            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            const { deleteCustomer: dc } = result.data || {};
            if (dc?.ok === true || dc === null) {
                setCustomers((prev) => prev.filter((c) => c.id !== id));
                message.success('Customer deleted successfully');
            } else {
                message.error('Delete operation failed');
            }
        } catch (error) {
            message.error('Failed to delete customer: ' + error.message);
        }
    };

    const updateCustomer = async (id, values) => {
        const response = await fetch(GRAPHQL_URI, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                query: `
          mutation {
            updateCustomer(
              id: ${id},
              firstName: "${values.firstName || ''}",
              lastName: "${values.lastName || ''}",
              phone: "${values.phone || ''}"
            ) {
              customer { id }
            }
          }
        `,
            }),
        });

        const result = await response.json();
        if (result.errors) throw new Error(result.errors[0].message);

        if (result.data?.updateCustomer?.customer) {
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === id
                        ? {
                            ...c,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim() || 'N/A',
                        }
                        : c
                )
            );
            message.success('Customer updated successfully');
        } else {
            throw new Error('Failed to update customer');
        }
    };

    const skeletonRows = useMemo(
        () => Array.from({ length: 8 }).map((_, i) => ({ id: `skeleton-${i}`, isSkeleton: true })),
        []
    );

    return {
        customers,
        loading,
        fetchingMore,
        nextCursor,
        hasMore,
        searchText,
        setSearchText,
        skeletonRows,
        loadCustomers,
        deleteCustomer,
        updateCustomer,
    };
};