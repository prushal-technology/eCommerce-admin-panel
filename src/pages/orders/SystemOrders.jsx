import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
import useOrders from '../../hooks/useOrders';
import usePermissions from '../../hooks/usePermissions';
import ManualOrderModal from './components/ManualOrderModal';
import SystemOrdersFilters from './components/SystemOrdersFilters';
import SystemOrdersStats from './components/SystemOrdersStats';
import SystemOrdersTable from './components/SystemOrdersTable';

const SystemOrders = () => {
  const { canUpdate } = usePermissions();
  const canManageOrders = canUpdate('order');
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

  const { orders, loading, fetchOrders, fetchMoreOrders, ordersHasMore, changeOrderStatus, ordersStats } = useOrders();
  const [tableScrollLoading, setTableScrollLoading] = useState(false);
  const tableWrapperRef = useRef(null);
  const { Title } = Typography;


  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders('admin_panel', searchText || null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchOrders, searchText]);

  useEffect(() => {
    const tableBody =
      tableWrapperRef.current?.querySelector(
        '.ant-table-body'
      );

    if (!tableBody) return;

    const handleScroll = (event) => {
      const target = event.target;

      if (
        loading ||
        tableScrollLoading ||
        !ordersHasMore
      ) {
        return;
      }

      if (
        target.scrollTop +
        target.clientHeight >=
        target.scrollHeight - 80
      ) {
        setTableScrollLoading(true);

        fetchMoreOrders()
          .finally(() =>
            setTableScrollLoading(false)
          );
      }
    };

    tableBody.addEventListener(
      'scroll',
      handleScroll
    );

    return () => {
      tableBody.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, [
    loading,
    tableScrollLoading,
    ordersHasMore,
    fetchMoreOrders
  ]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
  };

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    // SET CURRENT STATUS
    setNewStatus(order.status || 'pending');

    // RESET NOTE
    setStatusNote('');
    setTrackingModalVisible(true);
    setTrackingLoading(true);
    try {
      const { getOrderTracking } = await import('../../api/orders');
      const res = await getOrderTracking(order.id);
      setTrackingData(res.success ? res.tracking || [] : []);
    } catch {
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!canManageOrders) return false;

    if (!selectedOrder) return false;
    try {
      const res = await changeOrderStatus(
        selectedOrder.id,
        newStatus,
        statusNote
      );
      if (res.success) {
        fetchOrders('admin_panel');
        setDetailModalVisible(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
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

  return (

    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* PAGE HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >

        <Title
          level={4}
          style={{ margin: 0 }}
        >
          System Orders Management
        </Title>

        {canManageOrders && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setManualOrderVisible(true)
            }
            size="small"
          >
            Take Order
          </Button>
        )}

      </div>

      {/* STATS */}

      <SystemOrdersStats
        stats={ordersStats}
        loading={loading}
      />

      {/* FILTERS */}

      <SystemOrdersFilters
        searchText={searchText}
        statusFilter={statusFilter}
        dateRange={dateRange}
        onSearch={setSearchText}
        onStatusChange={setStatusFilter}
        onDateChange={setDateRange}
      />


      <Card
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
        bodyStyle={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          padding: 0,
        }}
      >
        <div
          ref={tableWrapperRef}

          style={{
            flex: 1,
            minHeight: 0,
            padding: 16,
          }}
        >
          <SystemOrdersTable
            loading={loading}
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            hasMore={ordersHasMore}

            onTrackOrder={handleTrackOrder}
          />

          {ordersHasMore && tableScrollLoading && (
            <div style={{ textAlign: 'center', padding: 12 }}>
              Loading more orders...
            </div>
          )}
          {/* {!ordersHasMore &&
            filteredOrders.length > 0 &&
            !loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: 12,
                  color: "#999",
                  fontSize: 13,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                No more orders to load
              </div>
            )} */}
        </div>
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
        canUpdateStatus={canManageOrders}
      />

      <OrderTrackingModal
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
        canUpdateStatus={canManageOrders}
      />

      {canManageOrders && (
        <ManualOrderModal
          visible={manualOrderVisible}
          onClose={() => setManualOrderVisible(false)}
          onOrderCreated={() => {
            setManualOrderVisible(false);
            fetchOrders('admin_panel');
          }}
        />
      )}
    </div>
  );
};

export default SystemOrders;
