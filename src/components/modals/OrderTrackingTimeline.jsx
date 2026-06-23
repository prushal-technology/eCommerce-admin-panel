import { Spin } from 'antd';
import dayjs from 'dayjs';

const STEPS = [
    { key: 'pending', label: 'Order placed', icon: '🛒' },
    { key: 'confirmed', label: 'Order confirmed', icon: '✅' },
    { key: 'dispatched', label: 'Dispatched', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '📦' },
];

const CANCELLED = { key: 'cancelled', label: 'Cancelled', icon: '✖' };

const STATUS_ORDER = ['pending', 'confirmed', 'dispatched', 'delivered'];

const OrderTrackingTimeline = ({ order, trackingData, trackingLoading }) => {
    if (trackingLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Spin size="small" />
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
                    Loading tracking info…
                </div>
            </div>
        );
    }

    const currentStatus = order?.status?.toLowerCase();
    const isCancelled = currentStatus === 'cancelled';
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);

    const steps = isCancelled ? [...STEPS, CANCELLED] : STEPS;

    const getTimestamp = (stepKey) => {
        if (!trackingData) return null;
        const entry = trackingData.find((t) => t.status?.toLowerCase() === stepKey);
        return entry?.timestamp
            ? dayjs(entry.timestamp).format('D MMM YYYY, h:mm A')
            : null;
    };

    return (
        <div>
            {steps.map((step, index) => {
                const stepIndex = STATUS_ORDER.indexOf(step.key);
                const isDone = !isCancelled && stepIndex !== -1 && stepIndex <= currentIndex;
                const isActive = step.key === currentStatus;
                const isFuture = !isDone && !isActive;
                const isLast = index === steps.length - 1;
                const timestamp = getTimestamp(step.key);

                let dotStyle = {};
                let dotBg = '#f5f5f5';
                let dotBorder = '1px solid #e8e8e8';
                let labelColor = '#bbb';

                if (isCancelled && isActive) {
                    dotBg = '#fff1f0'; dotBorder = '1.5px solid #ff4d4f'; labelColor = '#ff4d4f';
                } else if (isDone) {
                    dotBg = '#f6ffed'; dotBorder = '1.5px solid #52c41a'; labelColor = '#1f1f1f';
                } else if (isActive) {
                    dotBg = '#e6f4ff'; dotBorder = '1.5px solid #1890ff'; labelColor = '#1f1f1f';
                }

                dotStyle = { background: dotBg, border: dotBorder };

                return (
                    <div key={step.key} style={{ display: 'flex', gap: 12 }}>
                        {/* Dot + line */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, flexShrink: 0,
                                ...dotStyle,
                            }}>
                                {isDone
                                    ? <span style={{ color: '#52c41a', fontSize: 12 }}>✓</span>
                                    : <span style={{ opacity: isFuture ? 0.35 : 1 }}>{step.icon}</span>
                                }
                            </div>
                            {!isLast && (
                                <div style={{
                                    width: 1, flex: 1, minHeight: 20, margin: '2px 0',
                                    background: isDone ? '#b7eb8f' : '#e8e8e8',
                                }} />
                            )}
                        </div>

                        {/* Label */}
                        <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 4 }}>
                            <div style={{
                                fontSize: 13, fontWeight: isActive || isDone ? 600 : 400,
                                color: labelColor,
                            }}>
                                {step.label}
                            </div>
                            {timestamp && (
                                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                                    {timestamp}
                                </div>
                            )}
                            {isActive && !timestamp && (
                                <div style={{ fontSize: 11, color: '#1890ff', marginTop: 2 }}>Current status</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTrackingTimeline;