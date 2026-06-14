import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Typography
} from 'antd';
import { useEffect, useMemo, useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const buildEmptyItem = () => ({
  id: Date.now().toString(),
  productId: null,
  quantity: 1,
});

const BulkOrderModal = ({ visible, onClose, onSubmit, loading, products, isEdit, initialValues }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([buildEmptyItem()]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setItems(initialValues?.items?.map((item) => ({
        id: item.id?.toString() || Date.now().toString(),
        productId: item.product?.id,
        quantity: item.quantity || 1,
      })) || [buildEmptyItem()]);
    }
  }, [visible, initialValues, form]);

  const itemOptions = useMemo(() => {
    return products.map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }, [products]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, buildEmptyItem()]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleFinish = async (values) => {
    if (!values.bulkOrderDetails) return;
    if (!isEdit) {
      const validItems = items.filter((item) => item.productId && item.quantity > 0);
      if (!validItems.length) return;
      await onSubmit({ bulkOrderDetails: values.bulkOrderDetails, items: validItems });
      return;
    }
    await onSubmit({ bulkOrderDetails: values.bulkOrderDetails, status: values.status });
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId, record) => (
        <Select
          value={productId}
          onChange={(value) => handleItemChange(record.id, 'productId', value)}
          placeholder="Select product"
          style={{ width: '100%' }}
          options={itemOptions}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleItemChange(record.id, 'quantity', value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Remove',
      key: 'remove',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={isEdit ? 'Update Bulk Order' : 'Create Bulk Order'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{
        bulkOrderDetails: initialValues?.bulkOrderDetails || '',
        status: initialValues?.status || 'pending',
      }}>
        <Form.Item
          name="bulkOrderDetails"
          label="Bulk Order Details"
          rules={[{ required: true, message: 'Please enter bulk order details' }]}
        >
          <TextArea rows={4} placeholder="Enter order details" />
        </Form.Item>

        {isEdit ? (
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
        ) : (
          <Card size="small" title="Order Items" style={{ marginBottom: 16 }}>
            <Table
              columns={columns}
              dataSource={items}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Add items to create a bulk order' }}
              size="small"
            />
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem} style={{ marginTop: 16 }}>
              Add Item
            </Button>
          </Card>
        )}

        {isEdit && initialValues?.items?.length > 0 && (
          <Card size="small" title="Current Items" style={{ marginBottom: 16 }}>
            {initialValues.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 10 }}>
                <Typography.Text strong>{item.product?.name || 'Product'}</Typography.Text>
                <div>Quantity: {item.quantity}</div>
              </div>
            ))}
          </Card>
        )}

        <Row justify="end">
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>{isEdit ? 'Save Changes' : 'Create Order'}</Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkOrderModal;
