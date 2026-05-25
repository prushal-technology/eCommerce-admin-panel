import { EyeOutlined, TruckOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';

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

const SystemOrdersTable = ({
  loading,
  orders,
  onViewDetails,
  onTrackOrder,
}) => {
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
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      loading={loading}
      size="small"
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} orders`,
      }}
    />
  );
};

export default SystemOrdersTable;
