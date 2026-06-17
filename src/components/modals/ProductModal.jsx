// import {
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Modal,
//   Row,
//   Select,
//   Switch,
//   Typography,
//   Upload
// } from 'antd';
// import { useEffect } from 'react';

// const { Text } = Typography;

// const { TextArea } = Input;
// const { Option } = Select;

// const ProductModal = ({
//   visible,
//   onCancel,
//   onSubmit,
//   initialValues,
//   categories,
//   loading,
//   imageList,
//   setImageList,
//   title,
//   onDeleteImage,
//   onAddImage
// }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (visible) {
//       if (initialValues) {
//         form.setFieldsValue({
//           ...initialValues,
//           keywords: Array.isArray(
//             initialValues?.keywords
//           )
//             ? initialValues.keywords.join(', ')
//             : initialValues?.keywords,
//         });
//         if (initialValues?.images) {
//           setImageList(
//             initialValues.images.map((img) => ({
//               uid: img.id,
//               id: img.id,
//               name: img.image,
//               status: 'done',
//               image: img.image,
//               url: `${import.meta.env.VITE_GRAPHQL_URI
//                 .replace('/graphql/', '')
//                 .replace('/graphql', '')}/media/${img.image}`,
//             }))
//           );
//         }
//       } else {
//         form.resetFields();
//         setImageList([]);
//       }
//     }
//   }, [
//     visible, initialValues, form, setImageList
//   ]);

//   const uploadProps = {

//     name: 'file',

//     multiple: true,

//     listType: 'picture-card',

//     fileList: imageList,

//     customRequest: async ({
//       file,
//       onSuccess,
//       onError
//     }) => {

//       try {

//         // EDIT MODE
//         if (
//           initialValues?.id &&
//           onAddImage
//         ) {

//           const res = await onAddImage(
//             initialValues.id,
//             file
//           );

//           if (res) {

//             message.success(
//               'Image uploaded successfully'
//             );

//             await onSuccess?.('ok');

//             setImageList((prev) => [


//               ...prev,

//               {
//                 uid: res.id,
//                 id: res.id,
//                 name: res.image,
//                 status: 'done',
//                 image: res.image,
//                 url: `${import.meta.env.VITE_GRAPHQL_URI
//                   .replace('/graphql/', '')
//                   .replace('/graphql', '')}/media/${res.image}`,
//               }
//             ]);
//           } else {
//             throw new Error(
//               'Upload failed'
//             );
//           }

//         } else {
//           // ADD PRODUCT MODE
//           const previewUrl = URL.createObjectURL(file);

//           setImageList((prev) => [
//             ...prev,
//             {
//               uid: file.uid,
//               name: file.name,
//               status: 'done',
//               originFileObj: file,
//               thumbUrl: previewUrl,
//               url: previewUrl,
//             }
//           ]);
//           onSuccess?.('ok');
//         }
//       } catch (error) {
//         console.error(error);
//         message.error(
//           'Image upload failed'
//         );
//         onError?.(error);
//       }
//     },
//     onRemove: async (file) => {

//       // EXISTING SERVER IMAGE

//       if (file.id && onDeleteImage) {

//         try {

//           const result =
//             await onDeleteImage(file.id);

//           if (!result?.success) {

//             message.error(
//               result.message ||
//               'Failed to delete image'
//             );

//             return false;
//           }

//           // IMPORTANT:
//           // DO NOT manually setImageList here

//           return true;

//         } catch (error) {

//           console.error(error);

//           message.error(
//             'Failed to delete image'
//           );

//           return false;
//         }
//       }

//       // LOCAL IMAGE
//       return true;
//     },
//     beforeUpload: (file) => {
//       const isImage =
//         file.type.startsWith('image/');
//       if (!isImage) {
//         message.error(
//           'You can only upload image files!'
//         );
//         return Upload.LIST_IGNORE;
//       }
//       const isLt5M =
//         file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error(
//           'Image must be smaller than 5MB!'
//         );
//         return Upload.LIST_IGNORE;
//       }
//       return true;
//     },
//   };

