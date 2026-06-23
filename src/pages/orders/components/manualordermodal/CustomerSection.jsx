

import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;


export const formatAddress = (address) => {
    if (!address) return '';
    const parts = [address.name, address.phone, address.addressLine, address.city, address.state, address.pincode];
    if (address.landmark) parts.push(`Landmark: ${address.landmark}`);
    return parts.filter(Boolean).join(', ');
};

// ── Customer profile + address panel ────────────────────────────────────────

const CustomerProfile = ({ customer, selectedAddress, onAddressSelect, onAddAddress }) => {
    if (!customer) {
        return (
            <div
                style={{
                    marginTop: 16, padding: 24, textAlign: 'center', color: '#bfbfbf',
                    borderRadius: 8, backgroundColor: '#fafafa', border: '1px dashed #d9d9d9', fontSize: 13,
                }}
            >
                Please select or add a customer to see profile and shipping details.
            </div>
        );
    }

    return (
        <div
            style={{
                marginTop: 16, padding: '16px 20px', borderRadius: 8,
                backgroundColor: '#fafafa', border: '1px solid #f0f0f0',
            }}
        >
            <Row gutter={[24, 16]}>
                {/* Profile */}
                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 14, color: '#262626', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
                        Customer Profile
                    </div>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {[['Name', customer.name], ['Email', customer.email || '—'], ['Phone', customer.phone || '—']].map(
                            ([label, val]) => (
                                <div key={label}>
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1f1f1f' }}>{val}</div>
                                </div>
                            )
                        )}
                    </Space>
                </Col>

                {/* Address */}
                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 14, color: '#262626', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
                        Shipping Address
                    </div>

                    {customer.addresses?.length > 0 ? (
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div style={{ fontSize: 12, color: '#8c8c8c' }}>Select Address</div>
                            <Select
                                placeholder="Select delivery address"
                                value={selectedAddress?.id}
                                onChange={onAddressSelect}
                                style={{ width: '100%' }}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Button
                                            type="link"
                                            icon={<PlusOutlined />}
                                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onClick={onAddAddress}
                                            style={{ width: '100%', justifyContent: 'flex-start' }}
                                            size="small"
                                        >
                                            Add New Address
                                        </Button>
                                    </>
                                )}
                            >
                                {customer.addresses.map((addr) => (
                                    <Option key={addr.id} value={addr.id}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <HomeOutlined />
                                            <span style={{ fontSize: 12 }}>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</span>
                                            {addr.isDefault && <span style={{ color: '#52c41a', fontSize: 12 }}>(Default)</span>}
                                        </div>
                                    </Option>
                                ))}
                            </Select>

                            {selectedAddress && (
                                <div
                                    style={{
                                        marginTop: 8, padding: '10px 12px', borderRadius: 6,
                                        backgroundColor: '#ffffff', border: '1px dashed #d9d9d9',
                                        fontSize: 13, color: '#595959', lineHeight: 1.5,
                                    }}
                                >
                                    {formatAddress(selectedAddress)}
                                </div>
                            )}
                        </Space>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <p style={{ color: '#8c8c8c', marginBottom: 8, fontSize: 13 }}>No address found.</p>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={onAddAddress} size="small">
                                Add Address
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

// ── Main exported section ────────────────────────────────────────────────────

/**
 * Customer search select, profile panel, address picker, and advance-booking toggle.
 *
 * @prop {boolean} isRequired  — true for Home Delivery (all customer fields required),
 *                               false for Walk-in (all customer fields optional).
 */
const CustomerSection = ({
    customers,
    customersLoading,
    selectedCustomer,
    selectedAddress,
    advanceBooking,
    onCustomerSearch,
    onCustomerPopupScroll,
    onCustomerSelect,
    onCustomerClear,
    onAddressSelect,
    onAddAddress,
    onAddNewCustomer,
    onAdvanceBookingChange,
    form,
}) => (
    <>
        <Row gutter={16}>
            <Col xs={24} md={12}>
                {/*
                  * Give this Form.Item a `name` so validateFields() can
                  * reach it. The validator checks selectedCustomer state
                  * instead of the raw Select value because the Select is
                  * controlled externally (value={selectedCustomer?.id}).
                  */}
                <Form.Item
                    label="Select Customer"
                    name="customerId"
                    rules={[]}
                >
                    <Space style={{ width: '100%', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Select
                            showSearch
                            placeholder="Type to search customers by name or email..."
                            filterOption={false}
                            onSearch={onCustomerSearch}
                            onPopupScroll={onCustomerPopupScroll}
                            onChange={(val) => {
                                onCustomerSelect(val);
                                form.setFieldValue('customerId', val);
                                // Clear error immediately when user picks someone
                                form.setFields([{ name: 'customerId', errors: [] }]);
                            }}
                            value={selectedCustomer?.id}
                            notFoundContent={customersLoading ? <span>Loading...</span> : null}
                            style={{ flex: 1 }}
                            allowClear
                            onClear={() => {
                                onCustomerClear();
                                form.setFieldValue('customerId', undefined);
                            }}
                        >
                            {customers.map((c) => (
                                <Option key={c.id} value={c.id}>
                                    {c.name} {c.email !== 'N/A' ? `(${c.email})` : ''}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddNewCustomer}
                            size="small"
                        >
                            Add New
                        </Button>
                    </Space>
                </Form.Item>
            </Col>
        </Row>

        <CustomerProfile
            customer={selectedCustomer}
            selectedAddress={selectedAddress}
            onAddressSelect={onAddressSelect}
            onAddAddress={onAddAddress}
        />

        <Row gutter={16} style={{ marginTop: 8 }}>
            <Col xs={24} md={12}>
                <Form.Item label="Advance Booking">
                    <Switch checked={advanceBooking} onChange={onAdvanceBookingChange} />
                </Form.Item>
            </Col>
            {advanceBooking && (
                <Col xs={24} md={12}>
                    <Form.Item
                        name="deliveryDate"
                        label="Delivery Date"
                        rules={[
                            {
                                required: true,
                                message: 'Please select delivery date',
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD-MM-YYYY"
                            disabledDate={(current) => {
                                const today = dayjs().startOf('day');
                                const maxDate = today.add(7, 'day');

                                return (
                                    current &&
                                    (
                                        current < today ||
                                        current > maxDate
                                    )
                                );
                            }}
                        />
                    </Form.Item>

                </Col>
            )}
        </Row>
        <Col xs={24}>
            <Form.Item
                name="notes"
                label="Notes"
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Enter order notes, delivery instructions, customer remarks, etc."
                    maxLength={500}
                    showCount
                />
            </Form.Item>
        </Col>
    </>
);

export default CustomerSection;