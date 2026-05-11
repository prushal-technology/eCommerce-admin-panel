import React from 'react';
import { Card, Tag, Button, Space, Progress } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

const OrderCard = ({ order, onView, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'gray',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'green',
      pending: 'orange',
      failed: 'red',
      refunded: 'gray',
    };
    return colors[status] || 'default';
  };

  const getProgressPercent = (status) => {
    const progressMap = {
      pending: 20,
      processing: 40,
      shipped: 70,
      delivered: 100,
      cancelled: 0,
      refunded: 0,
    };
    return progressMap[status] || 0;
  };

  return (
    <Card
      hoverable
      actions={[
        <EyeOutlined key="view" onClick={() => onView?.(order)} />,
        <EditOutlined key="edit" onClick={() => onEdit?.(order)} />,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Order #{order.orderNumber}</span>
          <Tag color={getStatusColor(order.status)}>{order.status.toUpperCase()}</Tag>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span>Customer: {order.customer?.name}</span>
          <Tag color={getPaymentStatusColor(order.paymentStatus)}>
            {order.paymentStatus?.toUpperCase()}
          </Tag>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Progress 
            percent={getProgressPercent(order.status)} 
            size="small" 
            showInfo={false}
            strokeColor={getStatusColor(order.status)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#666' }}>
            {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            ${order.total?.toFixed(2)}
          </span>
        </div>

        {order.trackingNumber && (
          <div style={{ fontSize: '12px', color: '#666' }}>
            Tracking: {order.trackingNumber}
          </div>
        )}
      </div>

      {order.items && order.items.length > 0 && (
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Order Items:</div>
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '12px' }}>{item.product?.name}</span>
              <span style={{ fontSize: '12px' }}>
                {item.quantity}x ${item.price?.toFixed(2)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              +{order.items.length - 3} more items
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default OrderCard;
