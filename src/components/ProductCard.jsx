import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Space, Tag } from 'antd';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      draft: 'orange',
    };
    return colors[status] || 'default';
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'red';
    if (stock < 10) return 'orange';
    return 'green';
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {!product.imageUrl && (
            <div style={{ textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '48px' }}>📦</div>
              <div>No Image</div>
            </div>
          )}
        </div>
      }
      actions={[
        <EyeOutlined key="view" onClick={() => onView?.(product)} />,
        <EditOutlined key="edit" onClick={() => onEdit?.(product)} />,
        <DeleteOutlined key="delete" onClick={() => onDelete?.(product)} />,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{product.name}</span>
            <Tag color={getStatusColor(product.status)}>{product.status}</Tag>
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: 8 }}>{product.description}</div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Price:</span>
                <span style={{ fontWeight: 'bold' }}>${product.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Stock:</span>
                <Tag color={getStockColor(product.stock?.quantity)}>{product.stock?.quantity} units</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Category:</span>
                <span>{product.category}</span>
              </div>
            </Space>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