//   const handleSubmit = async (
//     values
//   ) => {
//     try {
//       const productData = {
//         ...values,
//         shortDescription:
//           values.shortDescription,
//         keywords: values.keywords
//           ? values.keywords
//             .split(',')
//             .map((k) => k.trim())
//             .filter(Boolean)
//           : [],
//         deliveryRuleDays:
//           values.deliveryRuleDays
//             ? Number(
//               values.deliveryRuleDays
//             )
//             : null,
//         categoryId:
//           values.categoryId,
//         price: parseFloat(
//           values.price
//         ),
//         discountPrice:
//           values.discountPrice
//             ? parseFloat(
//               values.discountPrice
//             )
//             : null,
//         isActive:
//           values.isActive !== false,
//         isFeatured:
//           values.isFeatured === true,
//         measureValue:
//           values.measureValue || null,
//       };
//       // ONLY FOR NEW PRODUCT
//       const imageData =
//         imageList
//           .filter(
//             (file) =>
//               file.originFileObj
//           )
//           .map(
//             (file) =>
//               file.originFileObj
//           );
//       await onSubmit(
//         productData,
//         imageData
//       );
//       form.resetFields();
//       setImageList([]);
//     } catch (error) {
//       console.error(
//         'Submit error:',
//         error
//       );
//     }
//   };

//   return (
//     <Modal
//       title={title}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       // width={650}
//       centered
//       destroyOnHidden
//       styles={{
//         body: {
//           maxHeight: "70vh",   // 🔥 key fix
//           overflowY: "auto",
//           paddingRight: 8
//         }
//       }}
//     >
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>

//         {/* 🔹 BASIC INFO */}
//         <Text strong style={{ fontSize: 14 }}>Basic Information</Text>
//         <Divider style={{ margin: "4px 0 8px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="name"
//               label="Product Name"
//               rules={[{ required: true, message: "Enter product name" }]}
//             >
//               <Input placeholder="e.g. ABC" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               name="sku"
//               label="SKU"
//               rules={[{ required: true, message: "Enter SKU" }]}
//             >
//               <Input placeholder="e.g. PR-001" />
//             </Form.Item>
//           </Col>
//         </Row>


//         <Form.Item
//           name="description"
//           label="Description"
//         >
//           <TextArea
//             rows={2}
//             placeholder="Enter product description..."
//           />
//         </Form.Item>
//         <Form.Item
//           name="shortDescription"
//           label="Short Description"
//         >
//           <Input
//             placeholder="Enter short description"
//           />
//         </Form.Item>
//         <Form.Item
//           name="keywords"
//           label="Keywords"
//         >
//           <Input
//             placeholder="Enter keywords"
//           />
//         </Form.Item>
//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>


//             <Form.Item
//               name="deliveryRuleDays"
//               label="Delivery Rule Days"
//               rules={[
//                 {
//                   required: true,
//                   message: 'Enter delivery days'
//                 }
//               ]}
//             >
//               <InputNumber
//                 min={1}
//                 style={{ width: '100%' }}
//                 placeholder="e.g. 2"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 PRICING */}
//         <Text strong style={{ fontSize: 14 }}>Pricing</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="price"
//               label="Price"
//               rules={[{ required: true, message: "Enter price" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter price"
//               />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item name="discountPrice" label="Discount Price">
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Optional"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 UNIT & MEASURE */}
//         <Text strong style={{ fontSize: 14 }}>Unit & Measure</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="measureValue"
//               label="Measure Value"
//               rules={[{ required: true, message: "Enter measure value" }]}
//             >
//               <Input
//                 style={{ width: "100%" }}
//                 placeholder="e.g. 2"
//               />
//             </Form.Item>
//           </Col>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="unit"
//               label="Unit"
//               rules={[{ required: true, message: "Select a unit" }]}
//             >
//               <Select placeholder="Select a unit">
//                 <Option value="kg">Kilogram</Option>
//                 <Option value="g">Gram</Option>
//                 <Option value="piece">Piece</Option>
//                 <Option value="dozen">Dozen</Option>
//                 <Option value="bunch">Bunch</Option>
//                 <Option value="box">Box</Option>
//               </Select>
//             </Form.Item>
//           </Col>


