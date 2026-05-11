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
  Spin,
  Switch,
  Table
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminOrder, getCustomers } from '../../api/orders';
import { getAllProducts } from '../../api/products';

const { Option } = Select;
const { TextArea } = Input;

const ManualOrder = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [addressForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers('');
    fetchProducts();
  }, []);

  const fetchCustomers = async (search = '') => {
    setCustomersLoading(true);
    try {
      const result = await getCustomers(search);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      const transformedCustomers = result.customers?.map(customer => ({
        id: customer.id,
        name: `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || `Customer ${customer.id}`,
        email: customer.user?.email || 'N/A',
        phone: customer.user?.phone || 'N/A',
        addresses: customer.addresses || [],
      })) || [];

      setCustomers(transformedCustomers);
    } catch (error) {
      message.error('Failed to fetch customers: ' + error.message);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const result = await getAllProducts(50, null);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      const transformedProducts = result.products?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        stock: product.stock?.quantity || 0,
        status: product.isActive ? 'active' : 'inactive',
        category: product.category?.name || 'N/A',
        sku: product.sku || `PRD-${product.id}`,
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      message.error('Failed to fetch products: ' + error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
    setSelectedAddress(null);
    if (customer) {
      // Find default address or first address
      const defaultAddress = customer.addresses?.find(a => a.isDefault) || customer.addresses?.[0];
      setSelectedAddress(defaultAddress);
      const addressString = defaultAddress
        ? formatAddress(defaultAddress)
        : '';

      form.setFieldsValue({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        deliveryAddress: addressString,
      });
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    let parts = [address.name, address.phone, address.city, address.state, address.pincode];
    if (address.landmark) parts.push(`Landmark: ${address.landmark}`);
    return parts.filter(Boolean).join(', ');
  };

  const handleAddressSelect = (addressId) => {
    if (!selectedCustomer) return;
    const address = selectedCustomer.addresses?.find(a => a.id === addressId);
    setSelectedAddress(address);
    if (address) {
      form.setFieldsValue({
        deliveryAddress: formatAddress(address),
      });
    }
  };

  const handleAddNewAddress = async (values) => {
    if (!selectedCustomer) {
      message.error('Please select a customer first');
      return;
    }
    setAddAddressLoading(true);
    try {
      const { graphqlRequest } = await import('../../api/graphql');
      const data = await graphqlRequest(`
        mutation AddShippingAddress($name: String!, $phone: String!, $city: String!, $state: String!, $pincode: String!, $landmark: String, $isDefault: Boolean) {
          addShippingAddress(name: $name, phone: $phone, city: $city, state: $state, pincode: $pincode, landmark: $landmark, isDefault: $isDefault) {
            addressId
          }
        }
      `, {
        name: values.name,
        phone: values.phone,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        landmark: values.landmark || null,
        isDefault: values.isDefault || false,
      });

      if (data?.addShippingAddress?.addressId) {
        message.success('Address added successfully');
        setAddAddressModalVisible(false);
        addressForm.resetFields();
        // Refresh customers to get updated addresses
        fetchCustomers('');
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      message.error('Failed to add address: ' + error.message);
    } finally {
      setAddAddressLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productId: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId, field, value) => {
    const updatedItems = orderItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        if (field === 'productId') {
          const product = products.find(p => p.id.toString() === value.toString());
          if (product) {
            updatedItem.price = product.price; 
            updatedItem.total = product.price * updatedItem.quantity; 
          }
        } else if (field === 'quantity') {
          updatedItem.total = updatedItem.price * value;
        }

        return updatedItem;
      }
      return item;
    });
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (values) => {
    if (orderItems.length === 0) {
      message.error('Please add at least one item to the order');
      return;
    }

    if (!selectedCustomer) {
      message.error('Please select a customer');
      return;
    }

    if (!values.deliveryAddress) {
      message.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const itemsForMutation = orderItems.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity)
      }));

      const result = await createAdminOrder(
        parseInt(selectedCustomer.id),
        values.deliveryAddress,
        itemsForMutation
      );

      if (result.success && result.order) {
        const order = result.order;
        message.success(`Order ${order.orderNumber} created successfully! Customer: ${order.customerName}`);
        
        // Reset form
        form.resetFields();
        setSelectedCustomer(null);
        setOrderItems([]);

        // Navigate to orders list
        navigate('/orders/all');
      } else {
        message.error(result.message || 'Failed to create order');
      }
    } catch (error) {
      message.error('Failed to create order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handleCustomerSearch = (value) => {
    fetchCustomers(value);
  };

  const itemColumns = [
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
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      render: (price) => (
        <span style={{ color: '#000', fontWeight: '500' }}>
          {formatCurrency(price)}
        </span>
      ),
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
        />
      ),
    },
  ];

  return (
    <div>

      <Card
        title="Manual Order Entry"
        extra={
          <Button onClick={() => navigate('/orders/all')}>
            Back to Orders
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card title="Customer Information" size="small">
                
                <Form.Item label="Select Customer" required>
                  <Select
                    showSearch
                    placeholder="Type to search customers by name or email..."
                    filterOption={false}
                    onSearch={handleCustomerSearch}
                    onChange={handleCustomerSelect}
                    value={selectedCustomer ? selectedCustomer.id : undefined}
                    notFoundContent={customersLoading ? <Spin size="small" /> : null}
                    style={{ width: '100%' }}
                    allowClear
                    onClear={() => {
                      setSelectedCustomer(null);
                      form.resetFields(['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress']);
                    }}
                  >
                    {customers.map(c => (
                      <Option key={c.id} value={c.id}>
                        {c.name} {c.email !== 'N/A' ? `(${c.email})` : ''}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="customerName"
                  label="Customer Name"
                  rules={[{ required: true, message: 'Please enter customer name' }]}
                >
                  <Input placeholder="Enter customer name" />
                </Form.Item>

                <Form.Item
                  name="customerEmail"
                  label="Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                  name="customerPhone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>

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
                    >
                      Add New Address
                    </Button>
                  </Form.Item>
                )}

                <Form.Item
                  name="deliveryAddress"
                  label="Delivery Address"
                  rules={[{ required: true, message: 'Please enter delivery address' }]}
                >
                  <TextArea rows={3} placeholder="Enter delivery address" />
                </Form.Item>
              </Card>
            </Col>

          </Row>

          <Card title="Order Items" size="small">
            <div style={{ marginBottom: 16 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
                {/* <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchProducts}
                  loading={productsLoading}
                  size="small"
                  title="Refresh products"
                >
                  Refresh Products
                </Button> */}
              </Space>
            </div>

            <Table
              columns={itemColumns}
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
                loading={loading}
                size="large"
                icon={<ShoppingCartOutlined />}
              >
                Create Order
              </Button>
              <Button
                onClick={() => navigate('/orders/all')}
                size="large"
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

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
              }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addAddressLoading}
              >
                Add Address
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManualOrder;
