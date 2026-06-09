// import {
//   EyeOutlined,
//   TruckOutlined
// } from '@ant-design/icons';
// import {
//   Button,
//   message,
//   Space,
//   Tag,
//   Typography
// } from 'antd';
// import dayjs from 'dayjs';
// import { useEffect, useRef, useState } from 'react';
// import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
// import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
// import useOrders from '../../hooks/useOrders';
// import SystemOrdersFilters from './components/SystemOrdersFilters';
// import SystemOrdersStats from './components/SystemOrdersStats';
// import SystemOrdersTable from './components/SystemOrdersTable';

// const UserOrders = () => {
//   const [searchText, setSearchText] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateRange, setDateRange] = useState(null);

//   // Order detail modal states
//   const [detailModalVisible, setDetailModalVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusNote, setStatusNote] = useState('');

//   // Tracking modal states
//   const [trackingModalVisible, setTrackingModalVisible] = useState(false);
//   const [trackingLoading, setTrackingLoading] = useState(false);
//   const [trackingData, setTrackingData] = useState([]);

//   const { orders, loading, fetchOrders, fetchingMore, fetchMoreOrders, ordersHasMore, changeOrderStatus, ordersStats } = useOrders();
//   //const [fetchingMore, setfetchingMore] = useState(false);

//   const tableWrapperRef = useRef(null);
//   const fetchingRef = useRef(false);
//   const [tableScrollLoading, setTableScrollLoading] = useState(false);
//   const { Title } = Typography;

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       fetchOrders('storefront', searchText || null);
//     }, 300);
//     return () => clearTimeout(timeout);
//   }, [fetchOrders, searchText]);

//   useEffect(() => {

//     const timeout = setTimeout(() => {

//       const tableBody =
//         tableWrapperRef.current?.querySelector(
//           '.ant-table-body'
//         );

//       if (!tableBody) return;

//       const handleScroll = (event) => {

//         const target = event.target;

//         if (
//           loading ||
//           tableScrollLoading ||
//           fetchingRef.current ||
//           !ordersHasMore
//         ) {
//           return;
//         }

//         if (
//           target.scrollTop +
//           target.clientHeight >=
//           target.scrollHeight - 80
//         ) {
//           fetchingRef.current = true;

//           setTableScrollLoading(true);
//           fetchMoreOrders()
//             .finally(() => {

//               fetchingRef.current = false;

//               setTableScrollLoading(false);
//             });
//         }
//       };

//       tableBody.addEventListener(
//         'scroll',
//         handleScroll
//       );

//       return () => {
//         tableBody.removeEventListener(
//           'scroll',
//           handleScroll
//         );
//       };

//     }, 200);

//     return () => clearTimeout(timeout);

//   }, [
//     loading,
//     fetchingMore,
//     ordersHasMore,
//     fetchMoreOrders,
//     orders
//   ]);

//   const handleStatusUpdate = async () => {
//     if (!selectedOrder) return false;
//     try {
//       const res = await changeOrderStatus(
//         selectedOrder.id,
//         newStatus,
//         statusNote
//       );

//       if (res.success) {
//         fetchOrders('storefront');
//         setDetailModalVisible(false);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'orange',
//       processing: 'blue',
//       dispatched: 'purple',
//       delivered: 'green',
//       cancelled: 'red',
//     };
//     return colors[status] || 'default';
//   };

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setNewStatus(order.status);
//     setStatusNote('');
//     setDetailModalVisible(true);
//   };

//   const handleTrackOrder = async (order) => {
//     setSelectedOrder(order);
//     // SET CURRENT STATUS
//     setNewStatus(order.status || 'pending');

//     // RESET NOTE
//     setStatusNote('');
//     setTrackingModalVisible(true);
//     setTrackingLoading(true);
//     try {
//       const { getOrderTracking } = await import('../../api/orders');
//       const res = await getOrderTracking(order.id);
//       if (res.success) setTrackingData(res.tracking || []);
//       else setTrackingData([]);
//     } catch (error) {
//       message.error('Failed to fetch tracking: ' + error.message);
//       setTrackingData([]);
//     } finally {
//       setTrackingLoading(false);
//     }
//   };



//   const filteredOrders = orders.filter(order => {
//     const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
//     let matchesDate = true;
//     if (dateRange && dateRange.length === 2) {
//       const orderDate = dayjs(order.createdAt);
//       matchesDate = orderDate.isAfter(dateRange[0].startOf('day')) &&
//         orderDate.isBefore(dateRange[1].endOf('day'));
//     }
//     return matchesStatus && matchesDate;
//   });



//   const columns = [
//     {
//       title: 'Order ID',
//       dataIndex: 'orderNumber',
//       key: 'orderNumber',
//       render: (orderNumber) => <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>,
//     },
//     {
//       title: 'Products',
//       dataIndex: 'items',
//       key: 'products',
//       render: (items) => (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//           {items?.map((item, index) => {
//             const product = item.product;
//             const validImage = product?.images && product.images.length > 0
//               ? product.images.find(img => img.image && img.image.trim() !== '')
//               : null;
//             const imageSrc = validImage
//               ? (validImage.image.startsWith('data:')
//                 ? validImage.image
//                 : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`)
//               : null;

