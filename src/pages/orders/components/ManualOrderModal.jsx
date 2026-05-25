import {
    HomeOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Table
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import AddCustomerModal from '../../../components/modals/AddCustomerModal';
import ShippingAddressModal from '../../../components/modals/ShippingAddressModal';
import useOrders from '../../../hooks/useOrders';

const { Option } = Select;
const { TextArea } = Input;

const buildEmptyItem = () => ({
  id: Date.now().toString(),
  productId: null,
  price: 0,
  discountPrice: 0,
  bulkPrice: 0,
  customPrice: null,
  quantity: 1,
  total: 0,
});

const ManualOrderModal = ({ visible, onClose, onOrderCreated }) => {
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderItems, setOrderItems] = useState([buildEmptyItem()]);
  const [orderType, setOrderType] = useState('normal');
  const [advanceBooking, setAdvanceBooking] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

  const {
    customers,
    customersLoading,
    fetchCustomers,
    products,
    productsLoading,
    fetchProducts,
    createOrder,
  } = useOrders();

  useEffect(() => {
    if (visible) {
      fetchCustomers('');
      fetchProducts();
      setOrderItems([buildEmptyItem()]);
      setSelectedCustomer(null);
      setSelectedAddress(null);
      setOrderType('normal');
      setAdvanceBooking(false);
      setDeliveryDate(null);
      form.resetFields();
    }
  }, [visible]);

  const formatAddress = (address) => {
    if (!address) return '';
    const parts = [address.name, address.phone, address.city, address.state, address.pincode];
    if (address.landmark) parts.push(`Landmark: ${address.landmark}`);
    return parts.filter(Boolean).join(', ');
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    setSelectedCustomer(customer);
    const defaultAddress = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
    setSelectedAddress(defaultAddress || null);

    form.setFieldsValue({
      customerName: customer.name,
      customerEmail: customer.email !== 'N/A' ? customer.email : '',
      customerPhone: customer.phone !== 'N/A' ? customer.phone : '',
      deliveryAddress: formatAddress(defaultAddress),
    });
  };

  const handleAddressSelect = (addressId) => {
    const address = selectedCustomer?.addresses?.find((a) => a.id === addressId);
    if (!address) return;
    setSelectedAddress(address);
    form.setFieldsValue({ deliveryAddress: formatAddress(address) });
  };

  const handleAddNewAddress = async (values) => {
    setAddAddressLoading(true);
    try {
      const newAddress = { id: Date.now().toString(), ...values };
      const updatedCustomer = {
        ...selectedCustomer,
        addresses: [...(selectedCustomer?.addresses || []), newAddress],
      };
      setSelectedCustomer(updatedCustomer);
      setSelectedAddress(newAddress);
      form.setFieldsValue({ deliveryAddress: formatAddress(newAddress) });
      message.success('Address added successfully');
      setAddAddressModalVisible(false);
      addressForm.resetFields();
    } catch (error) {
      message.error('Failed to add address: ' + error.message);
    } finally {
      setAddAddressLoading(false);
    }
  };

  const getItemUnitPrice = (item, type = orderType) => {
    const actualPrice = parseFloat(item.price || 0);
    const discountPrice = parseFloat(item.discountPrice || 0);
    const bulkPrice = parseFloat(item.bulkPrice || 0) || (discountPrice > 0 ? discountPrice : actualPrice);
    const customPrice = parseFloat(item.customPrice || 0);

    if (type === 'bulk') return bulkPrice;
    if (type === 'custom') return customPrice > 0 ? customPrice : actualPrice;
    return discountPrice > 0 && discountPrice < actualPrice ? discountPrice : actualPrice;
  };

  const calculateItemTotal = (item, type = orderType) => {
    const unitPrice = getItemUnitPrice(item, type);
    return (unitPrice || 0) * (item.quantity || 1);
  };

  const handleAddItem = () => {
    setOrderItems((prev) => [...prev, buildEmptyItem()]);
  };

  const handleRemoveItem = (itemId) => {
    if (orderItems.length === 1) {
      message.warning('At least one item is required');
      return;
    }
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleItemChange = (itemId, field, value) => {
    setOrderItems((prev) => prev.map((item) => {
      if (item.id !== itemId) return item;
      const updatedItem = { ...item, [field]: value };

      if (field === 'productId') {
        const product = products.find((p) => p.id?.toString() === value?.toString());
        updatedItem.price = parseFloat(product?.price || 0);
        updatedItem.discountPrice = parseFloat(product?.discountPrice || 0);
        updatedItem.bulkPrice = parseFloat(product?.bulkPrice || product?.discountPrice || product?.price || 0);
        updatedItem.customPrice = null;
      }

      updatedItem.total = calculateItemTotal(updatedItem, orderType);
      return updatedItem;
    }));
  };

  const calculateTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
    [orderItems]
  );

  const formatCurrency = (amount) => `₹${(amount || 0).toFixed(2)}`;

  const handleSubmit = async (values) => {
    if (!selectedCustomer) {
      message.error('Please select a customer');
      return;
    }

    const validItems = orderItems.filter((item) => item.productId && item.quantity > 0);
    if (!validItems.length) {
      message.error('Please add at least one valid item');
      return;
    }

    setLoading(true);
    try {
      const items = validItems.map((item) => ({
        productId: parseInt(item.productId, 10),
        quantity: item.quantity,
      }));
      const result = await createOrder(selectedCustomer.id, values.deliveryAddress, items);

      if (result.success) {
        message.success('Order created successfully');
        onOrderCreated?.();
        onClose();
      }
    } catch (error) {
      message.error('Failed to create order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    const validImage = product?.images?.find((img) => img.image && img.image.trim() !== '');
    if (!validImage) return null;
    return validImage.image.startsWith('data:')
      ? validImage.image
      : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
  };

  const handleCustomerSearch = (value) => {
    fetchCustomers(value);
  };

  return (
    <>
      <Modal
        title="Take Manual Order"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Card title="Customer Information" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Select Customer" required>
                  <Space style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Select
                      showSearch
                      placeholder="Type to search customers by name or email..."
                      filterOption={false}
                      onSearch={handleCustomerSearch}
                      onChange={handleCustomerSelect}
                      value={selectedCustomer?.id}
                      notFoundContent={customersLoading ? <span>Loading...</span> : null}
                      style={{ flex: 1 }}
                      allowClear
                      onClear={() => {
                        setSelectedCustomer(null);
                        setSelectedAddress(null);
                        form.resetFields(['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress']);
                      }}
                    >
                      {customers.map((customer) => (
                        <Option key={customer.id} value={customer.id}>
                          {customer.name} {customer.email !== 'N/A' ? `(${customer.email})` : ''}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setAddCustomerModalVisible(true)}
                      size="small"
                    >
                      Add New
                    </Button>
                  </Space>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="customerName"
                  label="Customer Name"
                  rules={[{ required: true, message: 'Please enter customer name' }]}
                >
                  <Input placeholder="Enter customer name" disabled={!!selectedCustomer} />
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
                  <Input placeholder="Enter email address" disabled={!!selectedCustomer} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="customerPhone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" disabled={!!selectedCustomer} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                {selectedCustomer && selectedCustomer.addresses?.length > 0 ? (
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
                      {selectedCustomer.addresses.map((addr) => (
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
                ) : selectedCustomer ? (
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
                ) : null}
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="deliveryAddress"
                  label="Delivery Address"
                  rules={[{ required: true, message: 'Please enter delivery address' }]}
                >
                  <TextArea rows={2} placeholder="Enter delivery address" disabled={!!selectedCustomer} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col xs={24} md={12}>
                <Form.Item label="Advance Booking">
                  <Switch
                    checked={advanceBooking}
                    onChange={(checked) => {
                      setAdvanceBooking(checked);
                      if (!checked) {
                        setDeliveryDate(null);
                        form.setFieldsValue({ deliveryDate: null });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              {advanceBooking && (
                <Col xs={24} md={12}>
                  <Form.Item
                    name="deliveryDate"
                    label="Delivery Date"
                    rules={[{ required: true, message: 'Please select delivery date' }]}
                  >
                    <Input
                      type="date"
                      value={deliveryDate ? deliveryDate.format('YYYY-MM-DD') : undefined}
                      onChange={(event) => setDeliveryDate(event.target.value ? dayjs(event.target.value) : null)}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="Order Items" size="small" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 16, alignItems: 'center' }}>
              <Col xs={24} sm={12}>
                <Form.Item label="Order Type" name="orderType" initialValue={orderType}>
                  <Select value={orderType} onChange={(value) => setOrderType(value)}>
                    <Option value="normal">Normal Order</Option>
                    <Option value="bulk">Bulk Order</Option>
                    <Option value="custom">Custom Order</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem} size="small">
                  Add Item
                </Button>
              </Col>
            </Row>

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
                      optionLabelProp="label"
                      filterOption={(input, option) =>
                        option?.label?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {products.filter((p) => p.status === 'active').map((product) => {
                        const imageSrc = getProductImage(product);
                        return (
                          <Option key={product.id} value={product.id} label={product.name}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f5f5f5', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {imageSrc ? (
                                  <img src={imageSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <span style={{ fontSize: 18, color: '#999' }}>📦</span>
                                )}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>Stock: {product.stock?.quantity ?? 0}</div>
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  ),
                },
                {
                  title: orderType === 'bulk' ? 'Bulk Price' : orderType === 'custom' ? 'Custom Price' : 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price, record) => {
                    const actualPrice = parseFloat(price || 0);
                    const discountPrice = parseFloat(record.discountPrice || 0);
                    const bulkPrice = parseFloat(record.bulkPrice || 0) || (discountPrice > 0 ? discountPrice : actualPrice);
                    const hasDiscount = discountPrice > 0 && discountPrice < actualPrice;

                    if (orderType === 'bulk') {
                      return <span>{formatCurrency(bulkPrice)}</span>;
                    }

                    if (orderType === 'custom') {
                      return (
                        <InputNumber
                          min={0}
                          value={record.customPrice != null ? record.customPrice : actualPrice}
                          onChange={(value) => handleItemChange(record.id, 'customPrice', value)}
                          style={{ width: '100%' }}
                        />
                      );
                    }

                    return hasDiscount ? (
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{formatCurrency(discountPrice)}</div>
                        <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>{formatCurrency(actualPrice)}</div>
                      </div>
                    ) : (
                      <span>{formatCurrency(actualPrice)}</span>
                    );
                  },
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
                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => handleRemoveItem(record.id)} size="small" />
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
                  <div style={{ fontSize: 16, marginBottom: 8 }}>
                    Total Amount: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{formatCurrency(calculateTotal)}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="small" icon={<ShoppingCartOutlined />}>
                Create Order
              </Button>
              <Button onClick={onClose} size="small">Cancel</Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <ShippingAddressModal
        open={addAddressModalVisible}
        onCancel={() => {
          setAddAddressModalVisible(false);
          addressForm.resetFields();
        }}
        onSubmit={handleAddNewAddress}
        form={addressForm}
        loading={addAddressLoading}
      />

      <AddCustomerModal
        open={addCustomerModalVisible}
        onCancel={() => setAddCustomerModalVisible(false)}
        onSuccess={(customer) => {
          setAddCustomerModalVisible(false);
          fetchCustomers('');
          if (customer?.id) handleCustomerSelect(customer.id);
        }}
      />
    </>
  );
};

export default ManualOrderModal;
