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