// import {
//   ExclamationCircleOutlined,
//   ProductOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
//   WarningOutlined
// } from '@ant-design/icons';
// import { Card, Col, Row, Skeleton, Statistic, Table, Tag, Typography } from 'antd';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis
// } from 'recharts';
// import InfoTooltip from '../components/ui/InfoTooltip';
// import useDashboard from '../hooks/useDashboard';

// const { Title, Text } = Typography;

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const {
//     stats,
//     salesTrend,
//     topProducts,
//     recentProducts,
//     recentOrders,
//     loading,
//     fetchDashboard,
//   } = useDashboard();

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   const getStatusColor = (status) => {
//     const colors = {
//       completed: 'green',
//       pending: 'orange',
//       confirmed: 'blue',
//       cancelled: 'red',
//       shipped: 'cyan',
//     };
//     return colors[(status || '').toLowerCase()] || 'default';
//   };

//   const formatCurrency = (val) =>
//     `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

//   const skeletonRows = Array.from({ length: 5 }).map((_, index) => ({
//     id: `skeleton-${index}`,
//     isSkeleton: true,
//   }));

//   const recentOrderColumns = [
//     {
//       title: 'Order #',
//       dataIndex: 'orderNumber',
//       key: 'orderNumber',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 90,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return (
//           <span className="fw-bold">
//             #{val}
//           </span>
//         );
//       },
//     },

//     {
//       title: 'Customer',
//       dataIndex: 'customerName',
//       key: 'customerName',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 120,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return val;
//       },
//     },

//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Button
//               active
//               size="small"
//               style={{
//                 width: 80,
//                 height: 24,
//                 borderRadius: 20
//               }}
//             />
//           );
//         }

//         return (
//           <Tag color={getStatusColor(status)}>
//             {(status || '—').toUpperCase()}
//           </Tag>
//         );
//       },
//     },

//     {
//       title: 'Date',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 100,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return val
//           ? new Date(val).toLocaleDateString('en-IN')
//           : '—';
//       },
//     },
//   ];

//   const topProductColumns = [
//     {
//       title: 'Product',
//       dataIndex: 'name',
//       key: 'name',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 140,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return (
//           <span className="fw-bold">
//             {val}
//           </span>
//         );
//       },
//     },

//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 90,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return formatCurrency(val);
//       },
//     },

//     {
//       title: 'Stock',
//       dataIndex: 'stock',
//       key: 'stock',
//       render: (qty, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Button
//               active
//               size="small"
//               style={{
//                 width: 85,
//                 height: 24,
//                 borderRadius: 20
//               }}
//             />
//           );
//         }

//         return (
//           <Tag
//             color={
//               qty === 0
//                 ? 'red'
//                 : qty < 10
//                   ? 'orange'
//                   : 'green'
//             }
//           >
//             {qty} units
//           </Tag>
//         );
//       },
//     },

//     {
//       title: 'Sold',
//       dataIndex: 'totalSold',
//       key: 'totalSold',
//       render: (val, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 50,
//                 height: 20,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return <span>{val}</span>;
//       },
//     },
//   ];
//   const statisticFormatter = (value) => (
//     loading ? (
//       <div
//         style={{
//           width: '100%',
//           display: 'flex',
//           alignItems: 'center'
//         }}
//       >
//         <Skeleton.Input
//           active
//           size="small"
//           style={{
//             width: '60%',
//             minWidth: 50,
//             maxWidth: 90,
//             height: 22,
//             borderRadius: 6
//           }}
//         />
//       </div>
//     ) : (
//       value
//     )
//   );
//   return (
//     <div style={{ height: '100%', overflowY: 'auto', paddingRight: 4, }}>
//       <Title level={4} style={{ marginBottom: 20 }}>Dashboard</Title>

//       {/* ── STAT CARDS ─────────────────────────────── */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col xs={24} sm={12} lg={6}>
//           <Card
//             hoverable
//             onClick={() => navigate('/orders/all')}
//           >
//             <Statistic
//               title="Orders Today"
//               value={loading ? 0 : stats?.totalOrdersToday ?? 0}
//               prefix={!loading ? <ShoppingCartOutlined /> : null}
//               valueStyle={{ color: '#1890ff' }}
//               formatter={statisticFormatter}
//             />
//             {!loading && (
//               <Text className="text-muted" style={{ fontSize: 12 }}>
//                 This month: {stats?.totalOrdersMonth ?? 0}
//               </Text>
//             )}
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Total Revenue"
//               value={loading ? 0 : stats?.totalRevenue ?? 0}
//               prefix={!loading ? "₹" : null}
//               precision={2}
//               valueStyle={{ color: '#3f8600' }}
//               formatter={(v) =>
//                 loading
//                   ? statisticFormatter(v)
//                   : `${Number(v).toLocaleString('en-IN')}`
//               }
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <Card
//             hoverable
//             onClick={() => navigate('/products/all')}
//           >
//             <Statistic
//               title="Total Products"
//               value={loading ? 0 : stats?.totalProducts ?? 0}
//               prefix={!loading ? <ProductOutlined /> : null}
//               valueStyle={{ color: '#faad14' }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Total Customers"
//               value={loading ? 0 : stats?.totalCustomers ?? 0}
//               prefix={!loading ? <UserOutlined /> : null}
//               valueStyle={{ color: '#722ed1' }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* ── ALERT CARDS ────────────────────────────── */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col xs={24} sm={12}>
//           <Card>
//             <Statistic
//               title="Pending Orders"
//               value={loading ? 0 : stats?.pendingOrders ?? 0}
//               prefix={!loading ? <ExclamationCircleOutlined /> : null}
//               valueStyle={{ color: '#fa8c16' }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12}>
//           <Card>
//             <Statistic
//               title={<InfoTooltip title="Low Stock Products" text="Products with quantity between 6 and 15" />}
//               value={loading ? 0 : stats?.lowStockProducts ?? 0}
//               prefix={!loading ? <WarningOutlined /> : null}
//               valueStyle={{ color: '#ff4d4f' }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* ── CHARTS ─────────────────────────────────── */}
//       <Row  style={{ marginBottom: 16 }}>
//         <Col xs={24} >
//           <Card title={<InfoTooltip title="Sales Trend" text="Monthly sales revenue vs number of orders" />} style={{ height: 380 }}>
//             {loading ? (
//               <div
//                 style={{
//                   height: 290,
//                   display: 'flex',
//                   alignItems: 'flex-end',
//                   gap: 12,
//                   padding: 20
//                 }}
//               >
//                 {[40, 80, 60, 120, 90, 150].map((h, i) => (
//                   <Skeleton.Node
//                     key={i}
//                     active
//                     style={{
//                       width: 40,
//                       height: h,
//                       borderRadius: 6
//                     }}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height={290}>
//                 <LineChart data={salesTrend}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Legend />
//                   <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} name="Sales (₹)" />
//                   <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#52c41a" strokeWidth={2} name="Orders" />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//           </Card>
//         </Col>

//       </Row>

//       {/* ── TOP PRODUCTS + RECENT PRODUCTS ─────────── */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col xs={24} lg={14}>
//           <Card title="Top Products">

//             <Table
//               rowKey="id"
//               dataSource={loading ? skeletonRows : topProducts}
//               columns={topProductColumns}
//               pagination={false}
//               size="small"
//             />

//           </Card>
//         </Col>
//         <Col xs={24} lg={10}>
//           <Card
//             title="Recently Added Products"
//             style={{ height: '100%' }}
//           >
//             <div
//               style={{
//                 maxHeight: 300,
//                 overflowY: 'auto'
//               }}
//             >

//               {loading ? (

//                 Array.from({ length: 5 }).map((_, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       padding: '10px 0',
//                       borderBottom: '1px solid #f0f0f0',
//                       gap: 12
//                     }}
//                   >

//                     {/* Left Side */}
//                     <div style={{ flex: 1 }}>

//                       <Skeleton.Input
//                         active
//                         size="small"
//                         style={{
//                           width: '70%',
//                           minWidth: 100,
//                           maxWidth: 180,
//                           height: 20,
//                           borderRadius: 6,
//                           marginBottom: 8
//                         }}
//                       />

//                       <div
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: 8
//                         }}
//                       >

//                         <Skeleton.Input
//                           active
//                           size="small"
//                           style={{
//                             width: 40,
//                             height: 16,
//                             borderRadius: 6
//                           }}
//                         />

//                         <Skeleton.Button
//                           active
//                           size="small"
//                           style={{
//                             width: 80,
//                             height: 22,
//                             borderRadius: 20
//                           }}
//                         />

//                       </div>
//                     </div>

//                     {/* Right Side Price */}
//                     <Skeleton.Input
//                       active
//                       size="small"
//                       style={{
//                         width: 70,
//                         height: 20,
//                         borderRadius: 6
//                       }}
//                     />

//                   </div>
//                 ))

//               ) : (

//                 <>
//                   {recentProducts.map(product => (
//                     <div
//                       key={product.id}
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         padding: '8px 0',
//                         borderBottom: '1px solid #f0f0f0',
//                       }}
//                     >
//                       <div>
//                         <div
//                           className="fw-bold"
//                           style={{ fontSize: 13 }}
//                         >
//                           {product.name}
//                         </div>

//                         <div
//                           className="text-muted"
//                           style={{ fontSize: 12 }}
//                         >
//                           Stock:&nbsp;

//                           <Tag
//                             color={
//                               product.stock === 0
//                                 ? 'red'
//                                 : product.stock < 10
//                                   ? 'orange'
//                                   : 'green'
//                             }
//                             style={{ fontSize: 11 }}
//                           >
//                             {product.stock} units
//                           </Tag>
//                         </div>
//                       </div>

//                       <div
//                         className="fw-bold"
//                         style={{
//                           color: '#1890ff',
//                           fontSize: 13
//                         }}
//                       >
//                         {formatCurrency(product.price)}
//                       </div>
//                     </div>
//                   ))}

//                   {recentProducts.length === 0 && ( 
//                     <Text className="text-muted">
//                       No products yet.
//                     </Text>
//                   )}
//                 </>
//               )}
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* ── RECENT ORDERS ──────────────────────────── */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24}>
//           <Card title="Recent Orders">

//             <Table
//               rowKey="id"
//               dataSource={loading ? skeletonRows : recentOrders}
//               columns={recentOrderColumns}
//               pagination={false}
//               size="small"
//               locale={{ emptyText: 'No recent orders' }}
//             />

//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;



import { Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import useDashboard from '../hooks/useDashboard';
import DashboardAlerts from './dashboard/DashboardAlerts';
import DashboardStats from './dashboard/DashboardStats';
import RecentOrdersTable from './dashboard/RecentOrdersTable';
import RecentProductsList from './dashboard/RecentProductsList';
import SalesTrendChart from './dashboard/SalesTrendChart';
import TopProductsTable from './dashboard/TopProductsTable';

const { Title } = Typography;

/**
 * Dashboard page — composes all dashboard sections.
 * Contains no rendering logic of its own; each section is fully self-contained.
 */
const Dashboard = () => {
  const {
    stats,
    salesTrend,
    topProducts,
    recentProducts,
    recentOrders,
    loading,
    fetchDashboard,
  } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div
      style={{
        paddingRight: 4,
        width: '100%',
      }}
    >
      <Title level={4} style={{ marginBottom: 20 }}>
        Dashboard
      </Title>

      <DashboardStats stats={stats} loading={loading} />

      <DashboardAlerts stats={stats} loading={loading} />

      <SalesTrendChart
        data={salesTrend}
        loading={loading}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <TopProductsTable
            products={topProducts}
            loading={loading}
          />
        </Col>

        <Col xs={24} lg={10}>
          <RecentProductsList
            products={recentProducts}
            loading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <RecentOrdersTable
            orders={recentOrders}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;