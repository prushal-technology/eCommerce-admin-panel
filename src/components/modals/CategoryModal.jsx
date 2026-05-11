import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Switch, Typography, Upload } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;
const { Text } = Typography;

export default function CategoryModal({
    open,
    onClose,
    onSubmit,
    editingCategory,
    parentCategories,
    imageList,
    setImageList,
    loading,
    form
}) {

    useEffect(() => {
        if (open) {
            if (editingCategory) {
                form.setFieldsValue({
                    name: editingCategory.name,
                    description: editingCategory.description || "",
                    parentId: editingCategory.parent?.id,
                    isActive: editingCategory.isActive !== false
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingCategory, form]);

    return (
        <Modal
            title={<span>
                {editingCategory ? "Edit Category" : "Add Category"}
            </span>}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={480}   // 🔥 reduced width
        >
            <Form form={form} layout="vertical" onFinish={onSubmit} size="small">

                {/* ROW 1 */}
                <Row gutter={10}>   {/* 🔥 reduced gap */}
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label={<span>Category Name</span>}
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input
                                size="small"
                                placeholder="Enter name"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="parentId"
                            label={<span>Main Category</span>}
                        >
                            <Select
                                size="small"
                                allowClear
                                placeholder="Select Main Category"
                                className="small-select"
                                popupClassName="small-select-dropdown"
                                options={parentCategories.map((cat) => ({
                                    label: cat.name,
                                    value: Number(cat.id),
                                }))}
                            />
                        </Form.Item>
                        <Text style={{ fontSize: 12, color: '#888', marginTop: -16, display: 'block' }}>
                            Select to create sub-category
                        </Text>
                    </Col>
                </Row>

                {/* ROW 2 */}
                <Row gutter={7}>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label={<span>Description</span>}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Enter description"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="isActive"
                            label={<span>Status</span>}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* IMAGE */}
                <Form.Item
                    label={<span>Image</span>}
                >
                    <Upload
                        listType="picture-card"
                        fileList={imageList}
                        beforeUpload={() => false}
                        onChange={(e) => setImageList(e.fileList.slice(-1))}
                    >
                        {imageList.length < 1 && (
                            <div>
                                <PlusOutlined />
                                <div>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                {/* BUTTONS */}
                <Space>
                    <Button size="small" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        size="small"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {editingCategory ? "Update" : "Create"}
                    </Button>
                </Space>

            </Form>
        </Modal>
    );
}