//         </Row>

//         {/* 🔹 STOCK */}
//         <Text strong style={{ fontSize: 14 }}>Stock</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="quantity"
//               label="Quantity"
//               rules={[{ required: true, message: "Enter quantity" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter quantity"
//               />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               name="reservedQuantity"
//               label="Reserved Quantity"
//               initialValue={0}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter reserved quantity"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 CATEGORY + STATUS */}
//         <Text strong style={{ fontSize: 14 }}>Settings</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={8}>
//             <Form.Item
//               name="categoryId"
//               label="Category"
//               rules={[{ required: true, message: "Select category" }]}
//             >
//               <Select
//                 placeholder="Select category"
//                 disabled={!!initialValues}
//               >
//                 {categories.map((category) => (
//                   <Option key={category.id} value={category.id}>
//                     {category.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={8}>
//             <Form.Item
//               name="isActive"
//               label="Status"
//               valuePropName="checked"
//               initialValue={true}
//             >
//               <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={8}>
//             <Form.Item
//               name="isFeatured"
//               label="Featured"
//               valuePropName="checked"
//               initialValue={false}
//             >
//               <Switch checkedChildren="Yes" unCheckedChildren="No" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 IMAGES */}
//         <Text strong style={{ fontSize: 14 }}>Product Images</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Form.Item name="images">
//           <Upload {...uploadProps}>
//             {imageList.length >= 5 ? null : (
//               <div>
//                 <div style={{ fontSize: 18 }}>+</div>
//                 <div style={{ fontSize: 12 }}>Upload</div>
//               </div>
//             )}
//           </Upload>

//           <Text type="secondary" style={{ fontSize: 12 }}>
//             You can upload up to 5 images
//           </Text>
//         </Form.Item>

//         {/* 🔹 ACTION BUTTONS */}
//         <Divider />

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//           <Button size="small" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="primary" size="small" htmlType="submit" loading={loading}>
//             {initialValues ? "Update Product" : "Add Product"}
//           </Button>
//         </div>

//       </Form>
//     </Modal>
//   );
// };

// export default ProductModal;



// import {
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Modal,
//   Row,
//   Select,
//   Switch,
//   Typography,
//   Upload
// } from 'antd';
// import { useEffect } from 'react';

// const { Text } = Typography;

// const { TextArea } = Input;
// const { Option } = Select;

// const ProductModal = ({
//   visible,
//   onCancel,
//   onSubmit,
//   initialValues,
//   categories,
//   loading,
//   imageList,
//   setImageList,
//   title,
//   onDeleteImage,
//   onAddImage
// }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (visible) {
//       if (initialValues) {
//         form.setFieldsValue({
//           ...initialValues,
//           keywords: Array.isArray(
//             initialValues?.keywords
//           )
//             ? initialValues.keywords.join(', ')
//             : initialValues?.keywords,
//         });
//         if (initialValues?.images) {
//           setImageList(
//             initialValues.images.map((img) => ({
//               uid: img.id,
//               id: img.id,
//               name: img.image,
//               status: 'done',
//               image: img.image,
//               url: `${import.meta.env.VITE_GRAPHQL_URI
//                 .replace('/graphql/', '')
//                 .replace('/graphql', '')}/media/${img.image}`,
//             }))
//           );
//         }
//       } else {
//         form.resetFields();
//         setImageList([]);
//       }
//     }
//   }, [
//     visible, initialValues, form, setImageList
//   ]);

//   const uploadProps = {

//     name: 'file',

//     multiple: true,

//     listType: 'picture-card',

//     fileList: imageList,

//     customRequest: async ({
//       file,
//       onSuccess,
//       onError
//     }) => {

//       try {

//         // EDIT MODE
//         if (
//           initialValues?.id &&
//           onAddImage
//         ) {

//           const res = await onAddImage(
//             initialValues.id,
//             file
//           );

//           if (res) {

//             message.success(
//               'Image uploaded successfully'
//             );

//             await onSuccess?.('ok');

//             setImageList((prev) => [


//               ...prev,

