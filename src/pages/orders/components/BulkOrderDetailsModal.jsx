// import { Button, Card, Col, Input, Modal, Row, Select, Tag } from 'antd';

// const { Option } = Select;

// const getStatusColor = (status) => {
//     const colors = {
//         pending: 'orange',
//         confirmed: 'blue',
//         processing: 'purple',
//         completed: 'green',
//         cancelled: 'red',
//     };
//     return colors[status] || 'default';
// };

// const getProductImage = (product) => {
//     const validImage = product?.images?.find(
//         (img) => img.image && img.image.trim() !== ''
//     );
//     if (!validImage) return null;
//     return validImage.image.startsWith('data:')
//         ? validImage.image
//         : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
// };

// const BulkOrderDetailsModal = ({
//     open,
//     enquiry,
//     onCancel,
//     newStatus,
//     setNewStatus,
//     bulkOrderDetails,
//     setBulkOrderDetails,
//     onStatusUpdate,
//     updateLoading = false,
// }) => {
//     return (
//         <Modal
//             title={`Bulk Order Enquiry #${enquiry?.id}`}
//             open={open}
//             onCancel={onCancel}
//             footer={null}
//             width={780}
//             destroyOnHidden
//         >
//             {enquiry && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//                     {/* ── Customer Info ─────────────────────────────────────────────── */}
//                     <Card title="Customer Information" size="small">
//                         <p style={{ margin: 0 }}>
//                             <strong>Name:</strong>{' '}
//                             {enquiry.placedByUser?.firstName} {enquiry.placedByUser?.lastName}
//                         </p>
//                     </Card>

//                     {/* ── Status Update ─────────────────────────────────────────────── */}
//                     <Card title="Update Enquiry" size="small">
//                         <Row gutter={16}>
//                             <Col span={12}>
//                                 <div style={{ marginBottom: 12 }}>
//                                     <div style={{ marginBottom: 6, fontWeight: 500 }}>
//                                         Current Status:{' '}
//                                         <Tag color={getStatusColor(enquiry.status)}>
//                                             {enquiry.status?.toUpperCase()}
//                                         </Tag>
//                                     </div>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                                         <span style={{ fontWeight: 500 }}>New Status:</span>
//                                         <Select
//                                             value={newStatus}
//                                             onChange={setNewStatus}
//                                             style={{ width: 150 }}
//                                             size="small"
//                                         >
//                                             <Option value="pending">Pending</Option>
//                                             <Option value="confirmed">Confirmed</Option>
//                                             <Option value="processing">Processing</Option>
//                                             <Option value="completed">Completed</Option>
//                                             <Option value="cancelled">Cancelled</Option>
//                                         </Select>
//                                     </div>
//                                 </div>
//                             </Col>
//                             <Col span={12}>
//                                 <div style={{ marginBottom: 6, fontWeight: 500 }}>Bulk Order Details / Notes:</div>
//                                 <Input.TextArea
//                                     size="small"
//                                     placeholder="Add or edit bulk order details / notes..."
//                                     value={bulkOrderDetails}
//                                     onChange={(e) => setBulkOrderDetails(e.target.value)}
//                                     rows={3}
//                                 />
//                             </Col>
//                         </Row>
//                         <div style={{ marginTop: 12 }}>
//                             <Button
//                                 type="primary"
//                                 size="small"
//                                 onClick={onStatusUpdate}
//                                 loading={updateLoading}
//                             >
//                                 Update Enquiry
//                             </Button>
//                         </div>
//                     </Card>

//                     {/* ── Ordered Items ─────────────────────────────────────────────── */}
//                     <Card title={`Order Items (${enquiry.items?.length || 0})`} size="small">
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
//                             {enquiry.items?.map((item, index) => {
//                                 const product = item.product;
//                                 const imageSrc = getProductImage(product);
//                                 return (
//                                     <div
//                                         key={item.id || index}
//                                         style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: 12,
//                                             padding: '10px 0',
//                                             borderBottom:
//                                                 index < enquiry.items.length - 1 ? '1px solid #f0f0f0' : 'none',
//                                         }}
//                                     >
//                                         {/* Product image */}
//                                         {imageSrc ? (
//                                             <img
//                                                 src={imageSrc}
//                                                 alt={product?.name}
//                                                 style={{
//                                                     width: 52,
//                                                     height: 52,
//                                                     objectFit: 'cover',
//                                                     borderRadius: 6,
//                                                     border: '1px solid #f0f0f0',
//                                                     flexShrink: 0,
//                                                 }}
//                                                 onError={(e) => { e.target.style.display = 'none'; }}
//                                             />
//                                         ) : (
//                                             <div
//                                                 style={{
//                                                     width: 52,
//                                                     height: 52,
//                                                     backgroundColor: '#f5f5f5',
//                                                     borderRadius: 6,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     border: '1px solid #e0e0e0',
//                                                     flexShrink: 0,
//                                                 }}
//                                             >
//                                                 <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
//                                             </div>
//                                         )}

