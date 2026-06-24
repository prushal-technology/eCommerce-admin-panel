import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import useBulkOrders from '../../hooks/useBulkOrders';
import usePermissions from '../../hooks/usePermissions';
import ManualOrderModal from './components/ManualOrderModal';
import SystemOrdersFilters from './components/SystemOrdersFilters';
import SystemOrdersStats from './components/SystemOrdersStats';
import SystemOrdersTable from './components/SystemOrdersTable';

const BulkOrders = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  //const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const [manualOrderVisible, setManualOrderVisible] = useState(false);
  const { canUpdate } = usePermissions()
  const canManageOrders = canUpdate('order', 'bulk');

  const { orders, loading, fetchOrders, fetchMoreOrders, hasMore, updateOrder, ordersStats } = useBulkOrders();
  const [tableScrollLoading, setTableScrollLoading] = useState(false);
  // const tableWrapperRef = useRef(null);
  const fetchingRef = useRef(false);
  const { Title } = Typography;



  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders(searchText || null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchOrders, searchText]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
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
          Bulk Orders Management
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
            Take Bulk Order
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

      {/* TABLE */}

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
          // ref={tableWrapperRef}
          style={{
            flex: 1,
            minHeight: 0
          }}
        >
          <SystemOrdersTable
            loading={loading}
            orders={filteredOrders}
            hasMore={hasMore}
            tableScrollLoading={tableScrollLoading}
            onViewDetails={handleViewDetails}
            //onTrackOrder={handleTrackOrder}
            onLoadMore={async () => {
              if (
                loading ||
                tableScrollLoading ||
                fetchingRef.current ||
                !hasMore
              ) {
                return;
              }

              fetchingRef.current = true;
              setTableScrollLoading(true);

              try {
                await fetchMoreOrders();
              } finally {
                fetchingRef.current = false;
                setTableScrollLoading(false);
              }
            }}
          />

          {hasMore && tableScrollLoading && (
            <div
              style={{
                textAlign: 'center',
                padding: 12,
              }}
            >
              Loading more orders...
            </div>
          )}

        </div>
      </Card>

      {/* DETAILS MODAL */}

      <OrderDetailsModal
        open={detailModalVisible}
        order={selectedOrder}
        onCancel={() =>
          setDetailModalVisible(false)
        }
        newStatus={newStatus}
        //setNewStatus={setNewStatus}
        statusNote={statusNote}
      //setStatusNote={setStatusNote}
      //onStatusUpdate={handleStatusUpdate}
      //canUpdateStatus={canManageOrders}
      />

      {/* TRACKING MODAL */}

      {/* <OrderTrackingModal
        open={trackingModalVisible}
        order={selectedOrder}
        trackingLoading={trackingLoading}
        trackingData={trackingData}
        onCancel={() =>
          setTrackingModalVisible(false)
        }
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        onStatusUpdate={
          handleStatusUpdate
        }
        statusUpdateLoading={loading}
        canUpdateStatus={canManageOrders}
      /> */}

      {/* MANUAL ORDER MODAL */}
      {canManageOrders && (

        <ManualOrderModal
          visible={manualOrderVisible}
          onClose={() =>
            setManualOrderVisible(false)
          }
          defaultOrderType="bulk"
          onOrderCreated={() => {

            setManualOrderVisible(false);

            fetchOrders(
              searchText || null
            );
          }}
        />
      )}

    </div>

  );


};

export default BulkOrders;
