// import {
//   DeleteOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined
// } from '@ant-design/icons';
// import {
//   Avatar,
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Select,
//   Skeleton,
//   Space,
//   Statistic,
//   Switch,
//   Table,
//   Tag,
//   Typography
// } from 'antd';
// import { useEffect, useState } from 'react';
// import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, UPDATE_EMPLOYEE_STATUS } from '../graphql/mutations';
// import { GET_EMPLOYEES } from '../graphql/queries';
// const { Title } = Typography;

// const { Search } = Input;
// const { Option } = Select;

// const Employees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const [employeeRoles, setEmployeeRoles] = useState([]);

//   useEffect(() => {
//     loadEmployees();

//   }, []);

//   const loadEmployees = async () => {
//     setLoading(true);
//     try {
//       const { graphqlRequest } = await import('../api/graphql');
//       const data = await graphqlRequest(GET_EMPLOYEES);
//       const formattedEmployees = data.employees?.employees?.map(emp => ({
//         id: emp.id,
//         employeeId: emp.employeeId,
//         firstName: emp.user?.firstName || '',
//         lastName: emp.user?.lastName || '',
//         name: `${emp.user?.firstName || ''} ${emp.user?.lastName || ''}`.trim(),
//         email: emp.user?.email || '',
//         phone: emp.user?.phone || '',
//         roleName: emp.roleName,
//         isActive: emp.isActive,
//         status: emp.isActive ? 'active' : 'inactive',
//         role: emp.roleName?.toLowerCase() || 'employee',
//       })) || [];
//       setEmployees(formattedEmployees);
//     } catch (error) {
//       message.error('Failed to load employees: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleAdd = () => {
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleDelete = async (record) => {
//     try {
//       const { graphqlRequest } = await import('../api/graphql');
//       await graphqlRequest(DELETE_EMPLOYEE, { employeeId: record.employeeId });
//       message.success('Employee deleted successfully');
//       loadEmployees();
//     } catch (error) {
//       message.error('Failed to delete employee: ' + error.message);
//     }
//   };

//   const handleToggleStatus = async (record) => {
//     try {
//       const newIsActive = !record.isActive;
//       const { graphqlRequest } = await import('../api/graphql');
//       await graphqlRequest(UPDATE_EMPLOYEE_STATUS, {
//         employeeId: record.employeeId,
//         isActive: newIsActive
//       });
//       message.success(`Employee ${newIsActive ? 'activated' : 'deactivated'} successfully`);
//       loadEmployees();
//     } catch (error) {
//       message.error('Failed to update employee status: ' + error.message);
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const { graphqlRequest } = await import('../api/graphql');
//       await graphqlRequest(CREATE_EMPLOYEE, {
//         email: values.email,
//         password: values.password,
//         firstName: values.firstName,
//         lastName: values.lastName,
//         phone: values.phone,
//         employeeRoleName: values.employeeRoleName
//       });
//       message.success('Employee added successfully');
//       setIsModalVisible(false);
//       form.resetFields();
//       loadEmployees();
//     } catch (error) {
//       message.error('Failed to create employee: ' + error.message);
//     }
//   };

//   const filteredEmployees = employees.filter(employee => {
//     const matchesSearch = employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
//       employee.phone.includes(searchText);
//     const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
//     const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const getRoleColor = (role) => {
//     const colors = {
//       admin: 'red',
//       manager: 'blue',
//       employee: 'green',
//     };
//     return colors[role] || 'default';
//   };

//   const getStatusColor = (status) => {
//     return status === 'active' ? 'green' : 'red';
//   };

//   const employeeStats = {
//     total: employees.length,
//     active: employees.filter(e => e.status === 'active').length,
//     inactive: employees.filter(e => e.status === 'inactive').length,
//     admin: employees.filter(e => e.role === 'admin').length,
//     manager: employees.filter(e => e.role === 'manager').length,
//     employee: employees.filter(e => e.role === 'employee').length,
//   };

//   const skeletonRows = Array.from({ length: 6 }).map((_, index) => ({
//     id: `skeleton-${index}`,
//     isSkeleton: true,
//   }));

//   const columns = [
//     {
//       title: 'Employee',
//       dataIndex: 'name',
//       key: 'name',

//       render: (text, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Space align="start">

//               <Skeleton.Avatar
//                 active
//                 size={40}
//                 shape="circle"
//               />

//               <div>

//                 <Skeleton.Input
//                   active
//                   size="small"
//                   style={{
//                     width: 120,
//                     height: 18,
//                     borderRadius: 6,
//                     marginBottom: 6
//                   }}
//                 />

//                 <Skeleton.Input
//                   active
//                   size="small"
//                   style={{
//                     width: 160,
//                     height: 14,
//                     borderRadius: 6,
//                     marginBottom: 4
//                   }}
//                 />

//                 <Skeleton.Input
//                   active
//                   size="small"
//                   style={{
//                     width: 100,
//                     height: 14,
//                     borderRadius: 6
//                   }}
//                 />

//               </div>
//             </Space>
//           );
//         }

//         return (
//           <Space>
//             <Avatar icon={<UserOutlined />} />

//             <div>

//               <div style={{ fontWeight: 'bold' }}>
//                 {text}
//               </div>

//               <div
//                 style={{
//                   fontSize: '12px',
//                   color: '#666'
//                 }}
//               >
//                 {record.email}
//               </div>

//               <div
//                 style={{
//                   fontSize: '12px',
//                   color: '#666'
//                 }}
//               >
//                 {record.phone}
//               </div>

//             </div>
//           </Space>
//         );
//       },
//     },

//     {
//       title: 'Role',
//       dataIndex: 'roleName',
//       key: 'roleName',

//       render: (roleName, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Button
//               active
//               size="small"
//               style={{
//                 width: 80,
//                 height: 24,
//                 borderRadius: 20
//               }}
//             />
//           );
//         }

//         return (
//           <Tag color={getRoleColor(roleName?.toLowerCase())}>
//             {roleName?.toUpperCase() || 'N/A'}
//           </Tag>
//         );
//       },

//       filters: [
//         { text: 'Admin', value: 'admin' },
//         { text: 'Manager', value: 'manager' },
//         { text: 'Employee', value: 'employee' },
//       ],

//       onFilter: (value, record) =>
//         record.role === value,
//     },

//     {
//       title: 'Employee ID',
//       dataIndex: 'employeeId',
//       key: 'employeeId',

//       render: (employeeId, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: 90,
//                 height: 18,
//                 borderRadius: 6
//               }}
//             />
//           );
//         }

//         return employeeId;
//       },
//     },

//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',

//       render: (status, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Skeleton.Button
//               active
//               size="small"
//               style={{
//                 width: 80,
//                 height: 24,
//                 borderRadius: 20
//               }}
//             />
//           );
//         }

//         return (
//           <Tag color={getStatusColor(status)}>
//             {status.toUpperCase()}
//           </Tag>
//         );
//       },

//       filters: [
//         { text: 'Active', value: 'active' },
//         { text: 'Inactive', value: 'inactive' },
//       ],

//       onFilter: (value, record) =>
//         record.status === value,
//     },

//     {
//       title: 'Actions',
//       key: 'actions',

//       render: (_, record) => {

//         if (record.isSkeleton) {
//           return (
//             <Space size="small">

//               <Skeleton.Button
//                 active
//                 size="small"
//                 shape="round"
//                 style={{ width: 40 }}
//               />

//               <Skeleton.Button
//                 active
//                 size="small"
//                 shape="circle"
//               />

//             </Space>
//           );
//         }

//         return (
//           <Space size="small">

//             <Switch
//               size="small"
//               checked={record.isActive}
//               onChange={() =>
//                 handleToggleStatus(record)
//               }
//             />

//             <Popconfirm
//               title="Are you sure to delete this employee?"
//               onConfirm={() =>
//                 handleDelete(record)
//               }
//               okText="Yes"
//               cancelText="No"
//             >
//               <Button
//                 danger
//                 icon={<DeleteOutlined />}
//                 size="small"
//               />
//             </Popconfirm>

//           </Space>
//         );
//       },
//     },
//   ];
//   const statisticFormatter = (value) => (
//     loading ? (
//       <div
//         style={{
//           width: '100%',
//           display: 'flex',
//           alignItems: 'center'
//         }}
//       >
//         <Skeleton.Input
//           active
//           size="small"
//           style={{
//             width: '55%',
//             minWidth: 45,
//             maxWidth: 80,
//             height: 22,
//             borderRadius: 6
//           }}
//         />
//       </div>
//     ) : (
//       value
//     )
//   );

//   return (


//     <div>

//       {/* PAGE HEADER */}

//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 20,
//           gap: 12,
//           flexWrap: 'wrap',
//         }}
//       >

//         <Title
//           level={4}
//           style={{ margin: 0 }}
//         >
//           Employees Management
//         </Title>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={handleAdd}
//           size="small"
//         >
//           Add Employee
//         </Button>

//       </div>

//       {/* EMPLOYEE STATS */}

//       <Row
//         gutter={[16, 16]}
//         style={{ marginBottom: 16 }}
//       >

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Total Employees"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.total
//               }
//               prefix={
//                 !loading
//                   ? <TeamOutlined />
//                   : null
//               }
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Active"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.active
//               }
//               valueStyle={{
//                 color: '#52c41a',
//               }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Inactive"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.inactive
//               }
//               valueStyle={{
//                 color: '#ff4d4f',
//               }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Admins"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.admin
//               }
//               valueStyle={{
//                 color: '#722ed1',
//               }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Managers"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.manager
//               }
//               valueStyle={{
//                 color: '#1890ff',
//               }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} md={4}>
//           <Card>
//             <Statistic
//               title="Employees"
//               value={
//                 loading
//                   ? 0
//                   : employeeStats.employee
//               }
//               valueStyle={{
//                 color: '#52c41a',
//               }}
//               formatter={statisticFormatter}
//             />
//           </Card>
//         </Col>

//       </Row>

//       {/* FILTERS */}

//       <div
//         style={{
//           display: 'flex',
//           gap: 12,
//           flexWrap: 'wrap',
//           alignItems: 'center',
//           marginBottom: 16,
//         }}
//       >

//         <Search
//           size="small"
//           className="small-search"
//           placeholder="Search employees..."
//           allowClear
//           style={{ width: 250 }}
//           onChange={(e) =>
//             setSearchText(e.target.value)
//           }
//         />

//         <Select
//           size="small"
//           value={roleFilter}
//           onChange={setRoleFilter}
//           style={{ width: 150 }}
//         >

//           <Option value="all">
//             All Roles
//           </Option>

//           <Option value="admin">
//             Admin
//           </Option>

//           <Option value="manager">
//             Manager
//           </Option>

//           <Option value="employee">
//             Employee
//           </Option>

//           {employeeRoles.map((role) => (

//             <Option
//               key={
//                 role.name?.toLowerCase()
//               }
//               value={
//                 role.name?.toLowerCase()
//               }
//             >
//               {role.name}
//             </Option>

//           ))}

//         </Select>

//         <Select
//           size="small"
//           value={statusFilter}
//           onChange={setStatusFilter}
//           style={{ width: 140 }}
//         >

//           <Option value="all">
//             All Status
//           </Option>

//           <Option value="active">
//             Active
//           </Option>

//           <Option value="inactive">
//             Inactive
//           </Option>

//         </Select>

//       </div>

//       {/* TABLE */}

//       <Card>

//         <Table
//           columns={columns}
//           dataSource={
//             loading
//               ? skeletonRows
//               : filteredEmployees
//           }
//           rowKey="id"
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total) =>
//               `Total ${total} employees`,
//           }}
//         />

