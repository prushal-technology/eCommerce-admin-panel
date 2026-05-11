import { Button, Form, Input, Modal, Space, message } from 'antd';
import { useState } from 'react';
import { graphqlRequest } from '../../api/graphql';

const AddCustomerModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await graphqlRequest(`
        mutation AdminCreateCustomer($email: String!, $password: String!, $firstName: String!, $lastName: String!, $phone: String!) {
          adminCreateCustomer(email: $email, password: $password, firstName: $firstName, lastName: $lastName, phone: $phone) {
            customer {
              id
            }
          }
        }
      `, {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone
      });

      if (data?.adminCreateCustomer?.customer?.id) {
        message.success('Customer created successfully');
        form.resetFields();
        onSuccess?.(data.adminCreateCustomer.customer);
        onCancel();
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (error) {
      message.error('Failed to create customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Customer"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="customer@example.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' }
          ]}
        >
          <Input placeholder="9999999999" maxLength={10} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              form.resetFields();
              onCancel();
            }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Customer
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
