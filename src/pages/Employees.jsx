import {
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag
} from 'antd';
import { useEffect, useState } from 'react';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, UPDATE_EMPLOYEE_STATUS } from '../graphql/mutations';
import { GET_EMPLOYEE_ROLES, GET_EMPLOYEES } from '../graphql/queries';

const { Search } = Input;
const { Option } = Select;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [employeeRoles, setEmployeeRoles] = useState([]);

  useEffect(() => {
    loadEmployees();
    loadEmployeeRoles();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { graphqlRequest } = await import('../api/graphql');
      const data = await graphqlRequest(GET_EMPLOYEES);
      const formattedEmployees = data.employees?.employees?.map(emp => ({
        id: emp.id,
        employeeId: emp.employeeId,
        firstName: emp.user?.firstName || '',
        lastName: emp.user?.lastName || '',
        name: `${emp.user?.firstName || ''} ${emp.user?.lastName || ''}`.trim(),
        email: emp.user?.email || '',
        phone: emp.user?.phone || '',
        roleName: emp.roleName,
        isActive: emp.isActive,
        status: emp.isActive ? 'active' : 'inactive',
        role: emp.roleName?.toLowerCase() || 'employee',
      })) || [];
      setEmployees(formattedEmployees);
    } catch (error) {
      message.error('Failed to load employees: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeRoles = async () => {
    try {
      const { graphqlRequest } = await import('../api/graphql');
      const data = await graphqlRequest(GET_EMPLOYEE_ROLES);
      setEmployeeRoles(data.employeeRoles || []);
    } catch (error) {
      console.error('Failed to load employee roles:', error);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const { graphqlRequest } = await import('../api/graphql');
      await graphqlRequest(DELETE_EMPLOYEE, { employeeId: record.employeeId });
      message.success('Employee deleted successfully');
      loadEmployees();
    } catch (error) {
      message.error('Failed to delete employee: ' + error.message);
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      const newIsActive = !record.isActive;
      const { graphqlRequest } = await import('../api/graphql');
      await graphqlRequest(UPDATE_EMPLOYEE_STATUS, { 
        employeeId: record.employeeId, 
        isActive: newIsActive 
      });
      message.success(`Employee ${newIsActive ? 'activated' : 'deactivated'} successfully`);
      loadEmployees();
    } catch (error) {
      message.error('Failed to update employee status: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { graphqlRequest } = await import('../api/graphql');
      await graphqlRequest(CREATE_EMPLOYEE, {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        employeeRoleName: values.employeeRoleName
      });
      message.success('Employee added successfully');
      setIsModalVisible(false);
      form.resetFields();
      loadEmployees();
    } catch (error) {
      message.error('Failed to create employee: ' + error.message);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         employee.phone.includes(searchText);
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      manager: 'blue',
      employee: 'green',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red';
  };

  const employeeStats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    admin: employees.filter(e => e.role === 'admin').length,
    manager: employees.filter(e => e.role === 'manager').length,
    employee: employees.filter(e => e.role === 'employee').length,
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleName) => (
        <Tag color={getRoleColor(roleName?.toLowerCase())}>
          {roleName?.toUpperCase() || 'N/A'}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Employee', value: 'employee' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Switch
            size="small"
            checked={record.isActive}
            onChange={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Employee Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Total Employees"
              value={employeeStats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Active"
              value={employeeStats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Inactive"
              value={employeeStats.inactive}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Admins"
              value={employeeStats.admin}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Managers"
              value={employeeStats.manager}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Employees"
              value={employeeStats.employee}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Employee Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="small">
            Add Employee
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search employees..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 120 }}
          >
            <Option value="all">All Roles</Option>
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="employee">Employee</Option>
            {employeeRoles.map(role => (
              <Option key={role.name?.toLowerCase()} value={role.name?.toLowerCase()}>
                {role.name}
              </Option>
            ))}
          </Select>
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
          dataSource={filteredEmployees}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} employees`,
          }}
        />
      </Card>

      {/* Add Employee Modal */}
      <Modal
        title="Add Employee"
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
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="employeeRoleName"
            label="Role"
            rules={[{ required: true, message: 'Please enter role' }]}
          >
            <Input placeholder="Enter role (e.g., Sales, Admin, Manager)" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="small">
                Add Employee
              </Button>
              <Button onClick={() => setIsModalVisible(false)} size="small">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
