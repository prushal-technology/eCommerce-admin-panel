import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, InputNumber, Row, Select, Table } from 'antd';
import { useMemo } from 'react';

const { Option } = Select;

const formatCurrency = (amount) => `₹${(amount || 0).toFixed(2)}`;

const resolveProductImage = (product) => {
    const valid = product?.images?.find((img) => img.image?.trim());
    if (!valid) return null;
    return valid.image.startsWith('data:')
        ? valid.image
        : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${valid.image}`;
};

const ProductOption = ({ product }) => {

    const src = resolveProductImage(product);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <div
                style={{
                    width: 40, height: 40, borderRadius: 8, overflow: 'hidden',
                    backgroundColor: '#f5f5f5', border: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                {src
                    ? <img src={src} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 18, color: '#999' }}>📦</span>
                }
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Stock: {product.systemStock?.availableQuantity ?? 0}</div>
            </div>
        </div>
    );
};

/**
 * Editable table of order line items.
 * Columns adapt based on `orderType` (normal / bulk / custom).
 */
const OrderItemsTable = ({
    orderItems,
    orderType,
    productOptions,
    productListLoading,
    onItemChange,
    onAddItem,
    onRemoveItem,
    onProductSearch,
    onProductPopupScroll,
}) => {
    const columns = useMemo(() => {
        const base = [
            {
                title: 'Product',
                dataIndex: 'productId',
                key: 'productId',
                render: (productId, record) => (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select product"
                        value={productId}
                        onChange={(value) => onItemChange(record.id, 'productId', value)}
                        showSearch
                        optionLabelProp="label"
                        filterOption={false}
                        onSearch={onProductSearch}
                        onPopupScroll={onProductPopupScroll}
                        notFoundContent={productListLoading ? <span>Loading...</span> : null}
                        popupRender={(menu) => (
                            <>
                                {menu}
                                {productListLoading && (
                                    <div style={{ textAlign: 'center', padding: 8, color: '#999' }}>Loading more...</div>
                                )}
                            </>
                        )}
                    >
                        {productOptions.filter((p) => p.isActive).map((product) => (
                            <Option key={product.id} value={product.id} label={product.name}>
                                <ProductOption product={product} />
                            </Option>
                        ))}
                    </Select>
                ),
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (price, record) => {
                    const actual = parseFloat(price || 0);
                    const discount = parseFloat(record.discountPrice || 0);
                    const display = discount > 0 && discount < actual ? discount : actual;
                    const hasDiscount = discount > 0 && discount < actual;
                    return hasDiscount ? (
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{formatCurrency(display)}</div>
                            <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>{formatCurrency(actual)}</div>
                        </div>
                    ) : (
                        <span>{formatCurrency(display)}</span>
                    );
                },
            },
        ];

        if (orderType === 'custom') {
            base.push({
                title: 'Custom Price',
                dataIndex: 'customPrice',
                key: 'customPrice',
                render: (customPrice, record) => (
                    <InputNumber
                        min={0}
                        value={customPrice}
                        onChange={(value) => onItemChange(record.id, 'customPrice', value)}
                        style={{ width: 120 }}
                        formatter={(v) => (v ? `₹${v}` : '')}
                        parser={(v) => v.replace(/[^0-9.]/g, '')}
                    />
                ),
            });
        } else if (orderType === 'bulk') {
            base.push({
                title: 'Bulk Price',
                dataIndex: 'bulkOrderPrice',
                key: 'bulkOrderPrice',
                render: (val) => {
                    const v = parseFloat(val || 0);
                    return v > 0
                        ? <span style={{ fontWeight: 600, color: '#722ed1' }}>{formatCurrency(v)}</span>
                        : <span style={{ color: '#999' }}>No Bulk Price</span>;
                },
            });
        }

        base.push(
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (quantity, record) => (
                    <InputNumber
                        min={1}
                        max={orderType === 'bulk' ? 99999 : 99}
                        value={quantity}
                        onChange={(value) => onItemChange(record.id, 'quantity', value)}
                        style={{ width: 80 }}
                    />
                ),
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                render: (total) => <span style={{ fontWeight: 'bold' }}>{formatCurrency(total)}</span>,
            },
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                    <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => onRemoveItem(record.id)}
                        size="small"
                    />
                ),
            }
        );

        return base;
    }, [orderType, productOptions, productListLoading, onItemChange, onProductSearch, onProductPopupScroll]);

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16, alignItems: 'center' }}>
                <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={onAddItem}>
                        Add Item
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={orderItems}
                pagination={false}
                size="small"
                rowKey="id"
            />
        </>
    );
};

export default OrderItemsTable;