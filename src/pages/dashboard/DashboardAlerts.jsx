import {
    ExclamationCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import InfoTooltip from '../../components/ui/InfoTooltip';
import { makeSkeletonFormatter } from './dashboardUtils';

/**
 * Two alert-style stat cards: Pending Orders and Low Stock Products.
 */
const DashboardAlerts = ({ stats, loading }) => {
    const skeletonFormatter = makeSkeletonFormatter(loading);

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12}>
                <Card>
                    <Statistic
                        title="Pending Orders"
                        value={loading ? 0 : stats?.pendingOrders ?? 0}
                        prefix={!loading ? <ExclamationCircleOutlined /> : null}
                        valueStyle={{ color: '#fa8c16' }}
                        formatter={skeletonFormatter}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12}>
                <Card>
                    <Statistic
                        title={
                            <InfoTooltip
                                title="Low Stock Products"
                                text="Products with quantity between 6 and 15"
                            />
                        }
                        value={loading ? 0 : stats?.lowStockProducts ?? 0}
                        prefix={!loading ? <WarningOutlined /> : null}
                        valueStyle={{ color: '#ff4d4f' }}
                        formatter={skeletonFormatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardAlerts;