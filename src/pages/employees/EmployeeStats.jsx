import {
    CheckCircleOutlined,
    StopOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Statistic } from 'antd';

const EmployeeStats = ({ stats, loading }) => {
    const cards = [
        {
            title: 'Total Employees',
            value: stats.total,
            icon: <TeamOutlined style={{ color: '#1677ff' }} />,
        },
        {
            title: 'Active',
            value: stats.active,
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        },
        {
            title: 'Inactive',
            value: stats.inactive,
            icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            {cards.map((card) => (
                <Col xs={24} sm={8} key={card.title}>
                    <Card
                        style={{
                            height: 110,
                            borderRadius: 10,
                        }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <Statistic
                                title={
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: '#8c8c8c',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {card.title}
                                    </span>
                                }
                                value={card.value}
                                prefix={card.icon}
                                valueStyle={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                            />
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default EmployeeStats;