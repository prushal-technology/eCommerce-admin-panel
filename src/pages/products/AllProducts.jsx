import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import ProductModal from '../../components/modals/ProductModal';
import useProducts from '../../hooks/useProducts';
import { getDecryptedUser } from "../../utils/crypto"; // adjust path

const { Search } = Input;
const { Option } = Select;

const AllProducts = () => {
  const navigate = useNavigate();
  const user = getDecryptedUser();
  const role = user?.role;

  const normalizedRole = role?.toLowerCase();

  const isAdmin = ["admin", "manager"].includes(normalizedRole);
  const isEmployee = ["employee", "sales associate"].includes(normalizedRole);

  const {
    products,
    categories,
    loadingProducts,
    actionLoading,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    deleteProductImage,
  } = useProducts();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const isFirstRender = useRef(true);
  const tableContainerRef = useRef(null);

  // Load everything once on mount
  useEffect(() => {
    loadProducts(null, true);
    loadCategories();
  }, []);

  // Re-fetch products only when user changes search or category (not on mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      loadProducts(null, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [categoryFilter, searchText]);

  useEffect(() => {
    const tableBody = tableContainerRef.current?.querySelector('.ant-table-body');
    if (tableBody) {
      const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
          if (hasMore && !loading && !fetchingMore) {
            loadProducts(nextCursor, false);
          }
        }
      };

      tableBody.addEventListener('scroll', handleScroll);
      return () => tableBody.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading, fetchingMore, nextCursor]);

  const loadCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  const handleImageModalClose = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };


  const loadProducts = async (cursor = null, isNewSearch = false) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setFetchingMore(true);
    }

    try {
      const categoryId = categoryFilter === 'all' ? null : categoryFilter;
      const search = searchText ? searchText : null;

      const result = await fetchProducts(10, cursor, search, categoryId, !isNewSearch);

      if (result) {
        if (isNewSearch) {
          setNextCursor(result.nextCursor);
          setHasMore(result.hasMore);
        } else {
          setNextCursor(result.nextCursor);
          setHasMore(result.hasMore);
        }
      }
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setImageList([]); // Clear images from previous edit
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    // Map the product data to match form field names
    const mappedData = {
      id: record.id, // Include the product ID
      name: record.name,
      sku: record.sku,
      description: record.description,
      price: record.price,
      discountPrice: record.discountPrice,
      categoryId: record.category?.id,
      isActive: record.isActive,
      unit: record.unit,
      measureValue: record.measureValue,
      isFeatured: record.isFeatured,
      quantity: record.stock?.quantity,
      reservedQuantity: record.stock?.reservedQuantity ?? 0
    };
    setEditingProduct(mappedData);

    // Set up imageList with existing product images
    if (record.images && record.images.length > 0) {
      const existingImages = record.images.map((img, index) => {
        const imageUrl = img.image.startsWith('data:')
          ? img.image
          : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${img.image}`;
        return {
          uid: `-${index}`,
          id: img.id, // Important: include the image ID for deletion
          name: img.image || `image-${index}.png`,
          status: 'done',
          url: imageUrl,
        };
      });
      setImageList(existingImages);
    } else {
      setImageList([]);
    }

    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const deleted = await deleteProduct(id);
      if (deleted) {
        await loadProducts(null, true);
      }
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const visibleProducts = products.filter(product => {
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive === true) ||
      (statusFilter === 'inactive' && product.isActive === false);
    return matchesStatus;
  });

  const getStatusColor = (isActive) => {
    return isActive ? 'green' : 'red';
  };

  const columns = [
    {
      title: <span>Product</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        // Find the first valid image (non-empty image string)
        const validImage = record.images && record.images.length > 0
          ? record.images.find(img => img.image && img.image.trim() !== '')
          : null;

        // Construct full URL for image paths
        const imageSrc = validImage
          ? (validImage.image.startsWith('data:')
            ? validImage.image
            : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`)
          : undefined;

        //console.log('Image source:', imageSrc); // Debug log

        const handleImageClick = () => {
          if (imageSrc) {
            setSelectedImage(imageSrc);
            setImageModalVisible(true);
          }
        };

        return (
          <Space align="start">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={text}
                onClick={handleImageClick}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: '1px solid #f0f0f0'
                }}
                title="Click to view full image"
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: 12
                }}
              >
                No Image
              </div>
            )}
            <div>
              <div style={{ fontWeight: 500 }}>
                {text}
                {record.isFeatured && (
                  <Tag color="gold" size="small" style={{ marginLeft: 8, fontSize: 10, lineHeight: '14px' }}>
                    FEATURED
                  </Tag>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>SKU: {record.sku}</div>
              {record.measureValue && record.unit && (
                <div style={{ fontSize: 12, color: '#888' }}>
                  Quantity: {record.measureValue} {record.unit}
                </div>
              )}
              {record.images && record.images.length > 0 && (
                <div style={{ fontSize: 12, color: '#1890ff' }}>
                  {record.images.length} image(s)
                </div>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: <span>Category</span>,
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <span>
          {category ? category.name : 'N/A'}
        </span>
      )
    },
    {
      title: <span>Price</span>,
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => {
        const p = Number(price);
        const dp = Number(record.discountPrice);
        const hasDiscount = record.discountPrice && dp < p;
        const invalidDiscount = record.discountPrice && dp >= p;

        return (
          <div>
            {hasDiscount && (
              <div>
                ₹{dp.toLocaleString('en-IN')}{' '}
                <span className="text-muted">(Save ₹{(p - dp).toFixed(2)})</span>
              </div>
            )}
            <div
              style={{
                textDecoration: hasDiscount ? 'line-through' : 'none'
              }}
            >
              ₹{p.toLocaleString('en-IN')}
            </div>
            {invalidDiscount && (
              <div style={{ color: '#fa8c16', fontSize: 11 }}>
                ⚠️ Discount price must be lower than regular price
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <span>Stock</span>,
      dataIndex: 'stock',
      key: 'stock',
      render: (stockObj) => {
        const qty = stockObj?.quantity || 0;

        return (
          <Tag
            color={qty === 0 ? 'red' : qty < 10 ? 'orange' : 'green'}
          >
            {qty} units
          </Tag>
        );
      },
    },
    {
      title: <span>Status</span>,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag
          color={getStatusColor(isActive)}
        >
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },

    {
      title: <span>Actions</span>,
      key: 'actions',
      render: (_, record) => {

        if (isEmployee) {
          return null; // No actions available for employee after cart/wishlist removal
        }

        if (isAdmin) {
          return (
            <Space size="small">
              <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/products/${record.id}`, { state: { product: record } })} />
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              <Popconfirm
                title="Delete Product"
                description="Are you sure you want to delete this product?"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        }

        return null;
      },
    },
  ];

  return (
    <div>
      {/* API Status Alert */}
      {/* <Alert
        title="API Integration - Status: IN PROGRESS"
        description="Product management is now connected to GraphQL backend API"
        type="info"
        showIcon
      /> */}


      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 130 }}
        >
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>

        <Select
          size="small"
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 140 }}
          popupMatchSelectWidth={false}
          styles={{ popup: { root: { width: 140 } } }}
        >
          <Option value="all">Categories</Option>
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </div>

      <Card
        title="Products Management"
        extra={
          isAdmin ? (
            <Button type="primary" size="small" onClick={handleAdd}>
              Add Product
            </Button>
          ) : null  
        }
      >
        <div ref={tableContainerRef}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={visibleProducts}
            loading={{
              spinning: loading || fetchingMore,
              indicator: <Spin size="large" />,
              tip: loading ? "Loading products..." : "Loading more products..."
            }}
            size="small"
            pagination={false}
            scroll={{ x: 'max-content', y: 500 }}
            locale={{
              emptyText: loading ? '' : 'No products found'
            }}
          />

          {/* No more data indicator at bottom */}
          {!hasMore && visibleProducts.length > 0 && !loading && !fetchingMore && (
            <div style={{
              textAlign: "center",
              padding: "10px",
              color: '#999',
              fontSize: '12px',
              borderTop: '1px solid #f0f0f0'
            }}>
              No more products to load
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      {(role === "admin" || role === "manager") && (
        <ProductModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={async (productData, imageData) => {
            const payload = {
              ...productData,
              price: Number(productData.price),
              discountPrice: productData.discountPrice
                ? Number(productData.discountPrice)
                : null,
            };

            if (editingProduct) {
              const updated = await updateProduct(editingProduct.id, payload);
              if (updated) {
                await loadProducts(null, true);
              }
            } else {
              const created = await createProduct(payload);
              if (created?.id) {
                if (imageData.length > 0) {
                  for (const image of imageData) {
                    await addProductImage(created.id, image);
                  }
                }
                await loadProducts(null, true);
              }
            }
            setIsModalVisible(false);
          }}
          initialValues={editingProduct}
          categories={categories}
          loading={actionLoading}
          imageList={imageList}
          setImageList={setImageList}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          onDeleteImage={deleteProductImage}
        />
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={imageModalVisible}
        imageSrc={selectedImage}
        onClose={handleImageModalClose}
      />

    </div>
  );
};

export default AllProducts;