//               {
//                 uid: res.id,
//                 id: res.id,
//                 name: res.image,
//                 status: 'done',
//                 image: res.image,
//                 url: `${import.meta.env.VITE_GRAPHQL_URI
//                   .replace('/graphql/', '')
//                   .replace('/graphql', '')}/media/${res.image}`,
//               }
//             ]);
//           } else {
//             throw new Error(
//               'Upload failed'
//             );
//           }

//         } else {
//           // ADD PRODUCT MODE
//           const previewUrl = URL.createObjectURL(file);

//           setImageList((prev) => [
//             ...prev,
//             {
//               uid: file.uid,
//               name: file.name,
//               status: 'done',
//               originFileObj: file,
//               thumbUrl: previewUrl,
//               url: previewUrl,
//             }
//           ]);
//           onSuccess?.('ok');
//         }
//       } catch (error) {
//         console.error(error);
//         message.error(
//           'Image upload failed'
//         );
//         onError?.(error);
//       }
//     },
//     onRemove: async (file) => {

//       // EXISTING SERVER IMAGE

//       if (file.id && onDeleteImage) {

//         try {

//           const result =
//             await onDeleteImage(file.id);

//           if (!result?.success) {

//             message.error(
//               result.message ||
//               'Failed to delete image'
//             );

//             return false;
//           }

//           // IMPORTANT:
//           // DO NOT manually setImageList here

//           return true;

//         } catch (error) {

//           console.error(error);

//           message.error(
//             'Failed to delete image'
//           );

//           return false;
//         }
//       }

//       // LOCAL IMAGE
//       return true;
//     },
//     beforeUpload: (file) => {
//       const isImage =
//         file.type.startsWith('image/');
//       if (!isImage) {
//         message.error(
//           'You can only upload image files!'
//         );
//         return Upload.LIST_IGNORE;
//       }
//       const isLt5M =
//         file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error(
//           'Image must be smaller than 5MB!'
//         );
//         return Upload.LIST_IGNORE;
//       }
//       return true;
//     },
//   };

//   const handleSubmit = async (
//     values
//   ) => {
//     try {
//       const productData = {
//         ...values,
//         shortDescription:
//           values.shortDescription,
//         keywords: values.keywords
//           ? values.keywords
//             .split(',')
//             .map((k) => k.trim())
//             .filter(Boolean)
//           : [],
//         deliveryRuleDays:
//           values.deliveryRuleDays
//             ? Number(
//               values.deliveryRuleDays
//             )
//             : null,
//         categoryId:
//           values.categoryId,
//         price: parseFloat(
//           values.price
//         ),
//         discountPrice:
//           values.discountPrice
//             ? parseFloat(
//               values.discountPrice
//             )
//             : null,
//         isActive:
//           values.isActive !== false,
//         isFeatured:
//           values.isFeatured === true,
//         measureValue:
//           values.measureValue || null,
//       };
//       // ONLY FOR NEW PRODUCT
//       const imageData =
//         imageList
//           .filter(
//             (file) =>
//               file.originFileObj
//           )
//           .map(
//             (file) =>
//               file.originFileObj
//           );
//       await onSubmit(
//         productData,
//         imageData
//       );
//       form.resetFields();
//       setImageList([]);
//     } catch (error) {
//       console.error(
//         'Submit error:',
//         error
//       );
//     }
//   };

//   return (
//     <Modal
//       title={title}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       // width={650}
//       centered
//       destroyOnHidden
//       styles={{
//         body: {
//           maxHeight: "70vh",   // 🔥 key fix
//           overflowY: "auto",
//           paddingRight: 8
//         }
//       }}
//     >
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>

//         {/* 🔹 BASIC INFO */}
//         <Text strong style={{ fontSize: 14 }}>Basic Information</Text>
//         <Divider style={{ margin: "4px 0 8px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="name"
//               label="Product Name"
//               rules={[{ required: true, message: "Enter product name" }]}
//             >
//               <Input placeholder="e.g. ABC" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               name="sku"
//               label="SKU"
//               rules={[{ required: true, message: "Enter SKU" }]}
//             >
//               <Input placeholder="e.g. PR-001" />
//             </Form.Item>
//           </Col>
//         </Row>


