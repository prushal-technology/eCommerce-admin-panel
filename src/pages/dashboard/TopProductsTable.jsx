import { Card, Skeleton, Table, Tag } from 'antd';
import { formatCurrency, SKELETON_ROWS } from './dashboardUtils';

const columns = [
    {
        title: 'Product',
        dataIndex: 'name',
        key: 'name',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 140, height: 20, borderRadius: 6 }} />
            ) : (
                <span className="fw-bold">{val}</span>
            ),
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 90, height: 20, borderRadius: 6 }} />
            ) : (
                formatCurrency(val)
            ),
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        render: (qty, record) =>
            record.isSkeleton ? (
                <Skeleton.Button active size="small" style={{ width: 85, height: 24, borderRadius: 20 }} />
            ) : (
                <Tag color={qty === 0 ? 'red' : qty < 10 ? 'orange' : 'green'}>
                    {qty} units
                </Tag>
            ),
    },
    {
        title: 'Sold',
        dataIndex: 'totalSold',
        key: 'totalSold',
        render: (val, record) =>
            record.isSkeleton ? (
                <Skeleton.Input active size="small" style={{ width: 50, height: 20, borderRadius: 6 }} />
            ) : (
                <span>{val}</span>
            ),
    },
];

/**
 * Table listing the top-selling products.
 */
const TopProductsTable = ({ products, loading }) => (
    <Card title="Top Products">
        <Table
            rowKey="id"
            dataSource={loading ? SKELETON_ROWS : products}
            columns={columns}
            pagination={false}
            size="small"
        />
    </Card>
);

export default TopProductsTable;