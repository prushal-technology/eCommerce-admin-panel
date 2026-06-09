import { Button, Col, Form, Input, Modal, Row, Space } from 'antd';

const AddEmployeeModal = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        await onSubmit(values);
        form.resetFields();
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal title="Add Employee" open={open} onCancel={handleCancel} footer={null} width={600}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter first name' }]}
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter last name' }]}
                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter valid email' },
                            ]}
                        >
                            <Input placeholder="Enter email address" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                    name="employeeRoleName"
                    label="Role"
                    rules={[{ required: true, message: 'Please enter role' }]}
                >
                    <Input placeholder="Enter role (e.g., Sales, Admin, Manager)" />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" size="small">
                            Add Employee
                        </Button>
                        <Button onClick={handleCancel} size="small">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;