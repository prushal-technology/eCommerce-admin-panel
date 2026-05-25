import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
import useOrders from '../../hooks/useOrders';
import ManualOrderModal from './components/ManualOrderModal';
import SystemOrdersFilters from './components/SystemOrdersFilters';
import SystemOrdersStats from './components/SystemOrdersStats';
import SystemOrdersTable from './components/SystemOrdersTable';

const SystemOrders = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const [manualOrderVisible, setManualOrderVisible] = useState(false);

  const { orders, loading, fetchOrders, changeOrderStatus } = useOrders();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders(null, searchText || null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchOrders, searchText]);

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
      setTrackingData(res.success ? res.tracking || [] : []);
    } catch (error) {
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    try {
      const res = await changeOrderStatus(selectedOrder.id, newStatus, statusNote);
      if (res.success) {
        fetchOrders();
        setDetailModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const orderDate = dayjs(order.createdAt);
      matchesDate = orderDate.isAfter(dateRange[0].startOf('day'))
        && orderDate.isBefore(dateRange[1].endOf('day'));
    }
    return matchesStatus && matchesDate;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    dispatched: orders.filter((o) => o.status === 'dispatched').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.finalAmount || 0), 0),
  };

  return (
    <div>
      <SystemOrdersStats stats={orderStats} />

      <Card
        title="System Orders (Panel)"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setManualOrderVisible(true)} size="small">
              Take Order
            </Button>
          </Space>
        }
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

      <ManualOrderModal
        visible={manualOrderVisible}
        onClose={() => setManualOrderVisible(false)}
        onOrderCreated={() => {
          setManualOrderVisible(false);
          fetchOrders();
        }}
      />
    </div>
  );
};

export default SystemOrders;
