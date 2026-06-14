import { LockOutlined } from '@ant-design/icons';
import { Modal, Select, Skeleton, Space, Table, Tag, Typography } from 'antd';
import { ACCESS_LEVELS, ALL_MODULES, useEmployeePermissions } from '../../hooks/useEmployeePermissions';

const { Text } = Typography;
const { Option } = Select;

const accessColor = (access) => {
    const found = ACCESS_LEVELS.find((a) => a.value === access);
    return found?.color || 'default';
};

const EmployeePermissionsModal = ({ open, onCancel, employee }) => {
    const {
        loading,
        saving,
        getPermissionForModule,
        handleAccessChange,
    } = useEmployeePermissions(
        open ? Number(employee?.id) : null
    );

    const columns = [
        {
            title: 'Module',
            dataIndex: 'label',
            key: 'module',
            render: (label) => <Text strong>{label}</Text>,
        },
        {
            title: 'Current Access',
            key: 'current',
            render: (_, row) => {
                const perm = getPermissionForModule(row.key);
                if (!perm) return <Tag color="default">No Access</Tag>;
                return <Tag color={accessColor(perm.access)}>{perm.access?.replace('_', ' ')}</Tag>;
            },
        },
        {
            title: 'Set Access',
            key: 'action',
            width: 180,
            render: (_, row) => {
                const perm = getPermissionForModule(row.key);
                const current = perm?.access || 'no_access';
                return (
                    <Select
                        size="small"
                        value={current}
                        style={{ width: 150 }}
                        disabled={saving}
                        onChange={(val) => handleAccessChange(row.key, val)}
                    >
                        {ACCESS_LEVELS.map((lvl) => (
                            <Option key={lvl.value} value={lvl.value}>
                                <Space>
                                    <Tag color={lvl.color} style={{ margin: 0 }}>{lvl.label}</Tag>
                                </Space>
                            </Option>
                        ))}
                    </Select>
                );
            },
        },
    ];

    return (
        <Modal
            title={
                <Space>
                    <LockOutlined />
                    {`Permissions — ${employee?.name || ''}`}
                </Space>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            {loading ? (
                <Skeleton active />
            ) : (
                <Table
                    size="small"
                    dataSource={ALL_MODULES}
                    columns={columns}
                    rowKey="key"
                    pagination={false}
                    style={{ marginTop: 8 }}
                />
            )}
        </Modal>
    );
};

export default EmployeePermissionsModal;