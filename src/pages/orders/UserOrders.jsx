import {
  EyeOutlined,
  TruckOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  message,
  Space,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
import useOrders from '../../hooks/useOrders';
import SystemOrdersFilters from './components/SystemOrdersFilters';
import SystemOrdersStats from './components/SystemOrdersStats';
import SystemOrdersTable from './components/SystemOrdersTable';

const UserOrders = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Order detail modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Tracking modal states
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);

  const { orders, loading, fetchOrders, changeOrderStatus } = useOrders();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders('storefront', searchText || null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchOrders, searchText]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    const res = await changeOrderStatus(selectedOrder.id, newStatus, statusNote);
    if (res.success) {
      fetchOrders('storefront');
      setDetailModalVisible(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      dispatched: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
  };

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setTrackingModalVisible(true);
    setTrackingLoading(true);
    try {
      const { getOrderTracking } = await import('../../api/orders');
      const res = await getOrderTracking(order.id);
      if (res.success) setTrackingData(res.tracking || []);
      else setTrackingData([]);
    } catch (error) {
      message.error('Failed to fetch tracking: ' + error.message);
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const orderDate = dayjs(order.createdAt);
      matchesDate = orderDate.isAfter(dateRange[0].startOf('day')) &&
        orderDate.isBefore(dateRange[1].endOf('day'));
    }
    return matchesStatus && matchesDate;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'dispatched').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.finalAmount || 0), 0),
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber) => <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>,
    },
    {
      title: 'Products',
      dataIndex: 'items',
      key: 'products',
      render: (items) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items?.map((item, index) => {
            const product = item.product;
            const validImage = product?.images && product.images.length > 0
              ? product.images.find(img => img.image && img.image.trim() !== '')
              : null;
            const imageSrc = validImage
              ? (validImage.image.startsWith('data:')
                ? validImage.image
                : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`)
              : null;

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
                    <span style={{ fontSize: '10px', color: '#999' }}>No Img</span>
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
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <span style={{ fontWeight: 'bold' }}>₹{parseFloat(amount || 0).toFixed(2)}</span>,
      sorter: (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customerName',
      render: (customer) => (
        <span style={{ fontWeight: 500 }}>
          {customer?.firstName} {customer?.lastName}
        </span>
      ),
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
      {/* Order Statistics */}
      <SystemOrdersStats stats={orderStats} loading={loading}/>

      <Card
        title="User Orders (Storefront)"
      >
      
        <SystemOrdersFilters
          searchText={searchText}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onSearch={setSearchText}
          onStatusChange={setStatusFilter}
          onDateChange={setDateRange}
        />

        <SystemOrdersTable
          loading={loading}
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onTrackOrder={handleTrackOrder}
        />
      </Card>

      <OrderDetailsModal
        open={detailModalVisible}
        order={selectedOrder}
        onCancel={() => setDetailModalVisible(false)}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        onStatusUpdate={handleStatusUpdate}
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

export default UserOrders;
