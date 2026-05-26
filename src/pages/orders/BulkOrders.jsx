import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EyeOutlined, PlusOutlined, ShoppingCartOutlined, TruckOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, Modal, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
import useBulkOrders from '../../hooks/useBulkOrders';
import BulkOrderFormModal from './components/BulkOrderModal';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const getProductImage = (product) => {
  const validImage = product?.images?.find(img => img.image && img.image.trim() !== '');
  if (!validImage) return null;
  return validImage.image.startsWith('data:')
    ? validImage.image
    : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
};

const BulkOrders = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Detail / status modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Create modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);

  const {
    bulkOrders,
    products,
    loading,
    loadingProducts,
    fetchBulkOrders,
    fetchProducts,
    createOrder,
    updateOrder,
  } = useBulkOrders();

  useEffect(() => {
    fetchProducts();
    const timer = setTimeout(() => {
      fetchBulkOrders(searchText || null);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchBulkOrders, fetchProducts, searchText]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    setStatusUpdateLoading(true);
    try {
      const res = await updateOrder(selectedOrder.id, newStatus, selectedOrder.bulkOrderDetails);
      if (res.success) {
        fetchBulkOrders(searchText || null);
        setDetailModalVisible(false);
      }
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      dispatched: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const handleCreate = async (payload) => {
    const res = await createOrder(payload.bulkOrderDetails, payload.items);
    if (res.success) {
      setCreateModalVisible(false);
      fetchBulkOrders(searchText || null);
    }
  };

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setTrackingModalVisible(true);
    setTrackingLoading(true);

    try {
      const { getOrderTracking } = await import('../../api/orders');

      const res = await getOrderTracking(order.id);

      setTrackingData(
        res.success ? res.tracking || [] : []
      );
    } catch (error) {
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return bulkOrders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      let matchesDate = true;
      if (dateRange && dateRange.length === 2) {
        const createdAt = dayjs(order.createdAt);
        matchesDate = createdAt.isAfter(dateRange[0].startOf('day')) && createdAt.isBefore(dateRange[1].endOf('day'));
      }
      return matchesStatus && matchesDate;
    });
  }, [bulkOrders, dateRange, statusFilter]);

  const orderStats = useMemo(() => ({
    total: bulkOrders.length,
    pending: bulkOrders.filter((o) => o.status === 'pending').length,
    confirmed: bulkOrders.filter((o) => o.status === 'confirmed').length,
    cancelled: bulkOrders.filter((o) => o.status === 'cancelled').length,
  }), [bulkOrders]);

  const columns = [
    {
      title: 'Bulk Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span style={{ fontWeight: 'bold' }}>{id}</span>,
    },
    {
      title: 'Products',
      dataIndex: 'items',
      key: 'products',
      render: (items) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items?.map((item, index) => {
            const product = item.product;
            const imageSrc = getProductImage(product);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={product?.name}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: 40, height: 40, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
                    <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{product?.name || 'Unknown Product'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity}</div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Details',
      dataIndex: 'bulkOrderDetails',
      key: 'bulkOrderDetails',
      render: (text) => <Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM D, YYYY h:mm A'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Dispatched', value: 'dispatched' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="default"
            size="small"
            icon={<TruckOutlined />}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
            onClick={() => handleTrackOrder(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Enquiries" value={orderStats.total} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending" value={orderStats.pending} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Confirmed" value={orderStats.confirmed} valueStyle={{ color: '#1890ff' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Cancelled" value={orderStats.cancelled} valueStyle={{ color: '#ff4d4f' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card
        title="Bulk Orders"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)} size="small">
              New Bulk Order
            </Button>
          </Space>
        }
      >
        <Space wrap style={{ marginBottom: 16 }}>
          <Search
            size="small"
            placeholder="Search bulk orders..."
            allowClear
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select size="small" value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <RangePicker size="small" value={dateRange} onChange={setDateRange} format="DD-MM-YYYY" />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          size="small"
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} enquiries`,
          }}
        />
      </Card>

      {/* Detail / Status Update Modal */}
      <Modal
        title={`Bulk Order Details — #${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div>
            <Card title="Order Details" size="small" style={{ marginBottom: 16 }}>
              <p><strong>Date:</strong> {dayjs(selectedOrder.createdAt).format('MMMM D, YYYY h:mm A')}</p>
              <p><strong>Details:</strong> {selectedOrder.bulkOrderDetails}</p>
            </Card>

            <Card title="Items" size="small" style={{ marginBottom: 16 }}>
              {selectedOrder.items?.map((item, index) => {
                const imageSrc = getProductImage(item.product);
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    {imageSrc ? (
                      <img src={imageSrc} alt={item.product?.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: 50, height: 50, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
                        <span style={{ fontSize: 10, color: '#999' }}>No Img</span>
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.product?.name || 'Unknown Product'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                );
              })}
            </Card>

            <Card title="Update Status" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <strong>Status:</strong>
                <Select value={newStatus} onChange={setNewStatus} style={{ width: 150 }} size="small">
                  <Option value="pending">Pending</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </div>
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
                onClick={handleStatusUpdate}
                loading={statusUpdateLoading}
              >
                Update Status
              </Button>
            </Card>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <BulkOrderFormModal
        visible={createModalVisible}
        loading={loading || loadingProducts}
        products={products}
        isEdit={false}
        initialValues={null}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreate}
      />
      <OrderTrackingModal
        open={trackingModalVisible}
        order={selectedOrder}
        trackingLoading={trackingLoading}
        trackingData={trackingData}
        onCancel={() => setTrackingModalVisible(false)}
      />
    </div>
  );
};

export default BulkOrders;
