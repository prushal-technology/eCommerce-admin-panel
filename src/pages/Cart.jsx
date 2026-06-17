import { Button, Card, Empty, Space, Typography } from 'antd';
import usePermissions from '../hooks/usePermissions';

const { Title } = Typography;

const Cart = () => {
  const { canUpdate } = usePermissions();
  const canManageCart = canUpdate('cart');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Cart Management
      </Title>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {canManageCart && (
            <Button type="primary" size="small">
              Update Cart
            </Button>
          )}
          <Empty description="No cart records found" />
        </Space>
      </Card>
    </div>
  );
};

export default Cart;