//       </Card>


//       {/* Add Employee Modal */}
//       <Modal
//         title="Add Employee"
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//         >
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="firstName"
//                 label="First Name"
//                 rules={[{ required: true, message: 'Please enter first name' }]}
//               >
//                 <Input placeholder="Enter first name" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="lastName"
//                 label="Last Name"
//                 rules={[{ required: true, message: 'Please enter last name' }]}
//               >
//                 <Input placeholder="Enter last name" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[
//                   { required: true, message: 'Please enter email' },
//                   { type: 'email', message: 'Please enter valid email' }
//                 ]}
//               >
//                 <Input placeholder="Enter email address" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="phone"
//                 label="Phone"
//                 rules={[{ required: true, message: 'Please enter phone number' }]}
//               >
//                 <Input placeholder="Enter phone number" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[
//               { required: true, message: 'Please enter password' },
//               { min: 6, message: 'Password must be at least 6 characters' }
//             ]}
//           >
//             <Input.Password placeholder="Enter password" />
//           </Form.Item>

//           <Form.Item
//             name="employeeRoleName"
//             label="Role"
//             rules={[{ required: true, message: 'Please enter role' }]}
//           >
//             <Input placeholder="Enter role (e.g., Sales, Admin, Manager)" />
//           </Form.Item>

