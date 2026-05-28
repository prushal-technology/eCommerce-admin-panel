import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Popconfirm, Skeleton, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../api/categories';
import CategoryModal from '../components/modals/CategoryModal';
// Helper function to convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const { Search } = Input;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);
  const loadCategories = async (query = '') => {
    try {
      setLoading(true);
      const res = await getAllCategories(query || null);
      if (res.success) {
        setCategories(res.categories);
      } else {
        message.error(res.message || "Failed to load categories");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Convert image file to base64 if exists
      let imageBase64 = null;
      if (imageList[0]?.originFileObj) {
        imageBase64 = await fileToBase64(imageList[0].originFileObj);
      }

      const payload = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        parentId: values.parentId !== undefined && values.parentId !== null && values.parentId !== ''
          ? Number(values.parentId)
          : null,
        image: imageBase64
      };

      let res;

      if (editingCategory) {
        res = await updateCategory(editingCategory.id, payload);
      } else {
        res = await createCategory(payload);
      }

      if (res.success) {
        message.success("Saved successfully");
        setIsModalVisible(false);
        form.resetFields();
        setImageList([]);
        loadCategories();
      } else {
        message.error(res.message || "Failed to save");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== false,
      parentId: category.parent?.id
    });

    setImageList(
      category.image
        ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${category.image}`
          }
        ]
        : []
    );
    setIsModalVisible(true);
  };
  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        message.success("Deleted");
        loadCategories();
      }
      else {
        message.error(res.message);
      }
    }
    catch (error) {
      message.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };
  const filteredCategories = categories.filter(category => {
    const matchesSearch = (category.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchText.toLowerCase()));
    return matchesSearch;
  });
  const getParentCategories = () => {
    return categories.filter(c => !c.parent);
  };
  const skeletonRows = Array.from({ length: 6 }).map((_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  const columns = [

    {
      title: <span>Category</span>,
      key: "category",

      render: (_, record) => {

        // Skeleton
        if (record.isSkeleton) {
          return (
            <Space align="start">

              <Skeleton.Image
                active
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6
                }}
              />

              <div>
                <Skeleton.Input
                  active
                  size="small"
                  style={{
                    width: 120,
                    height: 18,
                    borderRadius: 6
                  }}
                />
              </div>

            </Space>
          );
        }

        const categoryName = record.parent
          ? record.parent.name
          : record.name;

        const imageUrl =
          record.parent?.image || record.image;

        const fullImageUrl = imageUrl
          ? `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${imageUrl}`
          : null;

        return (
          <Space align="start">

            {fullImageUrl ? (

              <img
                src={fullImageUrl}
                alt={categoryName}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: 'cover',
                  borderRadius: 6,
                  border: '1px solid #f0f0f0'
                }}
              />

            ) : (

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: 10
                }}
              >
                No Img
              </div>
            )}

            <span>{categoryName}</span>

          </Space>
        );
      },
    },

    {
      title: <span>Sub Category</span>,
      key: "subCategory",

      render: (_, record) => {

        if (record.isSkeleton) {
          return (
            <Skeleton.Input
              active
              size="small"
              style={{
                width: 100,
                height: 18,
                borderRadius: 6
              }}
            />
          );
        }

        return (
          <span>
            {record.parent ? record.name : "-"}
          </span>
        );
      },
    },

    {
      title: <span>Description</span>,
      dataIndex: "description",
      key: "description",

      render: (text, record) => {

        if (record.isSkeleton) {
          return (
            <Skeleton.Input
              active
              size="small"
              style={{
                width: '80%',
                minWidth: 120,
                maxWidth: 220,
                height: 18,
                borderRadius: 6
              }}
            />
          );
        }

        return (
          <span>
            {text || "-"}
          </span>
        );
      },
    },

    {
      title: <span>Status</span>,
      dataIndex: "isActive",
      key: "isActive",

      render: (isActive, record) => {

        if (record.isSkeleton) {
          return (
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 80,
                height: 24,
                borderRadius: 20
              }}
            />
          );
        }

        return (
          <Tag color={isActive !== false ? "green" : "red"}>
            {isActive !== false ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
    },

    {
      title: <span>Actions</span>,
      key: "actions",

      render: (_, record) => {

        if (record.isSkeleton) {
          return (
            <Space size="small">

              <Skeleton.Button
                active
                size="small"
                shape="circle"
              />

              <Skeleton.Button
                active
                size="small"
                shape="circle"
              />

            </Space>
          );
        }

        return (
          <Space size="small">

            <Button
              size='small'
            
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
            </Button>

            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size='small'
                
                danger
                icon={<DeleteOutlined />}
              >
              </Button>
            </Popconfirm>

          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Card>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Search
            placeholder="Search categories..."
            size="small"
            className="small-search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }} // 🔥 control width here
          />
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setImageList([]);
              setIsModalVisible(true);
            }}
          >
            Add Category
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={loading ? skeletonRows : filteredCategories}
          rowKey="id"
          size='small'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </Card>
      <CategoryModal
        form={form}
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
        parentCategories={getParentCategories()}
        imageList={imageList}
        setImageList={setImageList}
        loading={loading}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      />
    </div>
  );
};

export default Categories;

