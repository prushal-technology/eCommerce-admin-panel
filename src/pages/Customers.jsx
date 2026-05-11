import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Spin, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddCustomerModal from '../components/modals/AddCustomerModal';

const { Search } = Input;
const { Option } = Select;

const Customers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const tableContainerRef = useRef(null);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const isFirstRender = useRef(true);

  // Load customers on mount
  useEffect(() => {
    loadCustomers(null, true);
  }, []);

  // Re-fetch customers when search changes (with debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      loadCustomers(null, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Infinite scroll handler
  useEffect(() => {
    const tableBody = tableContainerRef.current?.querySelector('.ant-table-body');
    if (tableBody) {
      const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
          if (hasMore && !loading && !fetchingMore) {
            loadCustomers(nextCursor, false);
          }
        }
      };

      tableBody.addEventListener('scroll', handleScroll);
      return () => tableBody.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading, fetchingMore, nextCursor]);

  const loadCustomers = async (cursor = null, isNewSearch = false) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setFetchingMore(true);
    }
    setError(null);

    try {
      const search = searchText ? searchText : null;
      
      // Build query with optional search and cursor
      let queryArgs = 'first: 10';
      if (cursor) queryArgs += `, after: "${cursor}"`;
      if (search) queryArgs += `, search: "${search}"`;

      const response = await fetch(import.meta.env.VITE_GRAPHQL_URI || 'http://192.168.1.40:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if available
          ...(localStorage.getItem('authToken') && {
            'Authorization': `JWT ${localStorage.getItem('authToken')}`
          })
        },
        body: JSON.stringify({
          query: `
            query {
              customers(${queryArgs}) {
                customers {
                  id
                  user {
                    firstName
                    lastName
                    email
                    phone
                  }
                }
                nextCursor
                hasMore
              }
            }
          `
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Transform GraphQL data to match component structure
      const customerData = result.data?.customers?.customers || [];
      const transformedCustomers = customerData.map(customer => ({
        id: customer.id,
        customerId: customer.id,
        firstName: customer.user?.firstName || '',
        lastName: customer.user?.lastName || '',
        email: customer.user?.email || 'N/A',
        phone: customer.user?.phone || null,
        fullName: `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || 'N/A',
      }));

      if (isNewSearch) {
        setCustomers(transformedCustomers);
      } else {
        setCustomers(prev => {
          const newIds = new Set(transformedCustomers.map(c => c.id));
          const filteredPrev = prev.filter(c => !newIds.has(c.id));
          return [...filteredPrev, ...transformedCustomers];
        });
      }
      
      setNextCursor(result.data?.customers?.nextCursor);
      setHasMore(result.data?.customers?.hasMore);
    } catch (error) {
      setError(error.message);
      message.error('Failed to load customers: ' + error.message);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Customer',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <span style={{ color: phone ? '#1890ff' : '#999' }}>
          {phone || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <span style={{ color: email === 'N/A' ? '#999' : '#1890ff' }}>
          {email}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete Customer"
            description="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsAddCustomerModalVisible(true);
  };

  const handleAddCustomerSuccess = () => {
    loadCustomers(null, true); // Refresh customers list
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(import.meta.env.VITE_GRAPHQL_URI || 'http://192.168.1.40:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('authToken') && {
            'Authorization': `JWT ${localStorage.getItem('authToken')}`
          })
        },
        body: JSON.stringify({
          query: `
            mutation {
              deleteCustomer(id: ${parseInt(id)}) {
                ok
              }
            }
          `
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Check deleteCustomer response (backend returns null on successful delete)
      if (result.data?.deleteCustomer?.ok === true || result.data?.deleteCustomer === null) {
        setCustomers(customers.filter(customer => customer.id !== id));
        message.success('Customer deleted successfully');
      } else if (result.data?.deleteCustomer?.ok === false) {
        message.error('Delete operation failed - customer may not exist');
      } else {
        message.error('Unexpected response from server');
      }
    } catch (error) {
      message.error('Failed to delete customer: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCustomer) {
        // Update existing customer via GraphQL
        const response = await fetch(import.meta.env.VITE_GRAPHQL_URI , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') && {
              'Authorization': `JWT ${localStorage.getItem('authToken')}`
            })
          },
          body: JSON.stringify({
            query: `
              mutation {
                updateCustomer(
                  id: ${editingCustomer.id},
                  firstName: "${values.firstName || ''}",
                  lastName: "${values.lastName || ''}",
                  phone: "${values.phone || ''}"
                ) {
                  customer {
                    id
                  }
                }
              }
            `
          })
        });

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data?.updateCustomer?.customer) {
          // Update local state
          const updatedCustomers = customers.map(customer =>
            customer.id === editingCustomer.id
              ? { 
                  ...customer, 
                  firstName: values.firstName,
                  lastName: values.lastName,
                  fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim() || 'N/A'
                }
              : customer
          );
          setCustomers(updatedCustomers);
          message.success('Customer updated successfully');
          setIsModalVisible(false);
          form.resetFields();
        } else {
          message.error('Failed to update customer');
        }
      } else {
        // Create new customer - local only for now
        const newCustomer = {
          id: Date.now().toString(),
          customerId: values.customerId,
          email: values.email || 'N/A',
        };
        setCustomers([newCustomer, ...customers]);
        message.success('Customer created successfully');
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      message.error('Error saving customer: ' + error.message);
    }
  };

  return (
    <Card 
      title="Customers Management"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadCustomers(null, true)}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Customer
          </Button>
        </Space>
      }
    >
      

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search customers by name or email..."
          allowClear
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>

      <div ref={tableContainerRef}>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={{
            spinning: loading || fetchingMore,
            indicator: <Spin size="large" />,
            tip: loading ? "Loading customers..." : "Loading more customers..."
          }}
          pagination={false}
          scroll={{ x: 'max-content', y: 500 }}
          locale={{
            emptyText: loading ? '' : 'No customers found'
          }}
        />
        
        {/* No more data indicator at bottom */}
        {!hasMore && customers.length > 0 && !loading && !fetchingMore && (
          <div style={{ 
            textAlign: "center", 
            padding: "10px",
            color: '#999',
            fontSize: '12px',
            borderTop: '1px solid #f0f0f0'
          }}>
            No more customers to load
          </div>
        )}
      </div>

      <Modal
        title="Edit Customer"
        open={isModalVisible && editingCustomer}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input placeholder="John" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder="Doe" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: false, message: 'Please enter phone number' },
              { pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' }
            ]}
          >
            <Input placeholder="9999999999" maxLength={10} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <AddCustomerModal
        open={isAddCustomerModalVisible}
        onCancel={() => setIsAddCustomerModalVisible(false)}
        onSuccess={handleAddCustomerSuccess}
      />
    </Card>
  );
};

export default Customers;