//           <Form.Item>
//             <Space>
//               <Button type="primary" htmlType="submit" size="small">
//                 Add Employee
//               </Button>
//               <Button onClick={() => setIsModalVisible(false)} size="small">
//                 Cancel
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Employees;



import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Select, Typography } from 'antd';
import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import AddEmployeeModal from './employees/AddEmployeeModal';
import EmployeeStats from './employees/EmployeeStats';
import EmployeeTable from './employees/EmployeeTable';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Employees = () => {
  const {
    filteredEmployees,
    loading,
    stats,
    skeletonRows,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    createEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
  } = useEmployees();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSubmit = async (values) => {
    try {
      await createEmployee(values);
      setIsAddModalOpen(false);
    } catch (error) {
      message.error('Failed to create employee: ' + error.message);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteEmployee(record);
    } catch (error) {
      message.error('Failed to delete employee: ' + error.message);
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      await toggleEmployeeStatus(record);
    } catch (error) {
      message.error('Failed to update employee status: ' + error.message);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* PAGE HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Employees Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          size="small"
        >
          Add Employee
        </Button>
      </div>

      {/* STATS */}
      <EmployeeStats stats={stats} loading={loading} />

      {/* FILTERS */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Search
          size="small"
          className="small-search"
          placeholder="Search employees..."
          allowClear
          style={{ width: 250 }}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Select size="small" value={roleFilter} onChange={setRoleFilter} style={{ width: 150 }}>
          <Option value="all">All Roles</Option>
          <Option value="admin">Admin</Option>
          <Option value="manager">Manager</Option>
          <Option value="employee">Employee</Option>
        </Select>
        <Select size="small" value={statusFilter} onChange={setStatusFilter} style={{ width: 140 }}>
          <Option value="all">All Status</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      {/* TABLE */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
        }}
      >
        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          skeletonRows={skeletonRows}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* ADD MODAL */}
      <AddEmployeeModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default Employees;