//         <Form.Item
//           name="description"
//           label="Description"
//         >
//           <TextArea
//             rows={2}
//             placeholder="Enter product description..."
//           />
//         </Form.Item>
//         <Form.Item
//           name="shortDescription"
//           label="Short Description"
//         >
//           <Input
//             placeholder="Enter short description"
//           />
//         </Form.Item>
//         <Form.Item
//           name="keywords"
//           label="Keywords"
//         >
//           <Input
//             placeholder="Enter keywords"
//           />
//         </Form.Item>
//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>


//             <Form.Item
//               name="deliveryRuleDays"
//               label="Delivery Rule Days"
//               rules={[
//                 {
//                   required: true,
//                   message: 'Enter delivery days'
//                 }
//               ]}
//             >
//               <InputNumber
//                 min={1}
//                 style={{ width: '100%' }}
//                 placeholder="e.g. 2"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 PRICING */}
//         <Text strong style={{ fontSize: 14 }}>Pricing</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="price"
//               label="Price"
//               rules={[{ required: true, message: "Enter price" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter price"
//               />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item name="discountPrice" label="Discount Price">
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Optional"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 UNIT & MEASURE */}
//         <Text strong style={{ fontSize: 14 }}>Unit & Measure</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="measureValue"
//               label="Measure Value"
//               rules={[{ required: true, message: "Enter measure value" }]}
//             >
//               <Input
//                 style={{ width: "100%" }}
//                 placeholder="e.g. 2"
//               />
//             </Form.Item>
//           </Col>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="unit"
//               label="Unit"
//               rules={[{ required: true, message: "Select a unit" }]}
//             >
//               <Select placeholder="Select a unit">
//                 <Option value="kg">Kilogram</Option>
//                 <Option value="g">Gram</Option>
//                 <Option value="piece">Piece</Option>
//                 <Option value="dozen">Dozen</Option>
//                 <Option value="bunch">Bunch</Option>
//                 <Option value="box">Box</Option>
//               </Select>
//             </Form.Item>
//           </Col>


//         </Row>

//         {/* 🔹 STOCK */}
//         <Text strong style={{ fontSize: 14 }}>Stock</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               name="quantity"
//               label="Quantity"
//               rules={[{ required: true, message: "Enter quantity" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter quantity"
//               />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               name="reservedQuantity"
//               label="Reserved Quantity"
//               initialValue={0}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="Enter reserved quantity"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 CATEGORY + STATUS */}
//         <Text strong style={{ fontSize: 14 }}>Settings</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Row gutter={[8, 4]}>
//           <Col xs={24} md={8}>
//             <Form.Item
//               name="categoryId"
//               label="Category"
//               rules={[{ required: true, message: "Select category" }]}
//             >
//               <Select
//                 placeholder="Select category"
//                 disabled={!!initialValues}
//               >
//                 {categories.map((category) => (
//                   <Option key={category.id} value={category.id}>
//                     {category.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={8}>
//             <Form.Item
//               name="isActive"
//               label="Status"
//               valuePropName="checked"
//               initialValue={true}
//             >
//               <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={8}>
//             <Form.Item
//               name="isFeatured"
//               label="Featured"
//               valuePropName="checked"
//               initialValue={false}
//             >
//               <Switch checkedChildren="Yes" unCheckedChildren="No" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 🔹 IMAGES */}
//         <Text strong style={{ fontSize: 14 }}>Product Images</Text>
//         <Divider style={{ margin: "8px 0 16px" }} />

//         <Form.Item name="images">
//           <Upload {...uploadProps}>
//             {imageList.length >= 5 ? null : (
//               <div>
//                 <div style={{ fontSize: 18 }}>+</div>
//                 <div style={{ fontSize: 12 }}>Upload</div>
//               </div>
//             )}
//           </Upload>

//           <Text type="secondary" style={{ fontSize: 12 }}>
//             You can upload up to 5 images
//           </Text>
//         </Form.Item>

