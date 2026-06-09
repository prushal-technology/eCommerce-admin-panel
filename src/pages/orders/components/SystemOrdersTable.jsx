// import { EyeOutlined, TruckOutlined } from '@ant-design/icons';
// import { Button, Skeleton, Space, Table, Tag } from 'antd';
// import dayjs from 'dayjs';

// const getStatusColor = (status) => {
//   const colors = {
//     pending: 'orange',
//     confirmed: 'blue',
//     dispatched: 'purple',
//     delivered: 'green',
//     cancelled: 'red',
//   };
//   return colors[status] || 'default';
// };

// const getProductImage = (product) => {
//   const validImage = product?.images?.find(img => img.image && img.image.trim() !== '');
//   if (!validImage) return null;
//   return validImage.image.startsWith('data:')
//     ? validImage.image
//     : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
// };
// const skeletonRows = Array.from({ length: 6 }).map((_, index) => ({
//   id: `skeleton-${index}`,
//   isSkeleton: true,
// }));

// const SystemOrdersTable = ({
//   loading,
//   orders,
//   hasMore,
//   onViewDetails,
//   onTrackOrder,
// }) => {
//   const columns = [
//     {
//       title: 'Order ID',
//       dataIndex: 'orderNumber',
//       key: 'orderNumber',
//       render: (orderNumber, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{ width: 120 }}
//             />
//           );
//         }

//         return (
//           <span style={{ fontWeight: 'bold' }}>
//             {orderNumber}
//           </span>
//         );
//       },
//     },

//     {
//       title: 'Products',
//       dataIndex: 'items',
//       key: 'products',
//       render: (items, record) => {

//         if (record.isSkeleton) {
//           return (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {[1, 2].map((item) => (
//                 <div
//                   key={item}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 8
//                   }}
//                 >
//                   <Skeleton.Image
//                     active
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 4
//                     }}
//                   />

//                   <div>
//                     <Skeleton.Input
//                       active
//                       size="small"
//                       style={{ width: 120 }}
//                     />

//                     <div style={{ marginTop: 6 }}>
//                       <Skeleton.Input
//                         active
//                         size="small"
//                         style={{ width: 60 }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );
//         }

//         return (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {items?.map((item, index) => {
//               const product = item.product;
//               const imageSrc = getProductImage(product);

//               return (
//                 <div
//                   key={index}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 8
//                   }}
//                 >
//                   {imageSrc ? (
//                     <img
//                       src={imageSrc}
//                       alt={product?.name}
//                       style={{
//                         width: 40,
//                         height: 40,
//                         objectFit: 'cover',
//                         borderRadius: 4,
//                         border: '1px solid #f0f0f0'
//                       }}
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: 40,
//                         height: 40,
//                         backgroundColor: '#f5f5f5',
//                         borderRadius: 4,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         border: '1px solid #e0e0e0'
//                       }}
//                     >
//                       <span style={{ fontSize: 10, color: '#999' }}>
//                         No Img
//                       </span>
//                     </div>
//                   )}

//                   <div>
//                     <div style={{ fontWeight: 500, fontSize: 13 }}>
//                       {product?.name || 'Unknown Product'}
//                     </div>

//                     <div style={{ fontSize: 12, color: '#666' }}>
//                       Qty: {item.quantity}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         );
//       },
//     },

//     {
//       title: 'Amount',
//       dataIndex: 'finalAmount',
//       key: 'finalAmount',
//       render: (amount, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{ width: 80 }}
//             />
//           );
//         }

//         return (
//           <span style={{ fontWeight: 'bold' }}>
//             ₹{parseFloat(amount || 0).toFixed(2)}
//           </span>
//         );
//       },

//       sorter: (a, b) =>
//         parseFloat(a.totalAmount) - parseFloat(b.totalAmount),
//     },

//     {
//       title: 'Customer Name',
//       dataIndex: 'customer',
//       key: 'customerName',
//       render: (customer, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{ width: 140 }}
//             />
//           );
//         }

//         return (
//           <span style={{ fontWeight: 500 }}>
//             {customer?.firstName} {customer?.lastName}
//           </span>
//         );
//       },
//     },

//     {
//       title: 'Date',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{ width: 160 }}
//             />
//           );
//         }

//         return dayjs(date).format('MMM D, YYYY h:mm A');
//       },

//       sorter: (a, b) =>
//         new Date(a.createdAt) - new Date(b.createdAt),
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
//               style={{ width: 90 }}
//             />
//           );
//         }

//         return (
//           <Tag color={getStatusColor(status)}>
//             {status ? status.toUpperCase() : 'UNKNOWN'}
//           </Tag>
//         );
//       },
//     },

//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Space size="small">
//               <Skeleton.Button
//                 active
//                 size="small"
//                 shape="circle"
//               />

//               <Skeleton.Button
//                 active
//                 size="small"
//                 shape="circle"
//               />
//             </Space>
//           );
//         }

//         return (
//           <Space size="small">
//             <Button
//               type="primary"
//               ghost
//               size="small"
//               icon={<EyeOutlined />}
//               onClick={() => onViewDetails(record)}
//             />

