import {
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Statistic, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboard } from '../api/products';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const result = await getDashboard();
      if (result.success) {
        setStats(result.dashboardStats);
        setSalesTrend(result.salesTrend);
        setTopProducts(result.topProducts);
        setRecentProducts(result.recentProducts);
        setRecentOrders(result.recentOrders);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      completed: 'green',
      pending: 'orange',
      processing: 'blue',
      cancelled: 'red',
      shipped: 'cyan',
    };
    return colors[(status || '').toLowerCase()] || 'default';
  };

  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const recentOrderColumns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (val) => <span className="fw-bold">#{val}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {(status || '—').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => val ? new Date(val).toLocaleDateString('en-IN') : '—',
    },
  ];

  const topProductColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (val) => <span className="fw-bold">{val}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (val) => formatCurrency(val),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (qty) => (
        <Tag color={qty === 0 ? 'red' : qty < 10 ? 'orange' : 'green'}>
          {qty} units
        </Tag>
      ),
    },
    {
      title: 'Sold',
      dataIndex: 'totalSold',
      key: 'totalSold',
      render: (val) => <span>{val}</span>,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}>Dashboard</Title>

      {/* ── STAT CARDS ─────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Orders Today"
                value={stats?.totalOrdersToday ?? 0}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            )}
            {!loading && (
              <Text className="text-muted" style={{ fontSize: 12 }}>
                This month: {stats?.totalOrdersMonth ?? 0}
              </Text>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Total Revenue"
                value={stats?.totalRevenue ?? 0}
                prefix={<DollarCircleOutlined />}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Total Products"
                value={stats?.totalProducts ?? 0}
                prefix={<ProductOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Total Customers"
                value={stats?.totalCustomers ?? 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* ── ALERT CARDS ────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Pending Orders"
                value={stats?.pendingOrders ?? 0}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic
                title="Low Stock Products"
                value={stats?.lowStockProducts ?? 0}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* ── CHARTS ─────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Sales Trend" style={{ height: 380 }}>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} name="Sales (₹)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#52c41a" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Orders Trend" style={{ height: 380 }}>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#52c41a" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── TOP PRODUCTS + RECENT PRODUCTS ─────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Top Products">
            {loading ? <Skeleton active /> : (
              <Table
                rowKey="id"
                dataSource={topProducts}
                columns={topProductColumns}
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Recently Added Products" style={{ height: '100%' }}>
            {loading ? <Skeleton active /> : (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {recentProducts.map(product => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <div>
                      <div className="fw-bold" style={{ fontSize: 13 }}>{product.name}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        Stock:&nbsp;
                        <Tag color={product.stock === 0 ? 'red' : product.stock < 10 ? 'orange' : 'green'} style={{ fontSize: 11 }}>
                          {product.stock} units
                        </Tag>
                      </div>
                    </div>
                    <div className="fw-bold" style={{ color: '#1890ff', fontSize: 13 }}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                ))}
                {recentProducts.length === 0 && <Text className="text-muted">No products yet.</Text>}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── RECENT ORDERS ──────────────────────────── */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Recent Orders">
            {loading ? <Skeleton active /> : (
              <Table
                rowKey="id"
                dataSource={recentOrders}
                columns={recentOrderColumns}
                pagination={false}
                size="small"
                locale={{ emptyText: 'No recent orders' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
