import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,

  TruckOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag
} from 'antd';
import { useEffect, useState } from 'react';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Delivery = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [form] = Form.useForm();

  // Mock delivery partners data
  const mockPartners = [
    {
      id: '1',
      name: 'Express Delivery',
      email: 'contact@expressdelivery.com',
      phone: '+1 234-567-1001',
      status: 'active',
      activeOrders: 12,
      totalDeliveries: 456,
      rating: 4.8,
      serviceAreas: ['New York', 'Los Angeles', 'Chicago'],
      joinDate: '2024-01-15',
      lastDelivery: '2024-03-20',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Van',
      maxCapacity: 50,
      currentLoad: 12,
    },
    {
      id: '2',
      name: 'Quick Ship',
      email: 'info@quickship.com',
      phone: '+1 234-567-1002',
      status: 'active',
      activeOrders: 8,
      totalDeliveries: 324,
      rating: 4.6,
      serviceAreas: ['Houston', 'Phoenix', 'Philadelphia'],
      joinDate: '2024-01-20',
      lastDelivery: '2024-03-19',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Motorcycle',
      maxCapacity: 20,
      currentLoad: 8,
    },
    {
      id: '3',
      name: 'Local Express',
      email: 'support@localexpress.com',
      phone: '+1 234-567-1003',
      status: 'active',
      activeOrders: 15,
      totalDeliveries: 189,
      rating: 4.9,
      serviceAreas: ['San Antonio', 'San Diego'],
      joinDate: '2024-02-01',
      lastDelivery: '2024-03-20',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Truck',
      maxCapacity: 100,
      currentLoad: 15,
    },
    {
      id: '4',
      name: 'Speedy Delivery',
      email: 'hello@speedydelivery.com',
      phone: '+1 234-567-1004',
      status: 'inactive',
      activeOrders: 0,
      totalDeliveries: 78,
      rating: 4.2,
      serviceAreas: ['Dallas', 'Austin'],
      joinDate: '2024-02-15',
      lastDelivery: '2024-03-10',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Van',
      maxCapacity: 40,
      currentLoad: 0,
    },
    {
      id: '5',
      name: 'Metro Courier',
      email: 'contact@metrocourier.com',
      phone: '+1 234-567-1005',
      status: 'active',
      activeOrders: 6,
      totalDeliveries: 267,
      rating: 4.7,
      serviceAreas: ['Seattle', 'Portland'],
      joinDate: '2024-01-25',
      lastDelivery: '2024-03-18',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Bicycle',
      maxCapacity: 10,
      currentLoad: 6,
    },
    {
      id: '6',
      name: 'National Logistics',
      email: 'info@nationallogistics.com',
      phone: '+1 234-567-1006',
      status: 'active',
      activeOrders: 20,
      totalDeliveries: 892,
      rating: 4.5,
      serviceAreas: ['Miami', 'Atlanta', 'Boston'],
      joinDate: '2024-01-10',
      lastDelivery: '2024-03-20',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
      vehicleType: 'Truck',
      maxCapacity: 150,
      currentLoad: 20,
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPartners(mockPartners);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingPartner(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPartner(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setPartners(partners.filter(p => p.id !== id));
      message.success('Delivery partner deleted successfully');
    } catch (error) {
      message.error('Failed to delete delivery partner');
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      const newStatus = record.status === 'active' ? 'inactive' : 'active';
      setPartners(partners.map(p => 
        p.id === record.id ? { ...p, status: newStatus } : p
      ));
      message.success(`Delivery partner ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      message.error('Failed to update partner status');
    }
  };

  const handleAssignOrder = (partner) => {
    message.info(`Assign order to ${partner.name} - Feature coming soon`);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPartner) {
        setPartners(partners.map(p => 
          p.id === editingPartner.id ? { ...p, ...values } : p
        ));
        message.success('Delivery partner updated successfully');
      } else {
        const newPartner = {
          id: Date.now().toString(),
          ...values,
          activeOrders: 0,
          totalDeliveries: 0,
          rating: 0,
          joinDate: new Date().toISOString().split('T')[0],
          lastDelivery: null,
          avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A34LMPVMOnh5od0M+5IQ==',
          currentLoad: 0,
        };
        setPartners([...partners, newPartner]);
        message.success('Delivery partner added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save delivery partner');
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         partner.phone.includes(searchText);
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red';
  };

  const getLoadPercentage = (partner) => {
    return Math.round((partner.currentLoad / partner.maxCapacity) * 100);
  };

  const getLoadColor = (percentage) => {
    if (percentage >= 90) return '#ff4d4f';
    if (percentage >= 70) return '#faad14';
    return '#52c41a';
  };

  const partnerStats = {
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    inactive: partners.filter(p => p.status === 'inactive').length,
    totalActiveOrders: partners.reduce((sum, p) => sum + p.activeOrders, 0),
    totalDeliveries: partners.reduce((sum, p) => sum + p.totalDeliveries, 0),
    avgRating: (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1),
  };

  const columns = [
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<TruckOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Active Orders',
      dataIndex: 'activeOrders',
      key: 'activeOrders',
      render: (orders, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{orders}</div>
          <Progress 
            percent={getLoadPercentage(record)} 
            size="small" 
            strokeColor={getLoadColor(getLoadPercentage(record))}
            showInfo={false}
          />
          <div style={{ fontSize: '11px', color: '#666' }}>
            {record.currentLoad}/{record.maxCapacity} capacity
          </div>
        </div>
      ),
      sorter: (a, b) => a.activeOrders - b.activeOrders,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Rating: </span>
            <Tag color="blue">{record.rating} ⭐</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Total: {record.totalDeliveries} deliveries
          </div>
        </div>
      ),
    },
    {
      title: 'Service Areas',
      dataIndex: 'serviceAreas',
      key: 'serviceAreas',
      render: (areas) => (
        <div>
          {areas.slice(0, 2).map((area, index) => (
            <Tag key={index} size="small">{area}</Tag>
          ))}
          {areas.length > 2 && (
            <Tag size="small">+{areas.length - 2} more</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.vehicleType}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Max: {record.maxCapacity} orders
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Delivery',
      dataIndex: 'lastDelivery',
      key: 'lastDelivery',
      render: (date) => date || 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleAssignOrder(record)}
            disabled={record.status === 'inactive'}
          >
            Assign
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Switch
            size="small"
            checked={record.status === 'active'}
            onChange={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Are you sure to delete this delivery partner?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Data Status Tag */}
      <Alert
        message="Currently using mock data - Status: PENDING"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      {/* Delivery Partners Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Total Partners"
              value={partnerStats.total}
              prefix={<TruckOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Active"
              value={partnerStats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Active Orders"
              value={partnerStats.totalActiveOrders}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Total Deliveries"
              value={partnerStats.totalDeliveries}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={partnerStats.avgRating}
              suffix="⭐"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Inactive"
              value={partnerStats.inactive}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Delivery Partners Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Partner
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search partners..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredPartners}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} partners`,
          }}
        />
      </Card>

      {/* Add/Edit Delivery Partner Modal */}
      <Modal
        title={editingPartner ? 'Edit Delivery Partner' : 'Add Delivery Partner'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Partner Name"
                rules={[{ required: true, message: 'Please enter partner name' }]}
              >
                <Input placeholder="Enter partner name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleType"
                label="Vehicle Type"
                rules={[{ required: true, message: 'Please select vehicle type' }]}
              >
                <Select placeholder="Select vehicle type">
                  <Option value="Motorcycle">Motorcycle</Option>
                  <Option value="Bicycle">Bicycle</Option>
                  <Option value="Van">Van</Option>
                  <Option value="Truck">Truck</Option>
                  <Option value="Car">Car</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxCapacity"
                label="Max Capacity (Orders)"
                rules={[{ required: true, message: 'Please enter max capacity' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="serviceAreas"
            label="Service Areas"
            rules={[{ required: true, message: 'Please enter service areas' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select service areas"
              options={[
                { value: 'New York', label: 'New York' },
                { value: 'Los Angeles', label: 'Los Angeles' },
                { value: 'Chicago', label: 'Chicago' },
                { value: 'Houston', label: 'Houston' },
                { value: 'Phoenix', label: 'Phoenix' },
                { value: 'Philadelphia', label: 'Philadelphia' },
                { value: 'San Antonio', label: 'San Antonio' },
                { value: 'San Diego', label: 'San Diego' },
                { value: 'Dallas', label: 'Dallas' },
                { value: 'San Jose', label: 'San Jose' },
                { value: 'Austin', label: 'Austin' },
                { value: 'Jacksonville', label: 'Jacksonville' },
                { value: 'Fort Worth', label: 'Fort Worth' },
                { value: 'Columbus', label: 'Columbus' },
                { value: 'Charlotte', label: 'Charlotte' },
                { value: 'San Francisco', label: 'San Francisco' },
                { value: 'Indianapolis', label: 'Indianapolis' },
                { value: 'Seattle', label: 'Seattle' },
                { value: 'Denver', label: 'Denver' },
                { value: 'Washington', label: 'Washington' },
                { value: 'Boston', label: 'Boston' },
                { value: 'El Paso', label: 'El Paso' },
                { value: 'Nashville', label: 'Nashville' },
                { value: 'Detroit', label: 'Detroit' },
                { value: 'Oklahoma City', label: 'Oklahoma City' },
                { value: 'Portland', label: 'Portland' },
                { value: 'Las Vegas', label: 'Las Vegas' },
                { value: 'Memphis', label: 'Memphis' },
                { value: 'Louisville', label: 'Louisville' },
                { value: 'Milwaukee', label: 'Milwaukee' },
                { value: 'Baltimore', label: 'Baltimore' },
                { value: 'Albuquerque', label: 'Albuquerque' },
                { value: 'Tucson', label: 'Tucson' },
                { value: 'Fresno', label: 'Fresno' },
                { value: 'Sacramento', label: 'Sacramento' },
                { value: 'Kansas City', label: 'Kansas City' },
                { value: 'Mesa', label: 'Mesa' },
                { value: 'Atlanta', label: 'Atlanta' },
                { value: 'Omaha', label: 'Omaha' },
                { value: 'Colorado Springs', label: 'Colorado Springs' },
                { value: 'Raleigh', label: 'Raleigh' },
                { value: 'Long Beach', label: 'Long Beach' },
                { value: 'Virginia Beach', label: 'Virginia Beach' },
                { value: 'Miami', label: 'Miami' },
                { value: 'Oakland', label: 'Oakland' },
                { value: 'Minneapolis', label: 'Minneapolis' },
                { value: 'Tampa', label: 'Tampa' },
                { value: 'Tulsa', label: 'Tulsa' },
                { value: 'Arlington', label: 'Arlington' },
                { value: 'New Orleans', label: 'New Orleans' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPartner ? 'Update' : 'Add'} Partner
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Delivery;
