import {
  Modal,
  Select,
  Spin
} from 'antd';

const { Option } = Select;

const OrderTrackingModal = ({
  open,
  order,
  trackingLoading,
  trackingData = [],
  onCancel,

  // NEW PROPS
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  onStatusUpdate,
  statusUpdateLoading = false,
  canUpdateStatus = false,

  width = 500,
}) => {

  const orderStatuses = [
    'pending',
    'confirmed',
    'dispatched',
    'delivered'
  ];

  const currentStatusIndex =
    orderStatuses.indexOf(
      order?.status?.toLowerCase() || 'pending'
    );

  return (
    <Modal
      title={`Order Tracking - ${order?.orderNumber || order?.id}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={width}
    >

      {trackingLoading ? (

        <div
          style={{
            textAlign: 'center',
            padding: '40px 0'
          }}
        >
          <Spin size="large" />

          <p style={{ marginTop: 16 }}>
            Loading tracking data...
          </p>
        </div>

      ) : (

        <div style={{ padding: '12px 0' }}>

          {/* TRACKING TIMELINE */}

          <div
            style={{
              padding: '0 8px'
            }}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >

              {orderStatuses.map((status, index) => {

                const isCompleted =
                  index <= currentStatusIndex;

                const isCurrent =
                  index === currentStatusIndex;

                const isPending =
                  index > currentStatusIndex;

                const trackingInfo =
                  trackingData.find(
                    t =>
                      t.status?.toLowerCase() === status
                  );

                return (

                  <div
                    key={status}
                    style={{
                      display: 'flex',
                      position: 'relative'
                    }}
                  >

                    {/* TIMELINE DOT */}

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: 16,
                        width: 24,
                      }}
                    >

                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',

                          backgroundColor:
                            isCurrent
                              ? '#52c41a'
                              : (
                                isCompleted
                                  ? '#1890ff'
                                  : '#f0f0f0'
                              ),

                          border: `3px solid ${isCurrent
                            ? '#52c41a'
                            : (
                              isCompleted
                                ? '#1890ff'
                                : '#d9d9d9'
                            )
                            }`,

                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                          zIndex: 2,
                        }}
                      >

                        {isCompleted && (

                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#fff'
                            }}
                          />
                        )}

                      </div>

                      {index < orderStatuses.length - 1 && (

                        <div
                          style={{
                            width: 3,
                            height: 40,

                            backgroundColor:
                              isCompleted &&
                                index < currentStatusIndex
                                ? '#1890ff'
                                : '#d9d9d9',

                            marginTop: 4,
                          }}
                        />
                      )}

                    </div>

                    {/* TIMELINE CONTENT */}

                    <div
                      style={{
                        flex: 1,
                        paddingTop: 2,

                        paddingBottom:
                          index < orderStatuses.length - 1
                            ? 24
                            : 0
                      }}
                    >

                      <div
                        style={{
                          fontWeight:
                            isCurrent
                              ? 'bold'
                              : (
                                isCompleted
                                  ? 600
                                  : 400
                              ),

                          color:
                            isPending
                              ? '#999'
                              : '#000',

                          textTransform: 'capitalize',

                          fontSize: 14,
                        }}
                      >

                        {status}

                        {isCurrent && (

                          <span
                            style={{
                              color: '#52c41a',
                              marginLeft: 8,
                              fontSize: 12
                            }}
                          >
                            (Current)
                          </span>
                        )}

                      </div>

                      {trackingInfo && (

                        <div style={{ marginTop: 4 }}>

                          {trackingInfo.notes && (

                            <div
                              style={{
                                fontSize: 12,
                                color: '#666'
                              }}
                            >
                              {trackingInfo.notes}
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: 11,
                              color: '#999',
                              marginTop: 2
                            }}
                          >
                            {trackingInfo.date} {trackingInfo.time}
                          </div>

                        </div>
                      )}

                      {!trackingInfo &&
                        isCompleted &&
                        index < currentStatusIndex && (

                          <div
                            style={{
                              fontSize: 11,
                              color: '#999',
                              marginTop: 2
                            }}
                          >
                            Completed
                          </div>
                        )}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* STATUS UPDATE SECTION */}

          {canUpdateStatus && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                background: '#fafafa'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                  flexWrap: 'wrap'
                }}
              >

                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  Status:
                </span>

                <Select
                  value={newStatus}
                  onChange={setNewStatus}
                  style={{ width: 220 }}
                  size="small"
                >
                  <Option value="pending">
                    Pending
                  </Option>

                  <Option value="confirmed">
                    Confirmed
                  </Option>

                  <Option value="dispatched">
                    Dispatched
                  </Option>

                  <Option value="delivered">
                    Delivered
                  </Option>

                  <Option value="cancelled">
                    Cancelled
                  </Option>
                </Select>

              </div>

              <Input.TextArea
                size="small"
                placeholder="Add a note (optional)"
                value={statusNote}
                onChange={(e) =>
                  setStatusNote(e.target.value)
                }
                rows={3}
                style={{
                  marginBottom: 12
                }}
              />

              <Button
                type="primary"
                size="small"
                onClick={async () => {

                  const success =
                    await onStatusUpdate();

                  if (success) {
                    onCancel();
                  }
                }}
                loading={statusUpdateLoading}
              >
                Update Status
              </Button>

            </div>
          )}



        </div>
      )}

    </Modal>
  );
};

export default OrderTrackingModal;
