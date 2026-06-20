import { message } from 'antd';
import { useCallback, useState } from 'react';
import { getAllBulkOrderEnquiries, updateBulkOrderEnquiry } from '../api/bulkOrdersEnquiry';

export default function useBulkOrderEnquiry() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    // ── Fetch all enquiries (optional search query) ───────────────────────────
    const fetchEnquiries = useCallback(
        async (query = null, cursor = null, append = false) => {
            try {
                if (cursor) {
                    setFetchingMore(true);
                } else {
                    setLoading(true);
                }

                const result =
                    await getAllBulkOrderEnquiries(
                        query,
                        10,
                        cursor
                    );

                if (result.success) {
                    setEnquiries((prev) =>
                        append
                            ? [...prev, ...result.enquiries]
                            : result.enquiries
                    );

                    setNextCursor(result.nextCursor);
                    setHasMore(result.hasMore);
                }
            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        },
        []
    );

    // ── Update status (and optionally bulkOrderDetails) ───────────────────────
    const changeBulkOrderStatus = useCallback(
        async (bulkOrderId, status, bulkOrderDetails = '') => {
            if (!canManageOrders) return false;
            setUpdateLoading(true);
            try {
                const res = await updateBulkOrderEnquiry(bulkOrderId, status, bulkOrderDetails);
                if (res.success) {
                    // Optimistically update local state
                    setEnquiries((prev) =>
                        prev.map((e) =>
                            e.id === String(bulkOrderId)
                                ? { ...e, status, bulkOrderDetails }
                                : e
                        )
                    );
                    message.success('Bulk order status updated');
                } else {
                    message.error(res.message || 'Failed to update bulk order status');
                }
                return res;
            } catch (err) {
                message.error('Failed to update bulk order status: ' + err.message);
                return { success: false, message: err.message };
            } finally {
                setUpdateLoading(false);
            }
        },
        []
    );

    return {
        enquiries,
        loading,
        updateLoading,
        fetchEnquiries,
        changeBulkOrderStatus,
        fetchingMore,
        nextCursor,
        hasMore,
    };
}