//                                         {/* Product info */}
//                                         <div style={{ flex: 1 }}>
//                                             <div style={{ fontWeight: 600, fontSize: 14 }}>
//                                                 {product?.name || 'Unknown Product'}
//                                             </div>
//                                             <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
//                                                 {product?.measureValue && product?.unit
//                                                     ? `${product.measureValue} ${product.unit}`
//                                                     : ''}
//                                             </div>
//                                         </div>

//                                         {/* Quantity */}
//                                         <div
//                                             style={{
//                                                 fontWeight: 600,
//                                                 fontSize: 14,
//                                                 color: '#1890ff',
//                                                 minWidth: 70,
//                                                 textAlign: 'right',
//                                             }}
//                                         >
//                                             Qty: {item.quantity}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </Card>

//                 </div>
//             )}
//         </Modal>
//     );
// };

// export default BulkOrderDetailsModal;


import { Button, Card, Col, Input, Modal, Row, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const getProductImage = (product) => {
    const validImage = product?.images?.find(
        (img) => img.image && img.image.trim() !== ''
    );
    if (!validImage) return null;
    return validImage.image.startsWith('data:')
        ? validImage.image
        : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
};

const BulkOrderDetailsModal = ({
    open,
    enquiry,
    onCancel,
    newStatus,
    setNewStatus,
    statusNote,
    setStatusNote,
    onStatusUpdate,
    updateLoading = false,
}) => {
    const renderItemImage = (item) => {
        const imageSrc = getProductImage(item.product);

        if (!imageSrc) {
            return (
                <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
                    <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
                </div>
            );
        }

        return (
            <img
                src={imageSrc}
                alt={item.product?.name || 'Product'}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
                onError={(e) => { e.target.style.display = 'none'; }}
            />
        );
    };

    return (
        <Modal
            title={`Bulk Order Details - #${enquiry?.id}`}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnHidden
        >
            {enquiry && (
                <div>

                    {/* ── Customer Information ───────────────────────────────────── */}
                    <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p>
                                    <strong>Name:</strong>{' '}
                                    {enquiry.placedByUser?.firstName} {enquiry.placedByUser?.lastName}
                                </p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Bulk Order Details:</strong></p>
                                <p style={{ color: '#666', fontSize: 13 }}>
                                    {enquiry.bulkOrderDetails || 'N/A'}
                                </p>
                            </Col>
                        </Row>
                    </Card>

                    {/* ── Status Update ──────────────────────────────────────────── */}
                    <Card title="Order Summary" size="small" style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Enquiry ID:</strong> #{enquiry.id}</p>
                                <p><strong>Date:</strong> {enquiry.createdAt ? dayjs(enquiry.createdAt).format('MMMM D, YYYY h:mm A') : '—'}</p>
                            </Col>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <strong>Status:</strong>
                                    <Select
                                        value={newStatus}
                                        onChange={setNewStatus}
                                        style={{ width: 150 }}
                                        size="small"
                                    >
                                        <Option value="pending">Pending</Option>
                                        <Option value="confirmed">Confirmed</Option>
                                        <Option value="processing">Processing</Option>
                                        <Option value="completed">Completed</Option>
                                        <Option value="cancelled">Cancelled</Option>
                                    </Select>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Input.TextArea
                                        size="small"
                                        placeholder="Add a note (optional)"
                                        value={statusNote}
                                        onChange={(e) => setStatusNote(e.target.value)}
                                        rows={2}
                                    />
                                    <Button
                                        type="primary"
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        onClick={onStatusUpdate}
                                        loading={updateLoading}
                                    >
                                        Update Status
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* ── Order Items ────────────────────────────────────────────── */}
                    <Card title="Order Items" size="small" style={{ marginBottom: 16 }}>
                        <div>
                            {enquiry.items?.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {renderItemImage(item)}
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {item.product?.name || 'Unknown Product'}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                Qty: {item.quantity}
                                                {item.product?.measureValue && item.product?.unit
                                                    ? ` (${item.product.measureValue} ${item.product.unit})`
                                                    : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            )}
        </Modal>
    );
};

export default BulkOrderDetailsModal;