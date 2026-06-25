import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import useOrders from '../../hooks/useOrders';
import SystemOrdersFilters from './components/SystemOrdersFilters';
import SystemOrdersStats from './components/SystemOrdersStats';
import SystemOrdersTable from './components/SystemOrdersTable';

const { Title } = Typography;

const UserOrders = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Order detail modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Tracking modal
  //const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  //const [trackingLoading, setTrackingLoading] = useState(false);
  //const [trackingData, setTrackingData] = useState([]);

  // Infinite scroll loading indicator (owned here, passed down)
  const [tableScrollLoading, setTableScrollLoading] = useState(false);

  const {
    orders,
    loading,
    fetchOrders,
    fetchMoreOrders,
    ordersHasMore,
    changeOrderStatus,
    ordersStats,
  } = useOrders();

  // ── Debounced search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders('storefront', searchText || null);
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchOrders, searchText]);

  // ── Load more — called by SystemOrdersTable when scroll hits the bottom ───────
  const handleLoadMore = () => {
    if (tableScrollLoading || !ordersHasMore) return Promise.resolve();
    setTableScrollLoading(true);
    return fetchMoreOrders().finally(() => setTableScrollLoading(false));
  };

  // ── Status update ─────────────────────────────────────────────────────────────
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return false;
    try {
      const res = await changeOrderStatus(selectedOrder.id, newStatus, statusNote);
      if (res.success) {
        fetchOrders('storefront');
        setDetailModalVisible(false);
        return true;
      }
      return false;
    } catch (error) {
      //console.error(error);
      return false;
    }
  };

  // ── Modal handlers ────────────────────────────────────────────────────────────
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
  };

  // const handleTrackOrder = async (order) => {
  //   setSelectedOrder(order);
  //   setNewStatus(order.status || 'pending');
  //   setStatusNote('');
  //   setTrackingModalVisible(true);
  //   setTrackingLoading(true);
  //   try {
  //     const { getOrderTracking } = await import('../../api/orders');
  //     const res = await getOrderTracking(order.id);
  //     setTrackingData(res.success ? (res.tracking || []) : []);
  //   } catch (error) {
  //     message.error('Failed to fetch tracking: ' + error.message);
  //     setTrackingData([]);
  //   } finally {
  //     setTrackingLoading(false);
  //   }
  // };

  // ── Client-side filters (status + date range) ─────────────────────────────────
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange?.length === 2) {
      const orderDate = dayjs(order.createdAt);
      matchesDate =
        orderDate.isAfter(dateRange[0].startOf('day')) &&
        orderDate.isBefore(dateRange[1].endOf('day'));
    }
    return matchesStatus && matchesDate;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        User Orders (Storefront) Management
      </Title>

      <SystemOrdersStats stats={ordersStats} loading={loading} />

      <SystemOrdersFilters
        searchText={searchText}
        statusFilter={statusFilter}
        dateRange={dateRange}
        onSearch={setSearchText}
        onStatusChange={setStatusFilter}
        onDateChange={setDateRange}
      />

      <div style={{ flex: 1, minHeight: 0 }}>
        <SystemOrdersTable
          loading={loading}
          orders={filteredOrders}
          hasMore={ordersHasMore}
          tableScrollLoading={tableScrollLoading}
          onViewDetails={handleViewDetails}
          //onTrackOrder={handleTrackOrder}
          onLoadMore={handleLoadMore}
        />
      </div>

      <OrderDetailsModal
        open={detailModalVisible}
        order={selectedOrder}
        onCancel={() => setDetailModalVisible(false)}
        //newStatus={newStatus}
        //setNewStatus={setNewStatus}
        statusNote={statusNote}
      //setStatusNote={setStatusNote}
      //onStatusUpdate={handleStatusUpdate}
      />

      {/* <OrderTrackingModal
        open={trackingModalVisible}
        order={selectedOrder}
        trackingLoading={trackingLoading}
        trackingData={trackingData}
        onCancel={() => setTrackingModalVisible(false)}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        onStatusUpdate={handleStatusUpdate}
        statusUpdateLoading={loading}
      /> */}
    </div>
  );
};

export default UserOrders;