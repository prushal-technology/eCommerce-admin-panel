import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Skeleton, Space, Table } from 'antd';
import { useEffect, useRef } from 'react';

const CustomerTable = ({
    customers,
    loading,
    fetchingMore,
    hasMore,
    nextCursor,
    skeletonRows,
    onEdit,
    onDelete,
    onLoadMore,
}) => {
    const tableContainerRef = useRef(null);

    useEffect(() => {
        const tableBody = tableContainerRef.current?.querySelector('.ant-table-body');
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
        return () => tableBody.removeEventListener('scroll', handleScroll);
    }, [hasMore, nextCursor, loading, fetchingMore, onLoadMore]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 40, height: 18, borderRadius: 6 }} />
                ) : (
                    id
                ),
        },
        {
            title: 'Customer',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 140, height: 18, borderRadius: 6 }} />
                ) : (
                    <div style={{ fontWeight: 500 }}>{text}</div>
                ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 110, height: 18, borderRadius: 6 }} />
                ) : (
                    <span style={{ color: phone ? '#1890ff' : '#999' }}>{phone || 'N/A'}</span>
                ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email, record) =>
                record.isSkeleton ? (
                    <Skeleton.Input active size="small" style={{ width: 180, height: 18, borderRadius: 6 }} />
                ) : (
                    <span style={{ color: email === 'N/A' ? '#999' : '#1890ff' }}>{email}</span>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) =>
                record.isSkeleton ? (
                    <Space size="small">
                        <Skeleton.Button active size="small" shape="circle" />
                        <Skeleton.Button active size="small" shape="circle" />
                    </Space>
                ) : (
                    <Space size="small">
                        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                        <Popconfirm
                            title="Delete Customer"
                            description="Are you sure you want to delete this customer?"
                            onConfirm={() => onDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                ),
        },
    ];

    return (
        <div
            ref={tableContainerRef}
            style={{
                height: '100%',
                minHeight: 0,
            }}
        >
            <Table
                size="small"
                columns={columns}
                dataSource={loading ? skeletonRows : customers}
                rowKey="id"
                pagination={false}
                scroll={{
                    x: 'max-content',
                    y: customers.length > 6 ? 400 : undefined,
                }}
                locale={{
                    emptyText: 'No customers found',
                }}

                summary={() =>
                    !hasMore &&
                        customers.length > 0 &&
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
                                        padding: '4px 0',
                                        color: '#999',
                                        fontSize: 12,
                                    }}
                                >
                                    No more customers to load
                                </div>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    ) : null
                }
            />

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
        </div>
    );
};

export default CustomerTable;