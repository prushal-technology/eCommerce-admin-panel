import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

const SystemOrdersStats = ({ stats }) => (
  <Row gutter={16} style={{ marginBottom: 16 }}>
    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Total Orders"
          value={stats.total}
          prefix={<ShoppingCartOutlined />}
        />
      </Card>
    </Col>

    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Pending"
          value={stats.pending}
          valueStyle={{ color: '#faad14' }}
          prefix={<ClockCircleOutlined />}
        />
      </Card>
    </Col>

    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Dispatched"
          value={stats.dispatched}
          valueStyle={{ color: '#1890ff' }}
          prefix={<TruckOutlined />}
        />
      </Card>
    </Col>

    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Delivered"
          value={stats.delivered}
          valueStyle={{ color: '#52c41a' }}
          prefix={<CheckCircleOutlined />}
        />
      </Card>
    </Col>

    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Cancelled"
          value={stats.cancelled}
          valueStyle={{ color: '#ff4d4f' }}
          prefix={<CloseCircleOutlined />}
        />
      </Card>
    </Col>

    <Col xs={24} sm={12} md={4}>
      <Card>
        <Statistic
          title="Revenue"
          value={stats.totalRevenue}
          //prefix={<DollarCircleOutlined />}
          prefix="₹"
          precision={2}
          valueStyle={{ color: '#722ed1' }}
        />
      </Card>
    </Col>
  </Row>
);

export default SystemOrdersStats;
