import { TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Statistic } from 'antd';

const StatCard = ({ title, value, valueStyle, prefix, loading }) => {
    const formatter = (val) =>
        loading ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: '55%', minWidth: 45, maxWidth: 80, height: 22, borderRadius: 6 }}
                />
            </div>
        ) : (
            val
        );

    return (
        <Card>
            <Statistic
                title={title}
                value={loading ? 0 : value}
                valueStyle={valueStyle}
                prefix={!loading ? prefix : null}
                formatter={formatter}
            />
        </Card>
    );
};

const EmployeeStats = ({ stats, loading }) => (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Total Employees"
                value={stats.total}
                prefix={<TeamOutlined />}
                loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Active"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Inactive"
                value={stats.inactive}
                valueStyle={{ color: '#ff4d4f' }}
                loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Admins"
                value={stats.admin}
                valueStyle={{ color: '#722ed1' }}
                loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Managers"
                value={stats.manager}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} md={4}>
            <StatCard
                title="Employees"
                value={stats.employee}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
            />
        </Col>
    </Row>
);

export default EmployeeStats;