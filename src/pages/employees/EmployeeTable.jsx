import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Popconfirm,
    Skeleton,
    Space,
    Switch,
    Table,
    Tag,
} from 'antd';

const ROLE_COLORS = { admin: 'red', manager: 'blue', employee: 'green' };

const getRoleColor = (role) => ROLE_COLORS[role] || 'default';
const getStatusColor = (status) => (status === 'active' ? 'green' : 'red');

const EmployeeTable = ({ employees, loading, skeletonRows, onToggleStatus, onDelete }) => {
    const columns = [
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =>
                record.isSkeleton ? (
                    <Space align="start">
                        <Skeleton.Avatar active size={40} shape="circle" />
                        <div>
                            <Skeleton.Input active size="small" style={{ width: 120, height: 18, borderRadius: 6, marginBottom: 6 }} />
                            <Skeleton.Input active size="small" style={{ width: 160, height: 14, borderRadius: 6, marginBottom: 4 }} />
                            <Skeleton.Input active size="small" style={{ width: 100, height: 14, borderRadius: 6 }} />
                        </div>
                    </Space>
                ) : (
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{text}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{record.phone}</div>
                        </div>
                    </Space>
                ),
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (roleName, record) =>
                record.isSkeleton ? (
                    <Skeleton.Button active size="small" style={{ width: 80, height: 24, borderRadius: 20 }} />
                ) : (
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
            render: (employeeId, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 90, height: 18, borderRadius: 6 }} />
                ) : (
                    employeeId
                ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) =>
                record.isSkeleton ? (
                    <Skeleton.Button active size="small" style={{ width: 80, height: 24, borderRadius: 20 }} />
                ) : (
                    <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
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
            render: (_, record) =>
                record.isSkeleton ? (
                    <Space size="small">
                        <Skeleton.Button active size="small" shape="round" style={{ width: 40 }} />
                        <Skeleton.Button active size="small" shape="circle" />
                    </Space>
                ) : (
                    <Space size="small">
                        <Switch size="small" checked={record.isActive} onChange={() => onToggleStatus(record)} />
                        <Popconfirm
                            title="Are you sure to delete this employee?"
                            onConfirm={() => onDelete(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Space>
                ),
        },
    ];

    return (
        <Card
            style={{
                height: '100%',
            }}
            bodyStyle={{
                padding: 0,
                height: '100%',
            }}
        >
            <Table
                size="small"
                columns={columns}
                dataSource={loading ? skeletonRows : employees}
                rowKey="id"
                pagination={false}

                scroll={{
                    x: 'max-content',
                    y: employees.length >= 10 ? 450 : undefined,
                }}

                locale={{
                    emptyText: 'No employees found',
                }}

                summary={() =>
                    employees.length > 0 &&
                        !loading ? (
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={0}
                                colSpan={columns.length}
                            >
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '12px 0',
                                        color: '#999',
                                        fontSize: 13,
                                    }}
                                >
                                    No more employees to load
                                </div>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    ) : null
                }
            />
        </Card>
    );
};

export default EmployeeTable;