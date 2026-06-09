import { Card, Skeleton, Table, Tag } from 'antd';
import { getStatusColor, SKELETON_ROWS } from './dashboardUtils';

const columns = [
    {
        title: 'Order #',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 90, height: 20, borderRadius: 6 }} />
            ) : (
                <span className="fw-bold">#{val}</span>
            ),
    },
    {
        title: 'Customer',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 120, height: 20, borderRadius: 6 }} />
            ) : (
                val
            ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) =>
            record.isSkeleton ? (
                <Skeleton.Button active size="small" style={{ width: 80, height: 24, borderRadius: 20 }} />
            ) : (
                <Tag color={getStatusColor(status)}>
                    {(status || '—').toUpperCase()}
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