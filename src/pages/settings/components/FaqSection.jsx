import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import {
    Badge,
    Button,
    Card,
    Collapse,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Skeleton,
    Space,
    Switch,
    Tag,
    Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { createFaq, deleteFaq, getFaqs, updateFaq } from '../../../api/cms';
import SaveButton from './SaveButton';

const { TextArea } = Input;
const { Text } = Typography;

// ── Add FAQ Modal ─────────────────────────────────────────────────────────────
const AddFaqModal = ({ open, onClose, onCreated, nextOrder }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (values) => {
        setSaving(true);
        try {
            const res = await createFaq(values);
            if (res.success) {
                message.success('FAQ created');
                form.resetFields();
                onCreated();
            } else {
                message.error(res.message || 'Failed to create FAQ');
            }
        } catch {
            message.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={
                <Space>
                    <QuestionCircleOutlined />
                    Add FAQ
                </Space>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={560}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ displayOrder: nextOrder, isActive: true }}
            >
                <Form.Item
                    label="Question"
                    name="question"
                    rules={[{ required: true, message: 'Please enter the question' }]}
                >
                    <Input placeholder="e.g. How do I place an order?" />
                </Form.Item>

                <Form.Item
                    label="Answer"
                    name="answer"
                    rules={[{ required: true, message: 'Please enter the answer' }]}
                >
                    <TextArea rows={4} placeholder="Enter the answer..." />
                </Form.Item>

                <Space size="large" wrap>
                    <Form.Item label="Display Order" name="displayOrder" style={{ marginBottom: 0 }}>
                        <InputNumber min={1} style={{ width: 100 }} />
                    </Form.Item>

                    <Form.Item label="Active" name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Space>

                <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                    <Button type="primary" htmlType="submit" loading={saving} size="small">
                        Create FAQ
                    </Button>
                    <Button onClick={handleClose} size="small">
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

// ── Single editable FAQ card ──────────────────────────────────────────────────
const FaqItem = ({ faq, onSaved, onDeleted }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isActive, setIsActive] = useState(faq.isActive);

    useEffect(() => {
        form.setFieldsValue({
            question: faq.question,
            answer: faq.answer,
            displayOrder: faq.displayOrder,
        });
        setIsActive(faq.isActive);
    }, [faq, form]);

    const handleSubmit = async (values) => {
        setSaving(true);
        try {
            const res = await updateFaq(faq.id, { ...values, isActive });
            if (res.success) {
                message.success('FAQ saved');
                onSaved();
            } else {
                message.error(res.message || 'Failed to save');
            }
        } catch {
            message.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await deleteFaq(faq.id);
            if (res.success) {
                message.success('FAQ deleted');
                onDeleted(faq.id);
            } else {
                message.error(res.message || 'Failed to delete');
            }
        } catch {
            message.error('Something went wrong');
        } finally {
            setDeleting(false);
        }
    };

    const headerLabel = (
        <Space size="small" align="center" style={{ width: '100%' }}>
            <EditOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text style={{ maxWidth: 360, fontSize: 13 }} ellipsis={{ tooltip: faq.question }}>
                {faq.question}
            </Text>
            <Tag
                color={isActive ? 'green' : 'red'}
                icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                style={{ marginLeft: 4, fontSize: 11 }}
            >
                {isActive ? 'Active' : 'Inactive'}
            </Tag>
        </Space>
    );

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
            <Collapse
                size="small"
                style={{ borderRadius: 8, flex: 1 }}
                items={[
                    {
                        key: faq.id,
                        label: headerLabel,
                        children: (
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item
                                    label="Question"
                                    name="question"
                                    rules={[{ required: true, message: 'Please enter the question' }]}
                                >
                                    <Input placeholder="Enter the FAQ question" />
                                </Form.Item>

                                <Form.Item
                                    label="Answer"
                                    name="answer"
                                    rules={[{ required: true, message: 'Please enter the answer' }]}
                                >
                                    <TextArea rows={4} placeholder="Enter the FAQ answer" />
                                </Form.Item>

                                <Space size="large" wrap>
                                    <Form.Item label="Display Order" name="displayOrder" style={{ marginBottom: 0 }}>
                                        <InputNumber min={1} style={{ width: 100 }} />
                                    </Form.Item>

                                    <Form.Item label="Active" style={{ marginBottom: 0 }}>
                                        <Switch
                                            checked={isActive}
                                            onChange={setIsActive}
                                            checkedChildren="Active"
                                            unCheckedChildren="Inactive"
                                        />
                                    </Form.Item>
                                </Space>

                                <div style={{ marginTop: 16 }}>
                                    <SaveButton loading={saving}>Save FAQ</SaveButton>
                                </div>
                            </Form>
                        ),
                    },
                ]}
            />

            {/* Delete button sits outside collapse so it's always visible */}
            <Popconfirm
                title="Delete FAQ"
                description="Are you sure you want to delete this FAQ?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
            >
                <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleting}
                    style={{ marginTop: 6, flexShrink: 0 }}
                />
            </Popconfirm>
        </div>
    );
};

// ── Skeleton placeholder ──────────────────────────────────────────────────────
const FaqSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton.Input
                key={i}
                active
                size="default"
                style={{ width: '100%', height: 40, borderRadius: 8 }}
            />
        ))}
    </div>
);

// ── Main section ──────────────────────────────────────────────────────────────
const FaqSection = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getFaqs();
            if (res.success) {
                setFaqs([...res.faqs].sort((a, b) => a.displayOrder - b.displayOrder));
            } else {
                message.error(res.message || 'Failed to load FAQs');
            }
        } finally {
            setLoading(false);
        }
    };

    // Optimistic remove — no refetch needed
    const handleDeleted = (id) => {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
    };

    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.displayOrder)) + 1 : 1;

    return (
        <>
            <Card
                title={
                    <Space>
                        <QuestionCircleOutlined />
                        <span>FAQs</span>
                        {!loading && (
                            <Badge count={faqs.length} style={{ backgroundColor: '#1890ff' }} showZero />
                        )}
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add FAQ
                    </Button>
                }
                style={{ marginBottom: 20 }}
            >
                {loading ? (
                    <FaqSkeleton />
                ) : faqs.length === 0 ? (
                    <Text type="secondary">No FAQs yet. Click "Add FAQ" to create one.</Text>
                ) : (
                    faqs.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            faq={faq}
                            onSaved={loadData}
                            onDeleted={handleDeleted}
                        />
                    ))
                )}
            </Card>

            <AddFaqModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onCreated={() => {
                    setIsAddModalOpen(false);
                    loadData();
                }}
                nextOrder={nextOrder}
            />
        </>
    );
};

export default FaqSection;