import { Button, Card, Col, Input, Modal, Row, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const OrderDetailsModal = ({
  open,
  order,
  onCancel,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  onStatusUpdate,
  statusUpdateLoading = false,
  canUpdateStatus = false,
}) => {
  const renderOrderImage = (item) => {
    const validImage = item.product?.images && item.product.images.length > 0
      ? item.product.images.find(img => img.image && img.image.trim() !== '')
      : null;

    if (!validImage) {
      return (
        <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
        </div>
      );
    }

    const imageSrc = validImage.image.startsWith('data:')
      ? validImage.image
      : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;

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
      title={`Order Details - ${order?.id}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {order && (
        <div>
          <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Name:</strong> {order.customer?.firstName} {order.customer?.lastName}</p>
                <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Shipping Address:</strong></p>
                <p style={{ color: '#666', fontSize: 13 }}>
                  {order.shippingAddress || 'N/A'}
                </p>
              </Col>
            </Row>
          </Card>

          <Card title="Order Summary" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Date:</strong> {dayjs(order.createdAt).format('MMMM D, YYYY h:mm A')}</p>
              </Col>
              <Col span={12}>
                <p><strong>Total Amount:</strong> ₹{parseFloat(order.totalAmount || 0).toFixed(2)}</p>
                {canUpdateStatus && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <strong>Status:</strong>
                      <Select
                        value={newStatus}
                        onChange={setNewStatus}
                        style={{ width: 130 }}
                        size="small"
                      >
                        <Option value="pending">Pending</Option>
                        <Option value="confirmed">Confirmed</Option>
                        <Option value="dispatched">Dispatched</Option>
                        <Option value="delivered">Delivered</Option>
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
                        loading={statusUpdateLoading}
                      >
                        Update Status
                      </Button>

                    </div>
                  </>
                )}
              </Col>
            </Row>
          </Card>

          <Card title="Order Items" size="small" style={{ marginBottom: 16 }}>
            <div>
              {order.items?.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {renderOrderImage(item)}
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.product?.name || 'Unknown Product'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        Qty: {item.quantity}
                        {item.product?.measureValue && item.product?.unit && ` (${item.product.measureValue} ${item.product.unit})`}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: '2px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              <span>Total Amount:</span>
              <span>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
