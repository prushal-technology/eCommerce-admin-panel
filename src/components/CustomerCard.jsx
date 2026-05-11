import React from 'react';
import { Card, Tag, Button, Space, Avatar } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const CustomerCard = ({ customer, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      suspended: 'orange',
    };
    return colors[status] || 'default';
  };

  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => onEdit?.(customer)} />,
        <DeleteOutlined key="delete" onClick={() => onDelete?.(customer)} />,
      ]}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Avatar 
          size={64} 
          icon={<UserOutlined />}
          src={customer.avatar}
          style={{ marginBottom: 8 }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{customer.name}</div>
        <Tag color={getStatusColor(customer.status)}>{customer.status.toUpperCase()}</Tag>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailOutlined style={{ color: '#666' }} />
            <span style={{ fontSize: '12px' }}>{customer.email}</span>
          </div>
          
          {customer.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PhoneOutlined style={{ color: '#666' }} />
              <span style={{ fontSize: '12px' }}>{customer.phone}</span>
            </div>
          )}
        </Space>
      </div>

      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Total Orders:</span>
          <span style={{ fontWeight: 'bold' }}>{customer.totalOrders || 0}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Total Spent:</span>
          <span style={{ fontWeight: 'bold' }}>${(customer.totalSpent || 0).toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Member Since:</span>
          <span style={{ fontSize: '12px' }}>
            {customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        {customer.lastOrderDate && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Last Order:</span>
            <span style={{ fontSize: '12px' }}>
              {new Date(customer.lastOrderDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Button 
          type="primary" 
          size="small" 
          block 
          onClick={() => onView?.(customer)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default CustomerCard;
