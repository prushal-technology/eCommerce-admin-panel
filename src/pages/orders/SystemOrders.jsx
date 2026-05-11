import {
  EyeOutlined,
  HomeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Table,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createAdminOrder, getCustomers, updateOrderStatus } from '../../api/orders';
import { getAllProducts } from '../../api/products';
import AddCustomerModal from '../../components/modals/AddCustomerModal';
import { GET_SYSTEM_ORDERS } from '../../graphql/queries';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const { TextArea } = Input;

const SystemOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Order detail modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Tracking modal states
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);

  // Manual Order Modal States
  const [manualOrderVisible, setManualOrderVisible] = useState(false);
  const [manualOrderForm] = Form.useForm();
  const [manualOrderLoading, setManualOrderLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [addressForm] = Form.useForm();
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { graphqlRequest } = await import('../../api/graphql');
      const data = await graphqlRequest(GET_SYSTEM_ORDERS);
      setOrders(data.allOrders || []);
    } catch (error) {
      message.error('Failed to load orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersForOrder = async (search = '') => {
    setCustomersLoading(true);
    try {
      const result = await getCustomers(search);
      if (!result.success) throw new Error(result.message);
      const formattedCustomers = result.customers?.map(c => ({
        id: c.id,
        name: `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || `Customer ${c.id}`,
        email: c.user?.email || 'N/A',
        phone: c.user?.phone || 'N/A',
        addresses: c.addresses || []
      })) || [];
      setCustomers(formattedCustomers);
    } catch (error) {
      message.error('Failed to fetch customers: ' + error.message);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchProductsForOrder = async () => {
    setProductsLoading(true);
    try {
      const data = await getAllProducts(100);
      setProducts(data.products || []);
    } catch (error) {
      message.error('Failed to fetch products: ' + error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenManualOrder = () => {
    setManualOrderVisible(true);
    fetchCustomersForOrder();
    fetchProductsForOrder();
    setOrderItems([{ id: Date.now(), productId: null, price: 0, quantity: 1, total: 0 }]);
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      const defaultAddress = customer.addresses?.find(a => a.isDefault) || customer.addresses?.[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        manualOrderForm.setFieldsValue({
          customerName: customer.name,
          customerEmail: customer.email !== 'N/A' ? customer.email : '',
          customerPhone: customer.phone !== 'N/A' ? customer.phone : '',
          deliveryAddress: formatAddress(defaultAddress)
        });
      } else {
        manualOrderForm.setFieldsValue({
          customerName: customer.name,
          customerEmail: customer.email !== 'N/A' ? customer.email : '',
          customerPhone: customer.phone !== 'N/A' ? customer.phone : ''
        });
      }
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.name || ''}, ${addr.phone || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}${addr.landmark ? ', Landmark: ' + addr.landmark : ''}`;
  };

  const handleAddressSelect = (addressId) => {
    const address = selectedCustomer.addresses?.find(a => a.id === addressId);
    if (address) {
      setSelectedAddress(address);
      manualOrderForm.setFieldsValue({
        deliveryAddress: formatAddress(address)
      });
    }
  };

  const handleAddNewAddress = async (values) => {
    setAddAddressLoading(true);
    try {
      const newAddress = {
        id: Date.now(),
        ...values
      };

      setSelectedCustomer(prev => ({
        ...prev,
        addresses: [...(prev.addresses || []), newAddress]
      }));

      setSelectedAddress(newAddress);
      manualOrderForm.setFieldsValue({
        deliveryAddress: formatAddress(newAddress)
      });

      message.success('Address added successfully');
      setAddAddressModalVisible(false);
      addressForm.resetFields();
    } catch (error) {
      message.error('Failed to add address: ' + error.message);
    } finally {
      setAddAddressLoading(false);
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: Date.now(), productId: null, price: 0, quantity: 1, total: 0 }]);
  };

  const handleRemoveItem = (itemId) => {
    if (orderItems.length === 1) {
      message.warning('At least one item is required');
      return;
    }
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId, field, value) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'productId') {
          const product = products.find(p => p.id.toString() === value);
          updatedItem.price = product?.price || 0;
        }
        updatedItem.total = (updatedItem.price || 0) * (updatedItem.quantity || 1);
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const formatCurrency = (amount) => {
    return '₹' + (amount || 0).toFixed(2);
  };

  const handleManualOrderSubmit = async (values) => {
    if (!selectedCustomer) {
      message.error('Please select a customer');
      return;
    }

    const validItems = orderItems.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      message.error('Please add at least one valid item');
      return;
    }

    setManualOrderLoading(true);
    try {
      const items = validItems.map(item => ({
        productId: parseInt(item.productId),
        quantity: item.quantity
      }));

      await createAdminOrder(selectedCustomer.id, values.deliveryAddress, items);
      message.success('Order created successfully');
      setManualOrderVisible(false);
      manualOrderForm.resetFields();
      setSelectedCustomer(null);
      setOrderItems([]);
      loadOrders();
    } catch (error) {
      message.error('Failed to create order: ' + error.message);
    } finally {
      setManualOrderLoading(false);
    }
  };

  const handleAddCustomerSuccess = (customer) => {
    fetchCustomersForOrder();
    handleCustomerSelect(customer.id);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, newStatus, statusNote);
      message.success('Order status updated successfully');
      loadOrders();
      setDetailModalVisible(false);
    } catch (error) {
      message.error('Failed to update status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      dispatched: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setDetailModalVisible(true);
  };

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setTrackingModalVisible(true);
    setTrackingLoading(true);
    try {
      const { graphqlRequest } = await import('../../api/graphql');
      const data = await graphqlRequest(`
        query GetOrderTracking($orderId: Int!) {
          orderTracking(orderId: $orderId) {
            status
            notes
            updatedAt
            date
            time
          }
        }
      `, { orderId: parseInt(order.id) });
      setTrackingData(data.orderTracking || []);
    } catch (error) {
      message.error('Failed to fetch tracking: ' + error.message);
      setTrackingData([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleExport = () => {
    message.info('Export feature coming soon');
  };

  const handlePrint = () => {
    message.info('Print feature coming soon');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) || order.id.toString().includes(searchText);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const orderDate = dayjs(order.createdAt);
      matchesDate = orderDate.isAfter(dateRange[0].startOf('day')) &&
        orderDate.isBefore(dateRange[1].endOf('day'));
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'dispatched').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.finalAmount || 0), 0),
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber) => <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>,
    },
    {
      title: 'Products',
      dataIndex: 'items',
      key: 'products',
      render: (items) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items?.map((item, index) => {
            const product = item.product;
            const validImage = product?.images && product.images.length > 0
              ? product.images.find(img => img.image && img.image.trim() !== '')
              : null;
            const imageSrc = validImage
              ? (validImage.image.startsWith('data:')
                ? validImage.image
                : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`)
              : null;

            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={product?.name}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: 40, height: 40, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
                    <span style={{ fontSize: '10px', color: '#999' }}>No Img</span>
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{product?.name || 'Unknown Product'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity}</div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <span style={{ fontWeight: 'bold' }}>₹{parseFloat(amount || 0).toFixed(2)}</span>,
      sorter: (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customerName',
      render: (customer) => (
        <span style={{ fontWeight: 500 }}>
          {customer?.firstName} {customer?.lastName}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM D, YYYY h:mm A'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Dispatched', value: 'dispatched' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="default"
            size="small"
            icon={<TruckOutlined />}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
            onClick={() => handleTrackOrder(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Order Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orderStats.total}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Pending"
              value={orderStats.pending}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Dispatched"
              value={orderStats.processing}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Delivered"
              value={orderStats.delivered}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={orderStats.cancelled}
              styles={{ content: { color: '#ff4d4f' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Revenue"
              value={orderStats.totalRevenue}
              prefix="₹"
              precision={2}
              styles={{ content: { color: '#722ed1' } }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="System Orders (Panel)"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenManualOrder} size="small">
              Take Order
            </Button>
            
            <Button icon={<PrinterOutlined />} onClick={handlePrint} size="small">
              Print
            </Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search orders..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="dispatched">Dispatched</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD-MM-YYYY"
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          size="small"
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>Name:</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer?.phone || 'N/A'}</p>
                </Col>
                <Col span={12}>
                  <p><strong>Shipping Address:</strong></p>
                  <p style={{ color: '#666', fontSize: 13 }}>
                    {selectedOrder.shippingAddress || 'N/A'}
                  </p>
                </Col>
              </Row>
            </Card>

            <Card title="Order Summary" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Date:</strong> {dayjs(selectedOrder.createdAt).format('MMMM D, YYYY h:mm A')}</p>
                </Col>
                <Col span={12}>
                  <p><strong>Total Amount:</strong> ₹{parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <strong>Status:</strong>
                    <Select
                      value={newStatus}
                      onChange={setNewStatus}
                      style={{ width: 130 }}
                      size="small"
                    >
                      <Option value="pending">Pending</Option>
                      <Option value="confirmed">Confirmed</Option>
                      <Option value="dispatched">Dispatched</Option>
                      <Option value="delivered">Delivered</Option>
                      <Option value="cancelled">Cancelled</Option>
                    </Select>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Input.TextArea
                      size="small"
                      placeholder="Add a note (optional)"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={2}
                    />
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginTop: 8 }}
                      onClick={handleStatusUpdate}
                    >
                      Update Status
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Order Items" size="small" style={{ marginBottom: 16 }}>
              <div>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {(() => {
                        const validImage = item.product?.images && item.product.images.length > 0
                          ? item.product.images.find(img => img.image && img.image.trim() !== '')
                          : null;

                        const imageSrc = validImage
                          ? (validImage.image.startsWith('data:')
                            ? validImage.image
                            : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`)
                          : undefined;

                        return imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.product?.name || 'Product'}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0' }}>
                            <span style={{ fontSize: '10px', color: '#999' }}>No Img</span>
                          </div>
                        );
                      })()}
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.product?.name || 'Unknown Product'}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Qty: {item.quantity}
                          {item.product?.measureValue && item.product?.unit && ` (${item.product.measureValue} ${item.product.unit})`}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: '2px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                <span>Total Amount:</span>
                <span>₹{parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Order Tracking Modal */}
      <Modal
        title={`Order Tracking - ${selectedOrder?.orderNumber || selectedOrder?.id}`}
        open={trackingModalVisible}
        onCancel={() => setTrackingModalVisible(false)}
        footer={null}
        width={500}
      >
        {trackingLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Loading tracking data...</p>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: 32, padding: '0 16px' }}>
              {(() => {
                const orderStatuses = ['pending', 'confirmed', 'dispatched', 'delivered'];
                const currentStatusIndex = orderStatuses.indexOf(selectedOrder?.status?.toLowerCase() || 'pending');

                return (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {orderStatuses.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isPending = index > currentStatusIndex;
                      const trackingInfo = trackingData?.find(t => t.status?.toLowerCase() === status);

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
                                <div style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#fff',
                                }} />
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
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Order Modal */}
      <Modal
        title="Take Manual Order"
        open={manualOrderVisible}
        onCancel={() => setManualOrderVisible(false)}
        footer={null}
        width={900}
      >
        <Form
          form={manualOrderForm}
          layout="vertical"
          onFinish={handleManualOrderSubmit}
        >
          <Card title="Customer Information" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Select Customer" required>
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      showSearch
                      placeholder="Type to search customers by name or email..."
                      filterOption={false}
                      onSearch={(value) => fetchCustomersForOrder(value)}
                      onChange={handleCustomerSelect}
                      value={selectedCustomer ? selectedCustomer.id : undefined}
                      notFoundContent={customersLoading ? <Spin size="small" /> : null}
                      style={{ width: 'calc(100% - 120px)' }}
                      allowClear
                      onClear={() => {
                        setSelectedCustomer(null);
                        manualOrderForm.resetFields(['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress']);
                      }}
                    >
                      {customers.map(c => (
                        <Option key={c.id} value={c.id}>
                          {c.name} {c.email !== 'N/A' ? `(${c.email})` : ''}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setAddCustomerModalVisible(true)}
                      style={{ width: '120px' }}
                      size="small"
                    >
                      Add New
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="customerName"
                  label="Customer Name"
                  rules={[{ required: true, message: 'Please enter customer name' }]}
                >
                  <Input placeholder="Enter customer name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="customerEmail"
                  label="Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="customerPhone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                {selectedCustomer && selectedCustomer.addresses?.length > 0 && (
                  <Form.Item label="Select Address">
                    <Select
                      placeholder="Select delivery address"
                      value={selectedAddress?.id}
                      onChange={handleAddressSelect}
                      style={{ width: '100%' }}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider style={{ margin: '8px 0' }} />
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setAddAddressModalVisible(true)}
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                            size="small"
                          >
                            Add New Address
                          </Button>
                        </>
                      )}
                    >
                      {selectedCustomer.addresses.map(addr => (
                        <Option key={addr.id} value={addr.id}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HomeOutlined />
                            <span>{addr.city}, {addr.state} - {addr.pincode}</span>
                            {addr.isDefault && <span style={{ color: '#52c41a', fontSize: 12 }}>(Default)</span>}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                {selectedCustomer && (!selectedCustomer.addresses || selectedCustomer.addresses.length === 0) && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setAddAddressModalVisible(true)}
                      style={{ width: '100%' }}
                      size="small"
                    >
                      Add New Address
                    </Button>
                  </Form.Item>
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="deliveryAddress"
                  label="Delivery Address"
                  rules={[{ required: true, message: 'Please enter delivery address' }]}
                >
                  <TextArea rows={2} placeholder="Enter delivery address" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Order Items" size="small" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddItem}
                size="small"
              >
                Add Item
              </Button>
            </div>

            <Table
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'productId',
                  key: 'productId',
                  render: (productId, record) => (
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select product"
                      value={productId}
                      onChange={(value) => handleItemChange(record.id, 'productId', value)}
                      showSearch
                      filterOption={(input, option) =>
                        option.children.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {products.filter(p => p.status === 'active').map(product => (
                        <Option key={product.id} value={product.id.toString()}>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              SKU: {product.sku} | ID: {product.id}
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  ),
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => <span>{formatCurrency(price)}</span>,
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  render: (quantity, record) => (
                    <InputNumber
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={(value) => handleItemChange(record.id, 'quantity', value)}
                      style={{ width: 80 }}
                    />
                  ),
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  key: 'total',
                  render: (total) => <span style={{ fontWeight: 'bold' }}>{formatCurrency(total)}</span>,
                },
                {
                  title: 'Action',
                  key: 'action',
                  render: (_, record) => (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => handleRemoveItem(record.id)}
                      size="small"
                    />
                  ),
                },
              ]}
              dataSource={orderItems}
              pagination={false}
              size="small"
              rowKey="id"
            />

            <Divider />

            <Row justify="end">
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', marginBottom: 8 }}>
                    Total Amount: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={manualOrderLoading}
                size="small"
                icon={<ShoppingCartOutlined />}
              >
                Create Order
              </Button>
              <Button
                onClick={() => setManualOrderVisible(false)}
                size="small"
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Add New Address Modal */}
      <Modal
        title="Add New Shipping Address"
        open={addAddressModalVisible}
        onCancel={() => {
          setAddAddressModalVisible(false);
          addressForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddNewAddress}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: 'Please enter pincode' }]}
          >
            <Input placeholder="Enter pincode" />
          </Form.Item>

          <Form.Item
            name="landmark"
            label="Landmark (Optional)"
          >
            <Input placeholder="Enter landmark (e.g., Near mall, Opposite school)" />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
          >
            <Switch checkedChildren="Default" unCheckedChildren="Set as Default" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setAddAddressModalVisible(false);
                addressForm.resetFields();
              }} size="small">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addAddressLoading}
                size="small"
              >
                Add Address
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add New Customer Modal */}
      <AddCustomerModal
        open={addCustomerModalVisible}
        onCancel={() => setAddCustomerModalVisible(false)}
        onSuccess={handleAddCustomerSuccess}
      />
    </div>
  );
};

export default SystemOrders;
