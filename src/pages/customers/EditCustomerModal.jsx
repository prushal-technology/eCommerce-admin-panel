import { Button, Form, Input, Modal, Space, Switch } from 'antd';
import { useEffect } from 'react';

const EditCustomerModal = ({ open, customer, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && customer) {
            form.setFieldsValue({
                ...customer,
                isActive: customer.isActive ?? true,
            });
        } else {
            form.resetFields();
        }
    }, [open, customer, form]);

    const handleFinish = async (values) => {
        await onSubmit(values);
    };

    return (
        <Modal
            title="Edit Customer"
            open={open && !!customer}
            onCancel={onCancel}
            footer={null}
            width={500}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter first name',
                        },
                    ]}
                >
                    <Input placeholder="John" />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter last name',
                        },
                    ]}
                >
                    <Input placeholder="Doe" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[
                        {
                            pattern: /^\d{10}$/,
                            message:
                                'Phone number must be exactly 10 digits',
                        },
                    ]}
                >
                    <Input
                        placeholder="9999999999"
                        maxLength={10}
                    />
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Active Status"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button size="small" type="primary" htmlType="submit">
                            Update
                        </Button>

                        <Button size="small" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCustomerModal;