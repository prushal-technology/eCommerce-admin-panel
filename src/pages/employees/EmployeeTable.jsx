// import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
// import {
//     Avatar,
//     Button,
//     Card,
//     Popconfirm,
//     Skeleton,
//     Space,
//     Switch,
//     Table,
//     Tag,
// } from 'antd';

// const ROLE_COLORS = { admin: 'red', manager: 'blue', employee: 'green' };

// const getRoleColor = (role) => ROLE_COLORS[role] || 'default';
// const getStatusColor = (status) => (status === 'active' ? 'green' : 'red');

// const EmployeeTable = ({ employees, loading, skeletonRows, onToggleStatus, onDelete }) => {
//     const columns = [
//         {
//             title: 'Employee',
//             dataIndex: 'name',
//             key: 'name',
//             render: (text, record) =>
//                 record.isSkeleton ? (
//                     <Space align="start">
//                         <Skeleton.Avatar active size={40} shape="circle" />
//                         <div>
//                             <Skeleton.Input active size="small" style={{ width: 120, height: 18, borderRadius: 6, marginBottom: 6 }} />
//                             <Skeleton.Input active size="small" style={{ width: 160, height: 14, borderRadius: 6, marginBottom: 4 }} />
//                             <Skeleton.Input active size="small" style={{ width: 100, height: 14, borderRadius: 6 }} />
//                         </div>
//                     </Space>
//                 ) : (
//                     <Space>
//                         <Avatar icon={<UserOutlined />} />
//                         <div>
//                             <div style={{ fontWeight: 'bold' }}>{text}</div>
//                             <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
//                             <div style={{ fontSize: 12, color: '#666' }}>{record.phone}</div>
//                         </div>
//                     </Space>
//                 ),
//         },
//         {
//             title: 'Role',
//             dataIndex: 'roleName',
//             key: 'roleName',
//             render: (roleName, record) =>
//                 record.isSkeleton ? (
//                     <Skeleton.Button active size="small" style={{ width: 80, height: 24, borderRadius: 20 }} />
//                 ) : (
//                     <Tag color={getRoleColor(roleName?.toLowerCase())}>
//                         {roleName?.toUpperCase() || 'N/A'}
//                     </Tag>
//                 ),
//             filters: [
//                 { text: 'Admin', value: 'admin' },
//                 { text: 'Manager', value: 'manager' },
//                 { text: 'Employee', value: 'employee' },
//             ],
//             onFilter: (value, record) => record.role === value,
//         },
//         {
//             title: 'Employee ID',
//             dataIndex: 'employeeId',
//             key: 'employeeId',
//             render: (employeeId, record) =>
//                 record.isSkeleton ? (
//                     <Skeleton.Input active size="small" style={{ width: 90, height: 18, borderRadius: 6 }} />
//                 ) : (
//                     employeeId
//                 ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status, record) =>
//                 record.isSkeleton ? (
//                     <Skeleton.Button active size="small" style={{ width: 80, height: 24, borderRadius: 20 }} />
//                 ) : (
//                     <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
//                 ),
//             filters: [
//                 { text: 'Active', value: 'active' },
//                 { text: 'Inactive', value: 'inactive' },
//             ],
//             onFilter: (value, record) => record.status === value,
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             render: (_, record) =>
//                 record.isSkeleton ? (
//                     <Space size="small">
//                         <Skeleton.Button active size="small" shape="round" style={{ width: 40 }} />
//                         <Skeleton.Button active size="small" shape="circle" />
//                     </Space>
//                 ) : (
//                     <Space size="small">
//                         <Switch size="small" checked={record.isActive} onChange={() => onToggleStatus(record)} />
//                         <Popconfirm
//                             title="Are you sure to delete this employee?"
//                             onConfirm={() => onDelete(record)}
//                             okText="Yes"
//                             cancelText="No"
//                         >
//                             <Button danger icon={<DeleteOutlined />} size="small" />
//                         </Popconfirm>
//                     </Space>
//                 ),
//         },
//     ];

//     return (
//         <Card
//             style={{
//                 height: '100%',
//             }}
//             bodyStyle={{
//                 padding: 0,
//                 height: '100%',
//             }}
//         >
//             <Table
//                 size="small"
//                 columns={columns}
//                 dataSource={loading ? skeletonRows : employees}
//                 rowKey="id"
//                 pagination={false}

//                 scroll={{
//                     x: 'max-content',
//                     y: employees.length >= 10 ? 450 : undefined,
//                 }}

//                 locale={{
//                     emptyText: 'No employees found',
//                 }}

//                 summary={() =>
//                     employees.length > 0 &&
//                         !loading ? (
//                         <Table.Summary.Row>
//                             <Table.Summary.Cell
//                                 index={0}
//                                 colSpan={columns.length}
//                             >
//                                 <div
//                                     style={{
//                                         textAlign: 'center',
//                                         padding: '12px 0',
//                                         color: '#999',
//                                         fontSize: 13,
//                                     }}
//                                 >
//                                     No more employees to load
//                                 </div>
//                             </Table.Summary.Cell>
//                         </Table.Summary.Row>
//                     ) : null
//                 }
//             />
//         </Card>
//     );
// };

// export default EmployeeTable;





