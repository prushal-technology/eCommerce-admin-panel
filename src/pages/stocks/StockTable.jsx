import { EditOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Input,
    Progress,
    Select,
    Skeleton,
    Space,
    Table,
    Tag,
} from 'antd';
import { useEffect, useRef } from 'react';

const { Search } = Input;
const { Option } = Select;

const SKELETON_ROWS = Array.from({ length: 6 }, (_, i) => ({
    id: `skeleton-${i}`,
    isSkeleton: true,
}));

/**
 * Returns the base URL used to resolve product image paths.
 */
const resolveImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image;
    const base =
        import.meta.env.VITE_GRAPHQL_URI
            ?.replace('/graphql/', '')
            .replace('/graphql', '') || '';
    return `${base}/media/${image}`;
};

// ── Sub-renderers ────────────────────────────────────────────────────────────

const ProductCell = ({ record }) => {
    if (record.isSkeleton) {
        return (
            <Space align="start">
                <Skeleton.Image active style={{ width: 60, height: 60, borderRadius: 8 }} />
                <div>
                    <Skeleton.Input active size="small" style={{ width: 140, height: 18, borderRadius: 6, marginBottom: 8 }} />
                    <Skeleton.Button active size="small" style={{ width: 80, height: 22, borderRadius: 20 }} />
                </div>
            </Space>
        );
    }

    const validImage = record.images?.find((img) => img.image?.trim());
    const src = validImage ? resolveImageUrl(validImage.image) : null;

    return (
        <Space align="start">
            {src ? (
                <img
                    src={src}
                    alt={record.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                />
            ) : (
                <div
                    style={{
                        width: 60, height: 60, borderRadius: 8, backgroundColor: '#f5f5f5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#999', fontSize: 12, border: '1px solid #f0f0f0',
                    }}
                >
                    No Image
                </div>
            )}
            <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{record.name || 'Unknown Product'}</div>
                {record.isFeatured && (
                    <Tag color="orange" style={{ fontSize: 10, marginTop: 4 }}>FEATURED</Tag>
                )}
            </div>
        </Space>
    );
};

const StockLevelCell = ({ record, getStockQuantity, getStockPercentage }) => {
    if (record.isSkeleton) {
        return (
            <div>
                <Skeleton.Input active size="small" style={{ width: 80, height: 18, borderRadius: 6, marginBottom: 10 }} />
                <Skeleton.Input active size="small" style={{ width: '100%', height: 8, borderRadius: 20 }} />
            </div>
        );
    }

    const stock = getStockQuantity(record);
    return (
        <div>
            <div style={{ fontWeight: 500, fontSize: 12, color: '#1890ff', marginBottom: 4 }}>
                {stock} {record.unit || ''}
            </div>
            <Progress
                percent={getStockPercentage(record)}
                size="small"
                status={stock === 0 ? 'exception' : stock <= 5 ? 'active' : 'normal'}
                showInfo={false}
            />
        </div>
    );
};

// ── Main component ───────────────────────────────────────────────────────────

/**
 * Scrollable stock table with:
 * - Skeleton loading rows
 * - Infinite scroll (fires onLoadMore when the table body nears the bottom)
 * - Search + filter toolbar
 * - Per-row edit button
 */
const StockTable = ({
    items,
    loading,
    fetchingMore,
    hasMore,
    searchText,
    stockFilter,
    onSearchChange,
    onFilterChange,
    onEditStock,
    onLoadMore,
    getStockQuantity,
    getStockStatus,
    getStockPercentage,
}) => {
    const tableContainerRef = useRef(null);

    // Infinite scroll via the Ant Design table body element
    useEffect(() => {
        const tableBody = tableContainerRef.current?.querySelector('.ant-table-body');
        if (!tableBody) return;

        const handleScroll = ({ target }) => {
            const { scrollTop, scrollHeight, clientHeight } = target;
            if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading && !fetchingMore) {
                onLoadMore();
            }
        };

        tableBody.addEventListener('scroll', handleScroll);
        return () => tableBody.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading, fetchingMore, onLoadMore]);

    const columns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
                <ProductCell record={record} />
            ),
        },
        {
            title: 'Current Stock (/100)',
            key: 'stockLevel',
            width: 200,
            render: (_, record) => (
                <StockLevelCell
                    record={record}
                    getStockQuantity={getStockQuantity}
                    getStockPercentage={getStockPercentage}
                />
            ),
        },
        {
            title: 'Reserved',
            key: 'reservedQuantity',
            width: 100,
            render: (_, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 50, height: 18, borderRadius: 6 }} />
                ) : (
                    <div className="text-muted">{record.stock?.reservedQuantity || 0}</div>
                ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            render: (_, record) => {
                if (record.isSkeleton) {
                    return (
                        <Skeleton.Button active size="small" style={{ width: 90, height: 24, borderRadius: 20 }} />
                    );
                }
                const { color, text } = getStockStatus(record);
                return <Tag color={color} className="tag-compact">{text}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) =>
                record.isSkeleton ? (
                    <Skeleton.Button active size="small" shape="circle" />
                ) : (
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEditStock(record, 'add')}
                    />
                ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {/* Toolbar */}
                <Space>
                    <Search
                        size="small"
                        className="small-search"
                        placeholder="Search products..."
                        allowClear
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Select
                        size="small"
                        value={stockFilter}
                        onChange={onFilterChange}
                        defaultValue="all"
                    >
                        <Option value="all">All Products</Option>
                        <Option value="low">Low Stock (≤15)</Option>
                        <Option value="critical">Critical (≤5)</Option>
                        <Option value="out">Out of Stock</Option>
                    </Select>
                </Space>

                {/* Table */}
                <div ref={tableContainerRef} style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Table
                        columns={columns}
                        dataSource={loading ? SKELETON_ROWS : items}
                        size="small"
                        rowKey="id"
                        scroll={{ x: 'max-content', y: 260 }}
                        pagination={false}
                    />
                </div>

                {/* Fetch-more skeletons */}
                {fetchingMore && (
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {Array.from({ length: 3 }, (_, i) => (
                            <Skeleton.Input
                                key={i}
                                active
                                size="small"
                                style={{ width: '98%', height: 32, borderRadius: 6 }}
                            />
                        ))}
                    </div>
                )}

                {/* End-of-list indicator */}
                {!hasMore && items.length > 0 && !loading && !fetchingMore && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '10px',
                            color: '#999',
                            fontSize: '12px',
                            background: '#fff'
                        }}
                    >
                        No more products to load
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default StockTable;