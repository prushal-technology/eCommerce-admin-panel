import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Switch,
    Typography,
    Upload
} from 'antd';
import { useEffect } from 'react';

const { Text } = Typography;

const { TextArea } = Input;
const { Option } = Select;

const ProductModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  categories,
  loading,
  imageList,
  setImageList,
  title,
  onDeleteImage
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const uploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList: imageList,
    onChange: (info) => {
      setImageList(info.fileList);
    },
    onRemove: async (file) => {
      // If the file has an id, it's an existing image from the server
      if (file.id && onDeleteImage) {
        try {
          const result = await onDeleteImage(file.id);
          if (!result.success) {
            message.error(result.message || 'Failed to delete image');
            return false; // Prevent removal from UI
          }
          message.success('Image deleted successfully');
          return true;
        } catch (error) {
          message.error('Failed to delete image');
          return false;
        }
      }
      // For new uploads (not yet saved), just remove from UI
      return true;
    },
    beforeUpload: (file) => {
      // Validate file type and size
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }

      return false; // Prevent automatic upload - images are handled manually on form submit
    },
  };

  const handleSubmit = async (values) => {
    try {
      const productData = {
        ...values,
        categoryId: values.categoryId,
        price: parseFloat(values.price),
        discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : null,
        isActive: values.isActive !== false,
        isFeatured: values.isFeatured === true,
        measureValue: values.measureValue ? String(values.measureValue) : null,
      };

      // Handle images
      const imageData = imageList.map(file => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file;
      });

      await onSubmit(productData, imageData);

      // Reset form for next product
      form.resetFields();
      setImageList([]);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      // width={650}
      centered
      destroyOnHidden
      styles={{
        body: {
          maxHeight: "70vh",   // 🔥 key fix
          overflowY: "auto",
          paddingRight: 8
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>

        {/* 🔹 BASIC INFO */}
        <Text strong style={{ fontSize: 14 }}>Basic Information</Text>
        <Divider style={{ margin: "4px 0 8px" }} />

        <Row gutter={[8, 4]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Enter product name" }]}
            >
              <Input placeholder="e.g. ABC" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: "Enter SKU" }]}
            >
              <Input placeholder="e.g. PR-001" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={2} placeholder="Enter product description..." />
        </Form.Item>

        {/* 🔹 PRICING */}
        <Text strong style={{ fontSize: 14 }}>Pricing</Text>
        <Divider style={{ margin: "8px 0 16px" }} />

        <Row gutter={[8, 4]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Enter price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter price"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="discountPrice" label="Discount Price">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Optional"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 🔹 UNIT & MEASURE */}
        <Text strong style={{ fontSize: 14 }}>Unit & Measure</Text>
        <Divider style={{ margin: "8px 0 16px" }} />

        <Row gutter={[8, 4]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="measureValue"
              label="Measure Value"
              rules={[{ required: true, message: "Enter measure value" }]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="e.g. 2"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="unit"
              label="Unit"
              rules={[{ required: true, message: "Select a unit" }]}
            >
              <Select placeholder="Select a unit">
                <Option value="kg">Kilogram</Option>
                <Option value="g">Gram</Option>
                <Option value="piece">Piece</Option>
                <Option value="dozen">Dozen</Option>
                <Option value="bunch">Bunch</Option>
                <Option value="box">Box</Option>
              </Select>
            </Form.Item>
          </Col>


        </Row>

        {/* 🔹 STOCK */}
        <Text strong style={{ fontSize: 14 }}>Stock</Text>
        <Divider style={{ margin: "8px 0 16px" }} />

        <Row gutter={[8, 4]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Enter quantity" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter quantity"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="reservedQuantity"
              label="Reserved Quantity"
              initialValue={0}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter reserved quantity"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 🔹 CATEGORY + STATUS */}
        <Text strong style={{ fontSize: 14 }}>Settings</Text>
        <Divider style={{ margin: "8px 0 16px" }} />

        <Row gutter={[8, 4]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Select category" }]}
            >
              <Select
                placeholder="Select category"
                disabled={!!initialValues}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="isActive"
              label="Status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="isFeatured"
              label="Featured"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>
        </Row>

        {/* 🔹 IMAGES */}
        <Text strong style={{ fontSize: 14 }}>Product Images</Text>
        <Divider style={{ margin: "8px 0 16px" }} />

        <Form.Item name="images">
          <Upload {...uploadProps}>
            {imageList.length >= 5 ? null : (
              <div>
                <div style={{ fontSize: 18 }}>+</div>
                <div style={{ fontSize: 12 }}>Upload</div>
              </div>
            )}
          </Upload>

          <Text type="secondary" style={{ fontSize: 12 }}>
            You can upload up to 5 images
          </Text>
        </Form.Item>

        {/* 🔹 ACTION BUTTONS */}
        <Divider />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? "Update Product" : "Add Product"}
          </Button>
        </div>

      </Form>
    </Modal>
  );
};

export default ProductModal;
