import {
    ProductOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { makeSkeletonFormatter } from './dashboardUtils';

const { Text } = Typography;

/**
 * Four primary KPI cards: Orders Today, Total Revenue, Total Products, Total Customers.
 */
const DashboardStats = ({ stats, loading }) => {
    const navigate = useNavigate();
    const skeletonFormatter = makeSkeletonFormatter(loading);

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} lg={6}>
                <Card >
                    <Statistic
                        title="Orders Today"
                        value={loading ? 0 : stats?.totalOrdersToday ?? 0}
                        prefix={!loading ? <ShoppingCartOutlined /> : null}
                        valueStyle={{ color: '#1890ff' }}
                        formatter={skeletonFormatter}
                    />
                    {!loading && (
                        <Text className="text-muted" style={{ fontSize: 12 }}>
                            This month: {stats?.totalOrdersMonth ?? 0}
                        </Text>
                    )}
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Total Revenue"
                        value={loading ? 0 : stats?.totalRevenue ?? 0}
                        prefix={!loading ? '₹' : null}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        formatter={(v) =>
                            loading
                                ? skeletonFormatter(v)
                                : Number(v).toLocaleString('en-IN')
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card hoverable onClick={() => navigate('/products/all')}>
                    <Statistic
                        title="Total Products"
                        value={loading ? 0 : stats?.totalProducts ?? 0}
                        prefix={!loading ? <ProductOutlined /> : null}
                        valueStyle={{ color: '#faad14' }}
                        formatter={skeletonFormatter}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Total Customers"
                        value={loading ? 0 : stats?.totalCustomers ?? 0}
                        prefix={!loading ? <UserOutlined /> : null}
                        valueStyle={{ color: '#722ed1' }}
                        formatter={skeletonFormatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardStats;