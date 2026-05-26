import { DatePicker, Input, Select, Space } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderFilters = ({
  searchText,
  statusFilter,
  dateRange,
  onSearch,
  onStatusChange,
  onDateChange,
  statusOptions = [],
  placeholder = 'Search orders...',
}) => (
  <Space wrap style={{ marginBottom: 16, width: '100%' }}>
    <Search
      size="small"
      className="small-search"
      placeholder={placeholder}
      allowClear
      style={{ width: 250 }}
      value={searchText}
      onChange={(e) => onSearch(e.target.value)}
    />

    <Select
      size="small"
      value={statusFilter}
      onChange={onStatusChange}
      style={{ width: 180 }}
    >
      {statusOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>

    <RangePicker
      size="small"
      value={dateRange}
      onChange={onDateChange}
      format="DD-MM-YYYY"
    />
  </Space>
);

export default OrderFilters;
