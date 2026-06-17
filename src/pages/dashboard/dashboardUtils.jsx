import { Skeleton } from 'antd';

/** Formats a number as Indian-locale currency string (e.g. ₹1,23,456.00) */
export const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

/** Maps an order status string to its Ant Design Tag color. */
export const getStatusColor = (status) => {
    const colors = {
        completed: 'green',
        pending: 'orange',
        confirmed: 'blue',
        cancelled: 'red',
        shipped: 'cyan',
    };
    return colors[(status || '').toLowerCase()] || 'default';
};

/** Reusable skeleton formatter for <Statistic> — shows a skeleton pill while loading. */
export const makeSkeletonFormatter = (loading) => (value) =>
    loading ? (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Skeleton.Input
                active
                size="small"
                style={{ width: '60%', minWidth: 50, maxWidth: 90, height: 22, borderRadius: 6 }}
            />
        </div>
    ) : (
        value
    );

/** Five skeleton placeholder rows for tables. */
export const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => ({
    id: `skeleton-${i}`,
    isSkeleton: true,
}));