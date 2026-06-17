import { Card, Skeleton } from 'antd';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import InfoTooltip from '../../components/ui/InfoTooltip';

/**
 * Monthly sales revenue vs orders line chart.
 * Renders an animated bar-skeleton while data is loading.
 */
const SalesTrendChart = ({ data, loading }) => (
    <Card
        title={
            <InfoTooltip
                title="Sales Trend"
                text="Monthly sales revenue vs number of orders"
            />
        }
        style={{ height: 380, marginBottom: 16 }}
    >
        {loading ? (
            <div
                style={{
                    height: 290,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 12,
                    padding: 20,
                }}
            >
                {[40, 80, 60, 120, 90, 150].map((h, i) => (
                    <Skeleton.Node
                        key={i}
                        active
                        style={{ width: 40, height: h, borderRadius: 6 }}
                    />
                ))}
            </div>
        ) : (
            <ResponsiveContainer width="100%" height={290}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#1890ff"
                        strokeWidth={2}
                        name="Sales (₹)"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#52c41a"
                        strokeWidth={2}
                        name="Orders"
                    />
                </LineChart>
            </ResponsiveContainer>
        )}
    </Card>
);

export default SalesTrendChart;