import {
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Popconfirm,
    Skeleton,
    Switch,
    Table,
    Tag,
    Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditEmployeeModal from './EditEmployeeModal';
import EmployeePermissionsModal from './EmployeePermissionsModal';

const { Text } = Typography;

const roleColors = {
    admin: 'purple',
    manager: 'blue',
    sales: 'cyan',
    hr: 'orange',
    support: 'geekblue',
    operations: 'volcano',
};

const getRoleColor = (role) => roleColors[role?.toLowerCase()] || 'default';

const EmployeeTable = ({
    employees,
    loading,
    fetchingMore,
    hasMore,
    nextCursor,
    skeletonRows,
    onToggleStatus,
    onDelete,
    onUpdate,
    onLoadMore,
}) => {
    const [editEmployee, setEditEmployee] = useState(null);
    const [permEmployee, setPermEmployee] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const tableContainerRef = useRef(null);

    useEffect(() => {
        const tableBody =
            tableContainerRef.current?.querySelector('.ant-table-body');

        if (!tableBody) return;

        const handleScroll = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;

            if (
                scrollHeight - scrollTop <= clientHeight + 50 &&
                hasMore &&
                nextCursor &&
                !loading &&
                !fetchingMore
            ) {
                onLoadMore(nextCursor);
            }
        };

        tableBody.addEventListener('scroll', handleScroll);

        return () =>
            tableBody.removeEventListener('scroll', handleScroll);
    }, [
        hasMore,
        nextCursor,
        loading,
        fetchingMore,
        onLoadMore,
    ]);


    const handleEditSubmit = async (values) => {
        setEditLoading(true);
        try {
            await onUpdate(values);
            setEditEmployee(null);
        } catch (_) {
            // error shown in hook
        } finally {
            setEditLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'employeeId',
            key: 'employeeId',
            width: 90,
            render: (val, record) =>
                record.isSkeleton ? <Skeleton.Input size="small" active /> : (
                    <Text code style={{ fontSize: 12 }}>#{val}</Text>
                ),
        },
        {
            title: 'Employee',
            key: 'employee',
            render: (_, record) => {
                if (record.isSkeleton) return <Skeleton active title={false} paragraph={{ rows: 1 }} />;
                const initials = `${record.firstName?.[0] || ''}${record.lastName?.[0] || ''}`.toUpperCase();
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar size={32} style={{ background: '#1677ff', flexShrink: 0 }}>
                            {initials}
                        </Avatar>
                        <div>
                            <Text strong style={{ display: 'block', lineHeight: 1.3 }}>
                                {record.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {record.email}
                            </Text>
                        </div>
                    </div>
                );
            },
        },

        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            render: (val, record) =>
                record.isSkeleton ? <Skeleton.Input size="small" active /> : (
                    <Text style={{ fontSize: 13 }}>{val || '—'}</Text>
                ),
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 110,
            render: (val, record) =>
                record.isSkeleton ? <Skeleton.Input size="small" active /> : (
                    <Tag color={getRoleColor(val)}>{val || 'Employee'}</Tag>
                ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, record) =>
                record.isSkeleton ? <Skeleton.Input size="small" active /> : (
                    <Badge
                        status={record.isActive ? 'success' : 'error'}
                        text={record.isActive ? 'Active' : 'Inactive'}
                    />
                ),
        },
        {
            title: 'Active',
            key: 'toggle',
            width: 80,
            render: (_, record) =>
                record.isSkeleton ? null : (
                    <Switch
                        size="small"
                        checked={record.isActive}
                        onChange={() => onToggleStatus(record)}
                    />
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 50,
            render: (_, record) => {
                if (record.isSkeleton) return null;

                const items = [
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => setEditEmployee(record),
                    },
                    {
                        key: 'permissions',
                        label: 'Permissions',
                        icon: <LockOutlined />,
                        onClick: () => setPermEmployee(record),
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        label: (
                            <Popconfirm
                                title="Delete employee?"
                                description="This action cannot be undone."
                                okText="Delete"
                                okButtonProps={{ danger: true }}
                                cancelText="Cancel"
                                onConfirm={() => onDelete(record)}
                            >
                                <span style={{ color: '#ff4d4f' }}>
                                    <DeleteOutlined style={{ marginRight: 6 }} />
                                    Delete
                                </span>
                            </Popconfirm>
                        ),
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            size="small"
                            icon={<MoreOutlined />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const dataSource = loading ? skeletonRows : employees;

    return (
        <>
            <div
                ref={tableContainerRef}
                style={{
                    height: '100%',
                    minHeight: 0,
                }}
            >
                <Table
                    size="small"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{
                        x: 'max-content',
                        y: employees.length > 6 ? 400 : undefined,
                    }}
                    style={{ borderRadius: 8, overflow: 'hidden' }}
                    summary={() => {


                        return !hasMore &&
                            employees.length > 0 &&
                            !loading &&
                            !fetchingMore ? (
                            <Table.Summary.Row>
                                <Table.Summary.Cell
                                    index={0}
                                    colSpan={columns.length}
                                >
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            padding: '8px 0',
                                            color: '#999',
                                            fontSize: 12,
                                        }}
                                    >
                                        No more employees to load
                                    </div>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        ) : null;
                    }}
                />
            </div>
            {fetchingMore && (
                <div
                    style={{
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton.Input
                            key={i}
                            active
                            size="small"
                            style={{
                                width: '98%',
                                height: 32,
                                borderRadius: 6,
                            }}
                        />
                    ))}
                </div>
            )}


            {/* Edit Modal */}
            <EditEmployeeModal
                open={!!editEmployee}
                employee={editEmployee}
                loading={editLoading}
                onCancel={() => setEditEmployee(null)}
                onSubmit={handleEditSubmit}
            />

            {/* Permissions Modal */}
            <EmployeePermissionsModal
                open={!!permEmployee}
                employee={permEmployee}
                onCancel={() => setPermEmployee(null)}
            />
        </>
    );
};

export default EmployeeTable;