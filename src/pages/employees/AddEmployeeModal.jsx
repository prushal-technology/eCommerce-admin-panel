// import { Button, Col, Form, Input, Modal, Row, Space } from 'antd';
// import { Button, Col, Form, Input, Modal, Row, Space } from 'antd';

// const AddEmployeeModal = ({ open, onCancel, onSubmit }) => {
//     const [form] = Form.useForm();

//     const handleFinish = async (values) => {
//         await onSubmit(values);
//         form.resetFields();
//     };

//     const handleCancel = () => {
//         form.resetFields();
//         onCancel();
//     };

//     return (
//         <Modal title="Add Employee" open={open} onCancel={handleCancel} footer={null} width={600}>
//             <Form form={form} layout="vertical" onFinish={handleFinish}>
//                 <Row gutter={16}>
//                     <Col span={12}>
//                         <Form.Item
//                             name="firstName"
//                             label="First Name"
//                             rules={[{ required: true, message: 'Please enter first name' }]}
//                         >
//                             <Input placeholder="Enter first name" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item
//                             name="lastName"
//                             label="Last Name"
//                             rules={[{ required: true, message: 'Please enter last name' }]}
//                         >
//                             <Input placeholder="Enter last name" />
//                         </Form.Item>
//                     </Col>
//                 </Row>

//                 <Row gutter={16}>
//                     <Col span={12}>
//                         <Form.Item
//                             name="email"
//                             label="Email"
//                             rules={[
//                                 { required: true, message: 'Please enter email' },
//                                 { type: 'email', message: 'Please enter valid email' },
//                             ]}
//                         >
//                             <Input placeholder="Enter email address" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item
//                             name="phone"
//                             label="Phone"
//                             rules={[{ required: true, message: 'Please enter phone number' }]}
//                         >
//                             <Input placeholder="Enter phone number" />
//                         </Form.Item>
//                     </Col>
//                 </Row>

//                 <Form.Item
//                     name="password"
//                     label="Password"
//                     rules={[
//                         { required: true, message: 'Please enter password' },
//                         { min: 6, message: 'Password must be at least 6 characters' },
//                     ]}
//                 >
//                     <Input.Password placeholder="Enter password" />
//                 </Form.Item>

//                 <Form.Item
//                     name="employeeRoleName"
//                     label="Role"
//                     rules={[{ required: true, message: 'Please enter role' }]}
//                 >
//                     <Input placeholder="Enter role (e.g., Sales, Admin, Manager)" />
//                 </Form.Item>

//                 <Form.Item>
//                     <Space>
//                         <Button type="primary" htmlType="submit" size="small">
//                             Add Employee
//                         </Button>
//                         <Button onClick={handleCancel} size="small">
//                             Cancel
//                         </Button>
//                     </Space>
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// };

// export default AddEmployeeModal;



// import { Form, Input, Modal, Select } from 'antd';

// const { Option } = Select;

// const AddEmployeeModal = ({ open, onCancel, onSubmit, loading }) => {
//     const [form] = Form.useForm();

//     const handleOk = async () => {
//         try {
//             const values = await form.validateFields();
//             await onSubmit(values);
//             form.resetFields();
//         } catch (_) {
//             // validation error – do nothing
//         }
//     };

//     const handleCancel = () => {
//         form.resetFields();
//         onCancel();
//     };

//     return (
//         <Modal
//             title="Add New Employee"
//             open={open}
//             onOk={handleOk}
//             onCancel={handleCancel}
//             okText="Add Employee"
//             confirmLoading={loading}
//             width={480}
//             destroyOnHidden
//         >
//             <Form form={form} layout="vertical" size="small" style={{ marginTop: 8 }}>
//                 <Form.Item
//                     name="firstName"
//                     label="First Name"
//                     rules={[{ required: true, message: 'First name is required' }]}
//                 >
//                     <Input placeholder="Alex" />
//                 </Form.Item>

//                 <Form.Item
//                     name="lastName"
//                     label="Last Name"
//                     rules={[{ required: true, message: 'Last name is required' }]}
//                 >
//                     <Input placeholder="Johnson" />
//                 </Form.Item>

//                 <Form.Item
//                     name="email"
//                     label="Email"
//                     rules={[
//                         { required: true, message: 'Email is required' },
//                         { type: 'email', message: 'Enter a valid email' },
//                     ]}
//                 >
//                     <Input placeholder="emp@company.com" />
//                 </Form.Item>

//                 <Form.Item
//                     name="phone"
//                     label="Phone"
//                     rules={[{ required: true, message: 'Phone is required' }]}
//                 >
//                     <Input placeholder="9876543210" />
//                 </Form.Item>

//                 <Form.Item
//                     name="employeeRoleName"
//                     label="Role"
//                     rules={[{ required: true, message: 'Role is required' }]}
//                 >
//                     <Input placeholder="Enter Role" />
//                 </Form.Item>

//                 <Form.Item
//                     name="password"
//                     label="Password"
//                     rules={[
//                         { required: true, message: 'Password is required' },
//                         { min: 6, message: 'Minimum 6 characters' },
//                     ]}
//                 >
//                     <Input.Password placeholder="Minimum 6 characters" />
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// };

// export default AddEmployeeModal;



import { Col, Form, Input, Modal, Row } from 'antd';

const AddEmployeeModal = ({
    open,
    onCancel,
    onSubmit,
    loading,
}) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (_) {
            // validation error
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Add New Employee"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Add Employee"
            confirmLoading={loading}
            width={700}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                size="small"
                style={{ marginTop: 8 }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'First name is required',
                                },
                            ]}
                        >
                            <Input placeholder="Alex" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Last name is required',
                                },
                            ]}
                        >
                            <Input placeholder="Johnson" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email is required',
                                },
                                {
                                    type: 'email',
                                    message: 'Enter a valid email',
                                },
                            ]}
                        >
                            <Input placeholder="emp@company.com" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Phone is required',
                                },
                            ]}
                        >
                            <Input placeholder="9876543210" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="employeeRoleName"
                            label="Role"
                            rules={[
                                {
                                    required: true,
                                    message: 'Role is required',
                                },
                            ]}
                        >
                            <Input placeholder="Enter role" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Password is required',
                                },
                                {
                                    min: 6,
                                    message: 'Minimum 6 characters',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Minimum 6 characters" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;