//             return (
//               <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 {imageSrc ? (
//                   <img
//                     src={imageSrc}
//                     alt={product?.name}
//                     style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 ) : (
//                   <div style={{ width: 40, height: 40, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
//                     <span style={{ fontSize: '10px', color: '#999' }}>No Img</span>
//                   </div>
//                 )}
//                 <div>
//                   <div style={{ fontWeight: 500, fontSize: 13 }}>{product?.name || 'Unknown Product'}</div>
//                   <div style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'totalAmount',
//       key: 'totalAmount',
//       render: (amount) => <span style={{ fontWeight: 'bold' }}>₹{parseFloat(amount || 0).toFixed(2)}</span>,
//       sorter: (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount),
//     },
//     {
//       title: 'Customer Name',
//       dataIndex: 'customer',
//       key: 'customerName',
//       render: (customer) => (
//         <span style={{ fontWeight: 500 }}>
//           {customer?.firstName} {customer?.lastName}
//         </span>
//       ),
//     },
//     {
//       title: 'Date',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date) => dayjs(date).format('MMM D, YYYY h:mm A'),
//       sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={getStatusColor(status)}>
//           {status ? status.toUpperCase() : 'UNKNOWN'}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Pending', value: 'pending' },
//         { text: 'Confirmed', value: 'confirmed' },
//         { text: 'Dispatched', value: 'dispatched' },
//         { text: 'Delivered', value: 'delivered' },
//         { text: 'Cancelled', value: 'cancelled' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="small">
//           <Button
//             type="primary"
//             ghost
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => handleViewDetails(record)}
//           />
//           <Button
//             type="default"
//             size="small"
//             icon={<TruckOutlined />}
//             style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
//             onClick={() => handleTrackOrder(record)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//       <Title level={4} style={{ marginBottom: 20 }}>User Orders (Storefront) Management</Title>
//       {/* Order Statistics */}
//       <SystemOrdersStats stats={ordersStats} loading={loading} />



//       <SystemOrdersFilters
//         searchText={searchText}
//         statusFilter={statusFilter}
//         dateRange={dateRange}
//         onSearch={setSearchText}
//         onStatusChange={setStatusFilter}
//         onDateChange={setDateRange}
//       />

//       <div
//         ref={tableWrapperRef}
//         style={{
//           flex: 1,
//           minHeight: 0,
//         }}
//       >
//         <SystemOrdersTable
//           loading={loading}
//           orders={filteredOrders}
//           hasMore={ordersHasMore}
//           onViewDetails={handleViewDetails}
//           onTrackOrder={handleTrackOrder}
//         />
//         {ordersHasMore && tableScrollLoading && (
//           <div style={{ textAlign: 'center', padding: 12 }}>
//             Loading more orders...
//           </div>
//         )}
//         {!ordersHasMore &&
//           filteredOrders.length > 0 &&
//           !loading && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: 12,
//                 color: "#999",
//                 fontSize: 13,
//                 borderTop: "1px solid #f0f0f0",
//               }}
//             >
//               No more orders to load
//             </div>
//           )}
//       </div>


//       <OrderDetailsModal
//         open={detailModalVisible}
//         order={selectedOrder}
//         onCancel={() => setDetailModalVisible(false)}
//         newStatus={newStatus}
//         setNewStatus={setNewStatus}
//         statusNote={statusNote}
//         setStatusNote={setStatusNote}
//         onStatusUpdate={handleStatusUpdate}
//       />

//       <OrderTrackingModal
//         open={trackingModalVisible}
//         order={selectedOrder}
//         trackingLoading={trackingLoading}
//         trackingData={trackingData}
//         onCancel={() => setTrackingModalVisible(false)}

//         newStatus={newStatus}
//         setNewStatus={setNewStatus}

//         statusNote={statusNote}
//         setStatusNote={setStatusNote}

//         onStatusUpdate={handleStatusUpdate}
//         statusUpdateLoading={loading}
//       />
//     </div>
//   );
// };

// export default UserOrders;


import { message, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import OrderDetailsModal from '../../components/modals/OrderDetailsModal';
import OrderTrackingModal from '../../components/modals/OrderTrackingModal';
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
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);

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
      console.error(error);
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

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setStatusNote('');
    setTrackingModalVisible(true);
    setTrackingLoading(true);
    try {
      const { getOrderTracking } = await import('../../api/orders');
      const res = await getOrderTracking(order.id);
      setTrackingData(res.success ? (res.tracking || []) : []);
    } catch (error) {
      message.error('Failed to fetch tracking: ' + error.message);
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

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
          onTrackOrder={handleTrackOrder}
          onLoadMore={handleLoadMore}
        />
      </div>

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
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        onStatusUpdate={handleStatusUpdate}
        statusUpdateLoading={loading}
      />
    </div>
  );
};

export default UserOrders;