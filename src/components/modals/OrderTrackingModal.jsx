import { Modal, Spin } from 'antd';

const OrderTrackingModal = ({
  open,
  order,
  trackingLoading,
  trackingData = [],
  onCancel,
  width = 500,
}) => {
  const orderStatuses = ['pending', 'confirmed', 'dispatched', 'delivered'];
  const currentStatusIndex = orderStatuses.indexOf(order?.status?.toLowerCase() || 'pending');

  return (
    <Modal
      title={`Order Tracking - ${order?.orderNumber || order?.id}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={width}
    >
      {trackingLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading tracking data...</p>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 32, padding: '0 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {orderStatuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isPending = index > currentStatusIndex;
                const trackingInfo = trackingData.find(t => t.status?.toLowerCase() === status);

                return (
                  <div key={status} style={{ display: 'flex', position: 'relative' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginRight: 16,
                      width: 24,
                    }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? '#52c41a' : (isCompleted ? '#1890ff' : '#f0f0f0'),
                        border: `3px solid ${isCurrent ? '#52c41a' : (isCompleted ? '#1890ff' : '#d9d9d9')}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                      }}>
                        {isCompleted && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff' }} />
                        )}
                      </div>
                      {index < orderStatuses.length - 1 && (
                        <div style={{
                          width: 3,
                          height: 40,
                          backgroundColor: isCompleted && index < currentStatusIndex ? '#1890ff' : '#d9d9d9',
                          marginTop: 4,
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, paddingTop: 2, paddingBottom: index < orderStatuses.length - 1 ? 24 : 0 }}>
                      <div style={{
                        fontWeight: isCurrent ? 'bold' : (isCompleted ? 600 : 400),
                        color: isPending ? '#999' : '#000',
                        textTransform: 'capitalize',
                        fontSize: 14,
                      }}>
                        {status}
                        {isCurrent && <span style={{ color: '#52c41a', marginLeft: 8, fontSize: 12 }}>(Current)</span>}
                      </div>
                      {trackingInfo && (
                        <div style={{ marginTop: 4 }}>
                          {trackingInfo.notes && (
                            <div style={{ fontSize: 12, color: '#666' }}>
                              {trackingInfo.notes}
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                            {trackingInfo.date} {trackingInfo.time}
                          </div>
                        </div>
                      )}
                      {!trackingInfo && isCompleted && index < currentStatusIndex && (
                        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrderTrackingModal;
