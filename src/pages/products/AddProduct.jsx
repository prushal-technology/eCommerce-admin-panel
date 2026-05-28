import {
  Alert,
  Button,
  Card,
  message,
} from 'antd';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductModal from '../../components/modals/ProductModal';
import useProducts from '../../hooks/useProducts';

const AddProduct = () => {

  const navigate = useNavigate();

  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    categories,
    fetchCategories,
    createProduct,
    addProductImage,
  } = useProducts();

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {

    try {

      await fetchCategories();

    } catch (error) {

      message.error('Failed to load categories');

    }
  };

  const handleSubmit = async (productData, imageData) => {

    // Prevent duplicate submits
    if (loading) return;

    setLoading(true);

    try {

      // Create Product
      const result = await createProduct(productData);

      // Handle multiple API response formats
      const productId =
        result?.id ||
        result?.product?.id;

      if (!productId) {

        message.error(
          result?.message || 'Failed to add product'
        );

        return;
      }

      // Upload Images
      if (imageData?.length > 0) {

        for (const image of imageData) {

          await addProductImage(
            productId,
            image
          );
        }
      }

      // Single Success Message
      message.success('Product added successfully!');

      // Reset
      setImageList([]);

      // Navigate
      navigate('/products/all');

    } catch (error) {

      console.error('Add product error:', error);

      message.error('Failed to add product');

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>

      {/* API Alert */}
      <Alert
        message="API Integration - Status: IN PROGRESS"
        description="Product management is now connected to GraphQL backend API"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card
        title="Add New Product"
        extra={
          <Button
            onClick={() => navigate('/products/all')}
          >
            Back to Products
          </Button>
        }
      >

        <ProductModal
          visible={true}
          onCancel={() => navigate('/products/all')}
          onSubmit={handleSubmit}
          initialValues={null}
          categories={categories}
          loading={loading}
          imageList={imageList}
          setImageList={setImageList}
          title="Add New Product"
        />

      </Card>

    </div>
  );
};

export default AddProduct;