//         {/* 🔹 ACTION BUTTONS */}
//         <Divider />

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//           <Button size="small" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="primary" size="small" htmlType="submit" loading={loading}>
//             {initialValues ? "Update Product" : "Add Product"}
//           </Button>
//         </div>

//       </Form>
//     </Modal>
//   );
// };

// export default ProductModal;



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
import { useEffect, useRef } from 'react';
import { useEffect, useRef } from 'react';

const { Text } = Typography;

const { TextArea } = Input;
const { Option } = Select;

// Build a full media URL from a relative path returned by the backend
const buildMediaUrl = (path) =>
  `${import.meta.env.VITE_GRAPHQL_URI
    .replace('/graphql/', '')
    .replace('/graphql', '')}/media/${path}`;

// Build a full media URL from a relative path returned by the backend
const buildMediaUrl = (path) =>
  `${import.meta.env.VITE_GRAPHQL_URI
    .replace('/graphql/', '')
    .replace('/graphql', '')}/media/${path}`;

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
  onDeleteImage,
  onAddImage
  onDeleteImage,
  onAddImage
}) => {
  const [form] = Form.useForm();

  // Tracks file uids that are currently being removed (or were just removed),
  // so a single click can never trigger onDeleteImage twice for the same file.
  const removingRef = useRef(new Set());

  // Tracks file uids that are currently being removed (or were just removed),
  // so a single click can never trigger onDeleteImage twice for the same file.
  const removingRef = useRef(new Set());

  useEffect(() => {
    if (visible) {
      if (initialValues) {

        form.setFieldsValue({
          ...initialValues,

          storefrontQuantity: initialValues?.storefrontQuantity ?? 0,
          systemQuantity: initialValues?.systemQuantity ?? 0,
          storefrontReservedQuantity: initialValues?.storefrontReservedQuantity ?? 0,
          systemReservedQuantity: initialValues?.systemReservedQuantity ?? 0,
          bulkOrderPrice: initialValues?.bulkOrderPrice ?? null,
          keywords: Array.isArray(initialValues?.keywords)
            ? initialValues.keywords.join(', ')
            : initialValues?.keywords,
        });
        if (initialValues?.images) {
          setImageList(
            initialValues.images.map((img) => ({
              uid: img.id,
              id: img.id,
              name: img.image,
              status: 'done',
              image: img.image,
              url: buildMediaUrl(img.image),
              thumbUrl: buildMediaUrl(img.image),
            }))
          );
        }
        // Reset removal guard whenever we (re)load a product's images
        removingRef.current = new Set();
      } else {
        form.resetFields();
        setImageList([]);
        removingRef.current = new Set();
        setImageList([]);
        removingRef.current = new Set();
      }
    }
  }, [
    visible, initialValues, form, setImageList
  ]);
}, [
  visible, initialValues, form, setImageList
]);

