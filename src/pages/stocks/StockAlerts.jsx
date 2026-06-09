import { Alert } from 'antd';

/**
 * Renders dismissable warning/error banners when critical or out-of-stock
 * counts are non-zero. Renders nothing when both counts are zero.
 */
const StockAlerts = ({ critical, outOfStock }) => {
    if (!critical && !outOfStock) return null;

    return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {critical > 0 && (
                <Alert
                    message={`${critical} products need immediate restocking`}
                    type="warning"
                    showIcon
                    closable
                    style={{ flex: 1 }}
                />
            )}

            {outOfStock > 0 && (
                <Alert
                    message={`${outOfStock} products are out of stock`}
                    type="error"
                    showIcon
                    closable
                    style={{ flex: 1 }}
                />
            )}
        </div>
    );
};

export default StockAlerts;