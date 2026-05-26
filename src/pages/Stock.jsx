import {
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SyncOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStocks } from '../api/products';
import ProductModal from '../components/modals/ProductModal';
import InfoTooltip from '../components/ui/InfoTooltip';
import useProducts from '../hooks/useProducts';

const { Search } = Input;
const { Option } = Select;

const Stock = () => {
  const navigate = useNavigate();
  const {
    categories,
    loadingProducts,
    actionLoading,
    fetchCategories,
    createProduct,
    addProductImage,
    updateProductStock,
  } = useProducts();
  const [stockItems, setStockItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [form] = Form.useForm();

  // Product modal state
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productForm] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const loadStocks = async (query = '') => {
    try {
      const res = await getAllStocks(query || null);
      if (res.success) {
        const mapped = (res.allStocks || []).map(stock => ({
          id: stock.id,
          name: stock.product?.name || 'Unknown Product',
          price: stock.product?.price,
          stock: {
            quantity: Number(stock.quantity || 0),
            reservedQuantity: Number(stock.reservedQuantity || 0),
            availableQuantity: Number(stock.availableQuantity || 0),
            isOutOfStock: stock.isOutOfStock,
          },
          images: stock.product?.images || [],
          isFeatured: false,
          unit: stock.product?.unit || '',
        }));
        setStockItems(mapped);
      } else {
        message.error(res.message || 'Failed to load stock data');
      }
    } catch (error) {
      message.error('An error occurred while fetching stock data.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStocks(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleAddProduct = () => {
    productForm.resetFields();
    setImageList([]);
    setIsProductModalVisible(true);
  };

  const handleProductModalClose = () => {
    setIsProductModalVisible(false);
    productForm.resetFields();
    setImageList([]);
  };

  const handleProductSubmit = async (values) => {
    setProductLoading(true);
    try {
      const newProduct = await createProduct({
        ...values,
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        measureValue: values.measureValue ? Number(values.measureValue) : undefined,
        isActive: values.isActive,
        isFeatured: values.isFeatured,
      });

      if (newProduct?.id) {
        // Upload images if any
        const newImages = imageList.filter(img => !img.id);
        for (const img of newImages) {
          if (img.originFileObj) {
            const reader = new FileReader();
            reader.readAsDataURL(img.originFileObj);
            await new Promise((resolve) => {
              reader.onload = async () => {
                const base64 = reader.result;
                await addProductImage(newProduct.id, base64, 0);
                resolve();
              };
            });
          }
        }
        message.success('Product added successfully!');
        setIsProductModalVisible(false);
        productForm.resetFields();
        setImageList([]);
        // Reload stocks to show new product
        await fetchProducts(50);
      } else {
        message.error('Failed to add product');
      }
    } catch (error) {
      message.error('An error occurred while adding product');
    } finally {
      setProductLoading(false);
    }
  };

  const getStockQuantity = (product) => {
    return product?.stock?.quantity || 0;
  };

  const getStockStatus = (product) => {
    const qty = getStockQuantity(product);
    if (qty === 0) return { status: 'out_of_stock', color: 'red', text: 'Out of Stock' };
    if (qty <= 5) return { status: 'critical', color: 'orange', text: 'Critical' };
    if (qty <= 15) return { status: 'low', color: 'gold', text: 'Low Stock' };
    return { status: 'normal', color: 'green', text: 'Normal' };
  };

  const getStockPercentage = (product) => {
    const stock = getStockQuantity(product);
    // Use dynamic max based on stock value, minimum 100 for scale
    const maxStock = Math.max(100, stock * 1.2);
    return Math.min(100, Math.round((stock / maxStock) * 100));
  };

  const handleStockUpdate = (record, type) => {
    const currentQty = getStockQuantity(record);
    setSelectedStockItem(record);
    form.setFieldsValue({
      stock: currentQty,
      updateType: type,
      quantity: type === 'set' ? currentQty : 1
    });
    setIsModalVisible(true);
  };

  const handleProductStockUpdate = async (values) => {
    try {
      const currentQty = getStockQuantity(selectedStockItem);
      let newStock = currentQty;

      if (values.updateType === 'set') {
        newStock = values.stock;
      } else if (values.updateType === 'add') {
        newStock = currentQty + values.quantity;
      } else if (values.updateType === 'subtract') {
        newStock = Math.max(0, currentQty - values.quantity);
      }

      const res = await updateProductStock(selectedStockItem.id, newStock);

      if (res) {
        await loadStocks(searchText);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error('Failed to update stock');
      }
    } catch (error) {
      message.error('Failed to update stock');
    }
  };

  const filteredStocks = stockItems.filter(item => {
    const qty = getStockQuantity(item);
    if (stockFilter === 'all') return true;
    if (stockFilter === 'low') return qty <= 15 && qty > 5;
    if (stockFilter === 'critical') return qty <= 5 && qty > 0;
    if (stockFilter === 'out') return qty === 0;
    return true;
  });

  const stockStats = {
    total: stockItems.length,
    normal: stockItems.filter(p => getStockStatus(p).status === 'normal').length,
    low: stockItems.filter(p => getStockStatus(p).status === 'low').length,
    critical: stockItems.filter(p => getStockStatus(p).status === 'critical').length,
    outOfStock: stockItems.filter(p => getStockStatus(p).status === 'out_of_stock').length,
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image;
    const baseUrl = import.meta.env.VITE_GRAPHQL_URI?.replace('/graphql/', '').replace('/graphql', '') || '';
    return `${baseUrl}/media/${image}`;
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => {
        const validImage = record.images && record.images.length > 0
          ? record.images.find(img => img.image && img.image.trim() !== '')
          : null;
        const imageSrc = validImage ? getImageUrl(validImage.image) : null;

        return (
          <Space align="start">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={record.name}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
              />
            ) : (
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: 12,
                border: '1px solid #f0f0f0'
              }}>
                No Image
              </div>
            )}
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{record.name || 'Unknown Product'}</div>
              {record.isFeatured && (
                <Tag color="orange" style={{ fontSize: 10, marginTop: 4 }}>FEATURED</Tag>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Current Stock',
      key: 'stockLevel',
      width: 200,
      render: (_, record) => {
        const stock = getStockQuantity(record);
        const unit = record.unit || '';
        return (
          <div>
            <div style={{ fontWeight: 500, fontSize: 12, color: '#1890ff', marginBottom: 4 }}>
              {stock} {unit}
            </div>
            <Progress
              percent={getStockPercentage(record)}
              size="small"
              status={stock === 0 ? 'exception' : stock <= 5 ? 'active' : 'normal'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Reserved',
      key: 'reservedQuantity',
      width: 100,
      render: (_, record) => (
        <div className="text-muted">
          {record.stock?.reservedQuantity || 0}
        </div>
      ),
      sorter: (a, b) => ((a.stock?.reservedQuantity || 0) - (b.stock?.reservedQuantity || 0))
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const { color, text } = getStockStatus(record);
        return <Tag color={color} className="tag-compact">{text}</Tag>;
      },
      filters: [
        { text: 'Normal', value: 'normal' },
        { text: 'Low Stock', value: 'low' },
        { text: 'Critical', value: 'critical' },
        { text: 'Out of Stock', value: 'out_of_stock' },
      ],
      onFilter: (value, record) => getStockStatus(record).status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleStockUpdate(record, 'add')}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* API Status Alert */}


      {/* Stock Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stockStats.total}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<InfoTooltip title="Low Stock" text="Products with quantity between 6 and 15" />}
              value={stockStats.low}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<InfoTooltip title="Critical" text="Products with quantity 5 or below" />}
              value={stockStats.critical}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<InfoTooltip title="Out of Stock" text="Products with 0 quantity" />}
              value={stockStats.outOfStock}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {stockStats.critical > 0 && (
        <Alert
          message={`${stockStats.critical} products need immediate restocking`}
          type="warning"
          showIcon
          closable
        />
      )}

      {stockStats.outOfStock > 0 && (
        <Alert
          message={`${stockStats.outOfStock} products are out of stock`}
          type="error"
          showIcon
          closable
        />
      )}

      <Card
        extra={
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        }
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Space>
            <Search
              size="small"
              className="small-search"
              placeholder="Search products..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}

            />
            <Select
              size="small"
              value={stockFilter}
              onChange={setStockFilter}
              defaultValue="all"
            >
              <Option value="all">All Products</Option>
              <Option value="low">Low Stock (≤15)</Option>
              <Option value="critical">Critical (≤5)</Option>
              <Option value="out">Out of Stock</Option>
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredStocks}
            loading={loadingProducts}
            size="small"
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} products`,
            }}
          />
        </Space>
      </Card>

      {/* Stock Update Modal */}
      <Modal
        title={`Update Stock - ${selectedStockItem?.name || 'Product'}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProductStockUpdate}
        >
          <Form.Item
            name="updateType"
            label="Update Type"
            initialValue="add"
            rules={[{ required: true, message: 'Please select update type' }]}
          >
            <Radio.Group>
              <Radio value="add">Add Stock</Radio>
              <Radio value="subtract">Remove Stock</Radio>
              <Radio value="set">Set Stock Level</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.updateType !== currentValues.updateType}
          >
            {({ getFieldValue }) => {
              const updateType = getFieldValue('updateType');
              if (updateType === 'set') {
                return (
                  <Form.Item
                    name="stock"
                    label="New Stock Level"
                    rules={[{ required: true, message: 'Please enter stock level' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  name="quantity"
                  label="Quantity"
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={actionLoading}>
                Update Stock
              </Button>
              <Button onClick={() => setIsModalVisible(false)} disabled={actionLoading}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Product Modal */}
      <ProductModal
        visible={isProductModalVisible}
        onCancel={handleProductModalClose}
        onSubmit={handleProductSubmit}
        form={productForm}
        categories={categories}
        loading={productLoading}
        imageList={imageList}
        setImageList={setImageList}
        title="Add Product"
      />
    </Space>
  );
};

export default Stock;
