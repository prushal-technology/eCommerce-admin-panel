import { Button, Col, Form, Input, Modal, Row, Space, Switch } from 'antd';

const ShippingAddressModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading,
}) => {
  return (
    <Modal
      title="Add New Shipping Address"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please enter state' }]}
            >
              <Input placeholder="Enter state" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="pincode"
          label="Pincode"
          rules={[{ required: true, message: 'Please enter pincode' }]}
        >
          <Input placeholder="Enter pincode" />
        </Form.Item>

        <Form.Item
          name="landmark"
          label="Landmark (Optional)"
        >
          <Input placeholder="Enter landmark (e.g., Near mall, Opposite school)" />
        </Form.Item>

        <Form.Item
          name="isDefault"
          valuePropName="checked"
        >
          <Switch checkedChildren="Default" unCheckedChildren="Set as Default" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} size="small">
              Cancel
            </Button>
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              loading={loading}
            >
              Add Address
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShippingAddressModal;
