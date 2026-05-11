import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  message,
  Select
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../api/categories';
import { addProductImage, createProduct } from '../../api/products';
import ProductModal from '../../components/modals/ProductModal';

const { TextArea } = Input;
const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const navigate = useNavigate();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
  setCategoriesLoading(true);
  try {
    const result = await getAllCategories();

    if (result.success) {
      setCategories(result.categories);
    } else {
      message.error(result.message || 'Failed to load categories');
    }

  } catch (error) {
    message.error('Failed to load categories');
  } finally {
    setCategoriesLoading(false);
  }
};

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare product data
      const productData = {
        categoryId: values.category,
        name: values.name,
        description: values.description,
        sku: values.sku,
        price: values.price,
        discountPrice: values.discountPrice,
        isActive: values.status
      };

      const result = await createProduct(productData);
      
      if (result.success) {
        // Upload images if any
        if (imageList.length > 0) {
          for (let i = 0; i < imageList.length; i++) {
            const file = imageList[i].originFileObj || imageList[i];
            if (file) {
              await addProductImage(result.product.id, file, i + 1);
            }
          }
        }
        
        message.success('Product added successfully!');
        
        // Reset form
        form.resetFields();
        setImageList([]);
        setVariants([]);
        
        // Navigate back to products list
        navigate('/products/all');
      } else {
        message.error(result.message || 'Failed to add product');
      }
    } catch (error) {
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddAnother = async (values) => {
    setLoading(true);
    try {
      // Prepare product data
      const productData = {
        categoryId: values.category,
        name: values.name,
        description: values.description,
        sku: values.sku,
        price: values.price,
        discountPrice: values.discountPrice,
        isActive: values.status
      };

      const result = await createProduct(productData);
      
      if (result.success) {
        // Upload images if any
        if (imageList.length > 0) {
          for (let i = 0; i < imageList.length; i++) {
            const file = imageList[i].originFileObj || imageList[i];
            if (file) {
              await addProductImage(result.product.id, file, i + 1);
            }
          }
        }
        
        message.success('Product added successfully!');
        
        // Reset form for next product
        form.resetFields();
        setImageList([]);
        setVariants([]);
      } else {
        message.error(result.message || 'Failed to add product');
      }
    } catch (error) {
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList: imageList,
    onChange: (info) => {
      setImageList(info.fileList);
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
      
      return true; // Allow upload
    },
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', options: [''] }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'options') {
      newVariants[index][field] = value.split(',').map(opt => opt.trim());
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  return (
    <div>
      {/* API Status Alert */}
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
          <Button onClick={() => navigate('/products/all')}>
            Back to Products
          </Button>
        }
      >
        <ProductModal
          visible={true}
          onCancel={() => navigate('/products/all')}
          onSubmit={async (productData, imageData) => {
            setLoading(true);
            try {
              const result = await createProduct(productData);
              if (result.success) {
                // Upload images if any
                if (imageData.length > 0) {
                  for (const image of imageData) {
                    await addProductImage(result.product.id, image);
                  }
                }
                message.success('Product added successfully!');
                navigate('/products/all');
              } else {
                message.error(result.message || 'Failed to add product');
              }
            } catch (error) {
              message.error('Failed to add product');
            } finally {
              setLoading(false);
            }
          }}
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
