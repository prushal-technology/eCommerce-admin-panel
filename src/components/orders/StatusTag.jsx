import { Tag } from 'antd';

const STATUS_COLORS = {
  pending: 'orange',
  confirmed: 'blue',
  processing: 'cyan',
  dispatched: 'purple',
  delivered: 'green',
  cancelled: 'red',
  rejected: 'red',
  success: 'green',
  failed: 'volcano',
  open: 'blue',
};

const StatusTag = ({ status }) => (
  <Tag color={STATUS_COLORS[status] || 'default'}>
    {status ? status.toUpperCase() : 'UNKNOWN'}
  </Tag>
);

export default StatusTag;