const uploadProps = {


  name: 'file',


  multiple: true,


  listType: 'picture-card',


  fileList: imageList,

  customRequest: async ({
    file,
    onSuccess,
    onError
  }) => {

    try {

      // EDIT MODE
      if (
        initialValues?.id &&
        onAddImage
      ) {

        const res = await onAddImage(
          initialValues.id,
          file
        );

        if (res) {

          message.success(
            'Image uploaded successfully'
          );

          // await onSuccess?.('ok');
          // Notification delegated to onAddImage callback if needed

          // No local success toast here; rely on onAddImage to notify
          // { id, image } | { id, url } | { productImage: { id, image } }
          const imageEntity = res.productImage || res;
          const imagePath = imageEntity.image || imageEntity.path || null;
          const resolvedUrl = imagePath
            ? buildMediaUrl(imagePath)
            : (imageEntity.url || URL.createObjectURL(file));

          setImageList((prev) => [
            ...prev,
            {
              uid: imageEntity.id,
              id: imageEntity.id,
              name: imagePath || file.name,
              status: 'done',
              image: imagePath,
              url: resolvedUrl,
              thumbUrl: resolvedUrl,
            }
          ]);
        } else {
          throw new Error(
            'Upload failed'
          );
        }

      } else {
        // ADD PRODUCT MODE
        const previewUrl = URL.createObjectURL(file);

        setImageList((prev) => [
          ...prev,
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            originFileObj: file,
            thumbUrl: previewUrl,
            url: previewUrl,
          }
        ]);
        onSuccess?.('ok');
      }
    } catch (error) {
      console.error(error);
      message.error(
        'Image upload failed'
      );
      onError?.(error);
    }

    customRequest: async ({
      file,
      onSuccess,
      onError
    }) => {

      try {

        // EDIT MODE
        if (
          initialValues?.id &&
          onAddImage
        ) {

          const res = await onAddImage(
            initialValues.id,
            file
          );

          if (res) {

            message.success(
              'Image uploaded successfully'
            );

            // await onSuccess?.('ok');
            // Notification delegated to onAddImage callback if needed

            // No local success toast here; rely on onAddImage to notify
            // { id, image } | { id, url } | { productImage: { id, image } }
            const imageEntity = res.productImage || res;
            const imagePath = imageEntity.image || imageEntity.path || null;
            const resolvedUrl = imagePath
              ? buildMediaUrl(imagePath)
              : (imageEntity.url || URL.createObjectURL(file));

            setImageList((prev) => [
              ...prev,
              {
                uid: imageEntity.id,
                id: imageEntity.id,
                name: imagePath || file.name,
                status: 'done',
                image: imagePath,
                url: resolvedUrl,
                thumbUrl: resolvedUrl,
              }
            ]);
          } else {
            throw new Error(
              'Upload failed'
            );
          }

        } else {
          // ADD PRODUCT MODE
          const previewUrl = URL.createObjectURL(file);

          setImageList((prev) => [
            ...prev,
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              originFileObj: file,
              thumbUrl: previewUrl,
              url: previewUrl,
            }
          ]);
          onSuccess?.('ok');
        }
      } catch (error) {
        console.error(error);
        message.error(
          'Image upload failed'
        );
        onError?.(error);
      }
    },
      onRemove: async (file) => {

        // EXISTING SERVER IMAGE
        if (file.id && onDeleteImage) {

          // Guard: if this file is already being removed (or was already
          // removed) ignore the duplicate call entirely — no second API
          // call, no second toast.
          if (removingRef.current.has(file.uid)) {
            return false;
          }
          removingRef.current.add(file.uid);


          // Guard: if this file is already being removed (or was already
          // removed) ignore the duplicate call entirely — no second API
          // call, no second toast.
          if (removingRef.current.has(file.uid)) {
            return false;
          }
          removingRef.current.add(file.uid);

          try {
            const result = await onDeleteImage(file.id);

            if (!result) {
              message.error('Failed to delete image');
              removingRef.current.delete(file.uid);
              return false;
            }


            message.success('Image deleted successfully');

            // Manually remove from controlled fileList; return false to let us handle UI
            setImageList((prev) => prev.filter((img) => img.uid !== file.uid));
            // Clean up guard
            removingRef.current.delete(file.uid);
            return false; // prevent Antd default removal, list already updated

            // Manually remove from controlled fileList; return false to let us handle UI
            setImageList((prev) => prev.filter((img) => img.uid !== file.uid));
            // Clean up guard
            removingRef.current.delete(file.uid);
            return false; // prevent Antd default removal, list already updated
          } catch (error) {
            console.error(error);
            console.error(error);
            message.error('Failed to delete image');
            removingRef.current.delete(file.uid);
            removingRef.current.delete(file.uid);
            return false;
          }
        }

        // LOCAL IMAGE (not yet uploaded to server)
        setImageList((prev) => prev.filter((img) => img.uid !== file.uid));
        return false; // manually handled removal

        // LOCAL IMAGE (not yet uploaded to server)
        setImageList((prev) => prev.filter((img) => img.uid !== file.uid));
        return false; // manually handled removal
      },
        beforeUpload: (file) => {
          const isImage =
            file.type.startsWith('image/');
          const isImage =
            file.type.startsWith('image/');
          if (!isImage) {
            message.error(
              'You can only upload image files!'
            );
            return Upload.LIST_IGNORE;
            message.error(
              'You can only upload image files!'
            );
            return Upload.LIST_IGNORE;
          }
          const isLt5M =
            file.size / 1024 / 1024 < 5;
          const isLt5M =
            file.size / 1024 / 1024 < 5;
          if (!isLt5M) {
            message.error(
              'Image must be smaller than 5MB!'
            );
            return Upload.LIST_IGNORE;
            message.error(
              'Image must be smaller than 5MB!'
            );
            return Upload.LIST_IGNORE;
          }
          return true;
          return true;
        },
  };

  const handleSubmit = async (
    values
  ) => {
    const handleSubmit = async (
      values
    ) => {
      try {
        const productData = {
          ...values,
          shortDescription:
            values.shortDescription,
          keywords: values.keywords
            ? values.keywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
            : [],
          deliveryRuleDays: values.deliveryRuleDays ? Number(values.deliveryRuleDays) : null,
          categoryId: values.categoryId,
          price: parseFloat(values.price),
          discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : null,
          bulkOrderPrice: values.bulkOrderPrice ? parseFloat(values.bulkOrderPrice) : null,
          isActive:
            values.isActive !== false,
          isFeatured:
            values.isFeatured === true,
          measureValue:
            values.measureValue || null,
          storefrontQuantity: Number(values.storefrontQuantity),
          systemQuantity: Number(values.systemQuantity),
          storefrontReservedQuantity: Number(values.storefrontReservedQuantity),
          systemReservedQuantity: Number(values.systemReservedQuantity),
        };
        // ONLY FOR NEW PRODUCT
        const imageData =
          imageList
            .filter(
              (file) =>
                file.originFileObj
            )
            .map(
              (file) =>
                file.originFileObj
            );
        await onSubmit(
          productData,
          imageData
        );
        // ONLY FOR NEW PRODUCT
        const imageData =
          imageList
            .filter(
              (file) =>
                file.originFileObj
            )
            .map(
              (file) =>
                file.originFileObj
            );
        await onSubmit(
          productData,
          imageData
        );
        form.resetFields();
        setImageList([]);
      } catch (error) {
        console.error(
          'Submit error:',
          error
        );
        console.error(
          'Submit error:',
          error
        );
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


          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea
              rows={2}
              placeholder="Enter product description..."
            />
          </Form.Item>
          <Form.Item
            name="shortDescription"
            label="Short Description"
          >
            <Input
              placeholder="Enter short description"
            />
          </Form.Item>
          <Form.Item
            name="keywords"
            label="Keywords"
          >
            <Input
              placeholder="Enter keywords"
            />
          </Form.Item>
          <Row gutter={[8, 4]}>
            <Col xs={24} md={12}>


              <Form.Item
                name="deliveryRuleDays"
                label="Delivery Rule Days"
                rules={[
                  {
                    required: true,
                    message: 'Enter delivery days'
                  }
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="e.g. 2"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 🔹 PRICING */}
          <Text strong style={{ fontSize: 14 }}>Pricing</Text>
          <Divider style={{ margin: "8px 0 16px" }} />

          <Row gutter={[8, 4]}>
            <Col xs={24} md={8}>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Enter price' }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter price" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="discountPrice" label="Discount Price">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              {/* ── NEW FIELD ── */}
              <Form.Item name="bulkOrderPrice" label="Bulk Order Price">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Optional" />
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


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storefrontQuantity"
                label="Storefront Qty"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="systemQuantity"
                label="System Qty"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="storefrontReservedQuantity"
                label="Storefront Reserved"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="systemReservedQuantity"
                label="System Reserved"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
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

          <Form.Item
            name="images"
            extra="You can upload up to 5 images"
          >
            <Upload {...uploadProps}>
              {imageList.length >= 5 ? null : (
                <div>
                  <div style={{ fontSize: 18 }}>+</div>
                  <div style={{ fontSize: 12 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* 🔹 ACTION BUTTONS */}
          <Divider />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button size="small" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" size="small" htmlType="submit" loading={loading}>
              {initialValues ? "Update Product" : "Add Product"}
            </Button>
          </div>

        </Form>
      </Modal>
    );
  };

  export default ProductModal;