import { Table } from 'antd';

const OrderTable = ({
  loading,
  data,
  columns,
  rowKey = 'id',
  pagination = { pageSize: 10, showSizeChanger: true, showQuickJumper: true }
}) => {
  return (
    <Table
      loading={loading}
      dataSource={data}
      columns={columns}
      rowKey={rowKey}
      pagination={pagination}
      size="small"
    />
  );
};

export default OrderTable;
