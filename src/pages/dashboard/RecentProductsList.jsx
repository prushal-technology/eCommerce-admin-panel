import { Card, Skeleton, Tag, Typography } from 'antd';
import { formatCurrency } from './dashboardUtils';

const { Text } = Typography;

const SkeletonProductRow = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f0f0f0',
            gap: 12,
        }}
    >
        <div style={{ flex: 1 }}>
            <Skeleton.Input
                active size="small"
                style={{ width: '70%', minWidth: 100, maxWidth: 180, height: 20, borderRadius: 6, marginBottom: 8 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton.Input active size="small" style={{ width: 40, height: 16, borderRadius: 6 }} />
                <Skeleton.Button active size="small" style={{ width: 80, height: 22, borderRadius: 20 }} />
            </div>
        </div>
        <Skeleton.Input active size="small" style={{ width: 70, height: 20, borderRadius: 6 }} />
    </div>
);

/**
 * Scrollable list of the most recently added products.
 */
const RecentProductsList = ({ products, loading }) => (
    <Card title="Recently Added Products" style={{ height: '100%' }}>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {loading ? (
                Array.from({ length: 5 }, (_, i) => <SkeletonProductRow key={i} />)
            ) : (
                <>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            <div>
                                <div className="fw-bold" style={{ fontSize: 13 }}>
                                    {product.name}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 6,
                                        flexWrap: 'wrap',
                                        marginTop: 4,
                                    }}
                                >
                                    <Tag
                                        color={
                                            (product.storefrontStock?.quantity || 0) === 0
                                                ? 'red'
                                                : (product.storefrontStock?.quantity || 0) < 10
                                                    ? 'orange'
                                                    : 'green'
                                        }
                                        style={{ fontSize: 11 }}
                                    >
                                        Storefront Stock: {product.storefrontStock?.quantity || 0}
                                    </Tag>

                                    <Tag
                                        color={
                                            (product.systemStock?.quantity || 0) === 0
                                                ? 'red'
                                                : (product.systemStock?.quantity || 0) < 10
                                                    ? 'orange'
                                                    : 'green'
                                        }
                                        style={{ fontSize: 11 }}
                                    >
                                        System Stock: {product.systemStock?.quantity || 0}
                                    </Tag>
                                </div>

                            </div>
                            <div className="fw-bold" style={{ color: '#1890ff', fontSize: 13 }}>
                                {formatCurrency(product.price)}
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <Text className="text-muted">No products yet.</Text>
                    )}
                </>
            )}
        </div>
    </Card>
);

export default RecentProductsList;