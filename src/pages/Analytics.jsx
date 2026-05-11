import { ArrowUpOutlined, DollarCircleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Select, Statistic } from 'antd';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = () => {
  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 5000, orders: 290 },
    { month: 'Apr', sales: 2780, orders: 189 },
    { month: 'May', sales: 6890, orders: 389 },
    { month: 'Jun', sales: 7390, orders: 480 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 4500, color: '#1890ff' },
    { name: 'Clothing', value: 3200, color: '#52c41a' },
    { name: 'Accessories', value: 2100, color: '#faad14' },
    { name: 'Home', value: 1800, color: '#722ed1' },
    { name: 'Sports', value: 1200, color: '#eb2f96' },
  ];

  const topProducts = [
    { name: 'Laptop Pro 15"', sales: 156, revenue: 203499 },
    { name: 'Wireless Mouse', sales: 234, revenue: 7016 },
    { name: 'USB-C Cable', sales: 189, revenue: 3780 },
    { name: 'Phone Case', sales: 145, revenue: 2900 },
    { name: 'Headphones', sales: 98, revenue: 14700 },
  ];

  const customerGrowth = [
    { month: 'Jan', new: 120, returning: 890 },
    { month: 'Feb', new: 145, returning: 920 },
    { month: 'Mar', new: 189, returning: 980 },
    { month: 'Apr', new: 167, returning: 1050 },
    { month: 'May', new: 234, returning: 1120 },
    { month: 'Jun', new: 278, returning: 1234 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Analytics Dashboard</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">All Time</Option>
            <Option value="today">Today</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={28950}
              prefix={<DollarCircleOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <span style={{ color: '#3f8600' }}>↑ 12.5%</span> from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1786}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <span style={{ color: '#3f8600' }}>↑ 8.2%</span> from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={1512}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <span style={{ color: '#3f8600' }}>↑ 15.3%</span> from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={16.21}
              prefix={<ArrowUpOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <span style={{ color: '#cf1322' }}>↓ 2.1%</span> from last month
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Sales Trend" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} name="Sales ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#52c41a" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Sales by Category" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top Products" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="sales" fill="#1890ff" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Customer Growth" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#52c41a" name="New Customers" />
                <Bar dataKey="returning" fill="#1890ff" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
