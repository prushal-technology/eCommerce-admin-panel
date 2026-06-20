import { Card, Skeleton, Table, Tag } from 'antd';
import { getStatusColor, SKELETON_ROWS } from './dashboardUtils';

const getImageUrl = (image) => {
    if (!image) return null;

    const base =
        import.meta.env.VITE_GRAPHQL_URI
            ?.replace('/graphql/', '')
            .replace('/graphql', '');

    return `${base}/media/${image}`;
};

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width: 140,

        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input
                    active
                    size="small"
                    style={{
                        width: 100,
                        height: 20,
                    }}
                />
            ) : (
                <span
                    style={{
                        fontWeight: 600,
                    }}
                >
                    {val}
                </span>
            ),
    },

    {
        title: 'Products',
        key: 'products',
        width: 320,

        render: (_, record) => {
            if (record.isSkeleton) {
                return (
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Skeleton.Image
                            active
                            style={{
                                width: 50,
                                height: 50,
                            }}
                        />

                        <div>
                            <Skeleton.Input
                                active
                                size="small"
                                style={{
                                    width: 140,
                                    marginBottom: 8,
                                }}
                            />

                            <Skeleton.Input
                                active
                                size="small"
                                style={{
                                    width: 60,
                                }}
                            />
                        </div>
                    </div>
                );
            }

            const firstItem = record.items?.[0];

            const product = firstItem?.product;

            const image =
                product?.images?.[0]?.image;

            const imageUrl =
                getImageUrl(image);

            return (
                <div
                    style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                    }}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product?.name}
                            style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 6,
                                border:
                                    '1px solid #f0f0f0',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 50,
                                height: 50,
                                background: '#f5f5f5',
                                borderRadius: 6,
                            }}
                        />
                    )}

                    <div>
                        <div
                            style={{
                                fontWeight: 500,
                                fontSize: 14,
                            }}
                        >
                            {product?.name || 'N/A'}
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Qty: {firstItem?.quantity || 0}
                        </div>
                    </div>
                </div>
            );
        },
    },

    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        width: 180,

        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 120 }}
                />
            ) : (
                val || '-'
            ),
    },

    {
        title: 'Order Type',
        dataIndex: 'orderType',
        key: 'orderType',
        width: 120,

        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Button
                    active
                    size="small"
                    style={{
                        width: 80,
                        borderRadius: 20,
                    }}
                />
            ) : (
                <Tag
                    color={
                        val === 'BULK'
                            ? 'purple'
                            : 'blue'
                    }
                >
                    {val}
                </Tag>
            ),
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,

        render: (status, record) =>
            record.isSkeleton ? (
                <Skeleton.Button
                    active
                    size="small"
                    style={{
                        width: 80,
                        borderRadius: 20,
                    }}
                />
            ) : (
                <Tag color={getStatusColor(status)}>
                    {(status || '').toUpperCase()}
                </Tag>
            ),
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 100, height: 20, borderRadius: 6 }} />
            ) : val ? (
                new Date(val).toLocaleDateString('en-IN')
            ) : (
                '—'
            ),
    },
];

/**
 * Table displaying the most recent orders.
 */
const RecentOrdersTable = ({ orders, loading }) => (
    <Card title="Recent Orders">
        <Table
            rowKey="id"
            dataSource={loading ? SKELETON_ROWS : orders}
            columns={columns}
            pagination={false}
            size="small"
            locale={{ emptyText: 'No recent orders' }}
        />
    </Card>
);

export default RecentOrdersTable;