//             <Button
//               type="default"
//               size="small"
//               icon={<TruckOutlined />}
//               style={{
//                 backgroundColor: '#52c41a',
//                 borderColor: '#52c41a',
//                 color: '#fff'
//               }}
//               onClick={() => onTrackOrder(record)}
//             />
//           </Space>
//         );
//       },
//     },
//   ];

//   return (
//     <Table
//       columns={columns}
//       dataSource={loading ? skeletonRows : orders}
//       size="small"
//       rowKey="id"
//       pagination={false}
//       scroll={{
//         x: 'max-content',
//         y: 'calc(100vh - 360px)',
//       }}

//       summary={() =>
//         !hasMore &&
//           orders.length > 0 &&
//           !loading ? (
//           <Table.Summary.Row>
//             <Table.Summary.Cell
//               index={0}
//               colSpan={columns.length}
//             >
//               <div
//                 style={{
//                   textAlign: 'center',
//                   color: '#999',
//                   fontSize: 13,
//                   padding: '2px 0',
//                 }}
//               >
//                 No more orders to load
//               </div>
//             </Table.Summary.Cell>
//           </Table.Summary.Row>
//         ) : null
//       }
//     />
//   );
// };

// export default SystemOrdersTable;


import { EyeOutlined, TruckOutlined } from '@ant-design/icons';
import { Button, Skeleton, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

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

const getProductImage = (product) => {
  const validImage = product?.images?.find(img => img.image && img.image.trim() !== '');
  if (!validImage) return null;
  return validImage.image.startsWith('data:')
    ? validImage.image
    : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
};

const skeletonRows = Array.from({ length: 6 }).map((_, index) => ({
  id: `skeleton-${index}`,
  isSkeleton: true,
}));

const SystemOrdersTable = ({
  loading,
  orders,
  hasMore,
  tableScrollLoading,
  onViewDetails,
  onTrackOrder,
  onLoadMore,           // () => void  — called when scroll reaches bottom
}) => {
  const tableRef = useRef(null);
  const fetchingRef = useRef(false);

  // ── Infinite scroll — lives here, next to the element that scrolls ──────────
  useEffect(() => {
    const tableBody = tableRef.current?.querySelector('.ant-table-body');
    if (!tableBody) return;

    const handleScroll = () => {
      if (loading || tableScrollLoading || fetchingRef.current || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = tableBody;
      if (scrollTop + clientHeight >= scrollHeight - 80) {
        fetchingRef.current = true;
        onLoadMore?.()?.finally?.(() => {
          fetchingRef.current = false;
        });
      }
    };

    tableBody.addEventListener('scroll', handleScroll, { passive: true });
    return () => tableBody.removeEventListener('scroll', handleScroll);
  }, [loading, tableScrollLoading, hasMore, onLoadMore]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber, record) =>
        record.isSkeleton ? (
          <Skeleton.Input active size="small" style={{ width: 120 }} />
        ) : (
          <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>
        ),
    },
    {
      title: 'Products',
      dataIndex: 'items',
      key: 'products',
      render: (items, record) => {
        if (record.isSkeleton) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Skeleton.Image active style={{ width: 40, height: 40, borderRadius: 4 }} />
                  <div>
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                    <div style={{ marginTop: 6 }}>
                      <Skeleton.Input active size="small" style={{ width: 60 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return (
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
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      render: (amount, record) =>
        record.isSkeleton ? (
          <Skeleton.Input active size="small" style={{ width: 80 }} />
        ) : (
          <span style={{ fontWeight: 'bold' }}>₹{parseFloat(amount || 0).toFixed(2)}</span>
        ),
      sorter: (a, b) => parseFloat(a.finalAmount) - parseFloat(b.finalAmount),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customerName',
      render: (customer, record) =>
        record.isSkeleton ? (
          <Skeleton.Input active size="small" style={{ width: 140 }} />
        ) : (
          <span style={{ fontWeight: 500 }}>
            {customer?.firstName} {customer?.lastName}
          </span>
        ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date, record) =>
        record.isSkeleton ? (
          <Skeleton.Input active size="small" style={{ width: 160 }} />
        ) : (
          dayjs(date).format('MMM D, YYYY h:mm A')
        ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) =>
        record.isSkeleton ? (
          <Skeleton.Button active size="small" style={{ width: 90 }} />
        ) : (
          <Tag color={getStatusColor(status)}>
            {status ? status.toUpperCase() : 'UNKNOWN'}
          </Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.isSkeleton) {
          return (
            <Space size="small">
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button active size="small" shape="circle" />
            </Space>
          );
        }
        return (
          <Space size="small">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
            />
            <Button
              type="default"
              size="small"
              icon={<TruckOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
              onClick={() => onTrackOrder(record)}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div ref={tableRef}>
      <Table
        columns={columns}
        dataSource={loading ? skeletonRows : orders}
        size="small"
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content', y: 'calc(100vh - 360px)' }}
        summary={() =>
          !hasMore && orders.length > 0 && !loading ? (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={columns.length}>
                <div style={{ textAlign: 'center', color: '#999', fontSize: 13, padding: '2px 0' }}>
                  No more orders to load
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          ) : null
        }
      />

      {tableScrollLoading && (
        <div style={{ textAlign: 'center', padding: 12, color: '#999', fontSize: 13 }}>
          Loading more orders...
        </div>
      )}
    </div>
  );
};

export default SystemOrdersTable;