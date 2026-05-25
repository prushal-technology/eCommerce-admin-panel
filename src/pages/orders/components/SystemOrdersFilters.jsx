import { DatePicker, Input, Select, Space } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SystemOrdersFilters = ({
  searchText,
  statusFilter,
  dateRange,
  onSearch,
  onStatusChange,
  onDateChange,
}) => (
  <Space wrap style={{ marginBottom: 16 }}>
    <Search
      size="small"
      className="small-search"
      placeholder="Search orders..."
      allowClear
      style={{ width: 250 }}
      value={searchText}
      onChange={(e) => onSearch(e.target.value)}
    />

    <Select
      size="small"
      value={statusFilter}
      onChange={onStatusChange}
      style={{ width: 150 }}
    >
      <Option value="all">All Status</Option>
      <Option value="pending">Pending</Option>
      <Option value="confirmed">Confirmed</Option>
      <Option value="dispatched">Dispatched</Option>
      <Option value="delivered">Delivered</Option>
      <Option value="cancelled">Cancelled</Option>
    </Select>

    <RangePicker
      size="small"
      value={dateRange}
      onChange={onDateChange}
      format="DD-MM-YYYY"
    />
  </Space>
);

export default SystemOrdersFilters;
