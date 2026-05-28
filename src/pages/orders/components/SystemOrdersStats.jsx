import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Statistic } from 'antd';

const SystemOrdersStats = ({ stats, loading }) => {

  const renderStatistic = (
    title,
    value,
    prefix,
    valueStyle = {}
  ) => {
    return (
      <Statistic
        title={title}
        value={loading ? 0 : value}
        prefix={!loading ? prefix : null}
        valueStyle={valueStyle}
        precision={title === "Revenue" ? 2 : undefined}
        formatter={(val) =>
          loading ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Skeleton.Input
                active
                size="small"
                style={{
                  width: '60%',
                  minWidth: 50,
                  maxWidth: 80,
                  height: 22,

                }}
              />
            </div>
          ) : (
            val
          )
        }
      />
    );
  };

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Total Orders",
            stats.total,
            <ShoppingCartOutlined />
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Pending",
            stats.pending,
            <ClockCircleOutlined />,
            { color: '#faad14' }
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Dispatched",
            stats.dispatched,
            <TruckOutlined />,
            { color: '#1890ff' }
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Delivered",
            stats.delivered,
            <CheckCircleOutlined />,
            { color: '#52c41a' }
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Cancelled",
            stats.cancelled,
            <CloseCircleOutlined />,
            { color: '#ff4d4f' }
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <Card>
          {renderStatistic(
            "Revenue",
            stats.totalRevenue,
            "₹",
            { color: '#722ed1' }
          )}
        </Card>
      </Col>

    </Row>
  );
};

export default SystemOrdersStats;