// import {
//   HomeOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
//   ShoppingCartOutlined
// } from '@ant-design/icons';
// import {
//   Button,
//   Card,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Modal,
//   Row,
//   Select,
//   Space,
//   Switch,
//   Table
// } from 'antd';
// import dayjs from 'dayjs';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import { addShippingAddress } from '../../../api/orders';
// import { getAllProducts } from '../../../api/products';
// import AddCustomerModal from '../../../components/modals/AddCustomerModal';
// import ShippingAddressModal from '../../../components/modals/ShippingAddressModal';
// import useOrders from '../../../hooks/useOrders';

// const { Option } = Select;
// const { TextArea } = Input;

// const buildEmptyItem = () => ({
//   id: Date.now().toString(),
//   productId: null,
//   price: 0,
//   discountPrice: 0,
//   bulkOrderPrice: 0,
//   quantity: 1,
//   total: 0,
// });

// const ManualOrderModal = ({ visible, onClose, onOrderCreated, defaultOrderType = 'normal' }) => {
//   const [form] = Form.useForm();
//   const [addressForm] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [orderItems, setOrderItems] = useState([buildEmptyItem()]);
//   const [advanceBooking, setAdvanceBooking] = useState(false);
//   const [deliveryDate, setDeliveryDate] = useState(null);
//   const [orderType, setOrderType] = useState('normal');
//   const [paymentMethod, setPaymentMethod] = useState('cod');
//   const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
//   const [addAddressLoading, setAddAddressLoading] = useState(false);
//   const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

//   const [customerSearchText, setCustomerSearchText] = useState('');

//   const [productList, setProductList] = useState([]);
//   const [productListLoading, setProductListLoading] = useState(false);
//   const [productSearchText, setProductSearchText] = useState('');
//   const [productsNextCursor, setProductsNextCursor] = useState(null);
//   const [productsHasMore, setProductsHasMore] = useState(false);
//   const [selectedProductsCache, setSelectedProductsCache] = useState({});

//   const searchTimeoutRef = useRef(null);

//   const {
//     customers,
//     customersLoading,
//     customersHasMore,
//     fetchCustomers,
//     createOrder,
//     upsertCustomer,
//   } = useOrders();

//   const loadProducts = async (search = '', append = false) => {
//     setProductListLoading(true);
//     try {
//       const normalizedSearch = (search || '').trim();
//       const after = append ? productsNextCursor : null;
//       const res = await getAllProducts(10, after, normalizedSearch || null);
//       if (res.success) {
//         const transformed = (res.products || []).map((p) => ({
//           id: p.id,
//           name: p.name,
//           price: p.price || 0,
//           discountPrice: p.discountPrice || 0,
//           bulkOrderPrice: p.bulkOrderPrice || 0,
//           stock: p.stock || {},
//           status: p.isActive ? 'active' : 'inactive',
//           isActive: p.isActive,
//           category: p.category || null,
//           sku: p.sku || `PRD-${p.id}`,
//           images: p.images || [],
//           unit: p.unit,
//           measureValue: p.measureValue,
//         }));
//         setProductList((prev) => (append ? [...prev, ...transformed] : transformed));
//         setProductsNextCursor(res.nextCursor);
//         setProductsHasMore(res.hasMore);
//       }
//     } catch (err) {
//       message.error('Failed to fetch products: ' + err.message);
//     } finally {
//       setProductListLoading(false);
//     }
//   };

//   const handleProductSearch = (value) => {
//     const searchTextVal = value || '';
//     setProductSearchText(searchTextVal);

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       loadProducts(searchTextVal, false);
//     }, 400);
//   };

//   const handleProductPopupScroll = (event) => {
//     const target = event.target;
//     if (
//       target.scrollTop + target.offsetHeight >= target.scrollHeight - 16 &&
//       productsHasMore &&
//       !productListLoading
//     ) {
//       loadProducts(productSearchText, true);
//     }
//   };

//   useEffect(() => {
//     if (visible) {
//       setCustomerSearchText('');
//       fetchCustomers('', false);

//       // Load initial products list
//       setProductSearchText('');
//       setProductList([]);
//       setProductsNextCursor(null);
//       setProductsHasMore(false);
//       setSelectedProductsCache({});
//       loadProducts('', false);

//       setOrderItems([buildEmptyItem()]);
//       setSelectedCustomer(null);
//       setSelectedAddress(null);
//       setAdvanceBooking(false);
//       setDeliveryDate(null);
//       setOrderType(defaultOrderType);
//       setPaymentMethod('cod');
//       form.resetFields();
//     }
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [visible, defaultOrderType]);
//   const formatAddress = (address) => {
//     if (!address) return '';
//     const parts = [address.name, address.phone, address.city, address.state, address.pincode];
//     if (address.landmark) parts.push(`Landmark: ${address.landmark}`);
//     return parts.filter(Boolean).join(', ');
//   };

//   const handleCustomerSelect = (customerId) => {
//     const customer = customers.find((c) => c.id === customerId);
//     if (!customer) return;

//     setSelectedCustomer(customer);
//     const defaultAddress = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
//     setSelectedAddress(defaultAddress || null);

//     form.setFieldsValue({
//       customerName: customer.name,
//       customerEmail: customer.email !== 'N/A' ? customer.email : '',
//       customerPhone: customer.phone !== 'N/A' ? customer.phone : '',
//       deliveryAddress: formatAddress(defaultAddress),
//     });
//   };

//   const handleAddressSelect = (addressId) => {
//     const address = selectedCustomer?.addresses?.find((a) => a.id === addressId);
//     if (!address) return;
//     setSelectedAddress(address);
//     form.setFieldsValue({ deliveryAddress: formatAddress(address) });
//   };

//   const handleCustomerSearch = (value) => {
//     setCustomerSearchText(value || '');
//     fetchCustomers(value || '', false);
//   };

//   const handleCustomerPopupScroll = (event) => {
//     const target = event.target;
//     if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 16 && customersHasMore && !customersLoading) {
//       fetchCustomers(customerSearchText, true);
//     }
//   };

//   const handleAddNewAddress = async (values) => {

//     if (!selectedCustomer?.id) {

//       message.error(
//         'Please select customer first'
//       );

//       return;
//     }

//     setAddAddressLoading(true);

//     try {

//       const res = await addShippingAddress(
//         selectedCustomer.id,
//         values
//       );

//       if (res.success) {

//         const newAddress = {
//           id: res.addressId,
//           ...values
//         };

//         // UPDATE LOCAL CUSTOMER
//         const updatedCustomer = {
//           ...selectedCustomer,

//           addresses: [
//             ...(selectedCustomer?.addresses || []),
//             newAddress
//           ],
//         };

//         setSelectedCustomer(updatedCustomer);

//         setSelectedAddress(newAddress);

//         form.setFieldsValue({
//           deliveryAddress:
//             formatAddress(newAddress)
//         });

//         message.success(
//           'Address added successfully'
//         );

//         setAddAddressModalVisible(false);

//         addressForm.resetFields();
//         // Update local customer cache so newly added address persists when re-selecting
//         try {
//           upsertCustomer(updatedCustomer);
//         } catch (e) {
//           // non-critical: continue without failing
//         }

//       } else {

//         message.error(
//           res.message ||
//           'Failed to add address'
//         );
//       }

//     } catch (error) {

//       message.error(
//         'Failed to add address: ' +
//         error.message
//       );

//     } finally {

//       setAddAddressLoading(false);
//     }
//   };

//   const productOptions = useMemo(() => {
//     const optionsMap = new Map();
//     productList.forEach((p) => {
//       optionsMap.set(p.id.toString(), p);
//     });

//     Object.values(selectedProductsCache).forEach((p) => {
//       optionsMap.set(p.id.toString(), p);
//     });

//     return Array.from(optionsMap.values());
//   }, [productList, selectedProductsCache]);

//   const getItemUnitPrice = (item, type = orderType) => {
//     if (type === 'bulk') {
//       return parseFloat(item.bulkOrderPrice || 0);
//     }
//     if (type === 'custom' && item.customPrice !== undefined && item.customPrice !== null) {
//       return parseFloat(item.customPrice || 0);
//     }
//     const actualPrice = parseFloat(item.price || 0);
//     const discountPrice = parseFloat(item.discountPrice || 0);
//     return discountPrice > 0 && discountPrice < actualPrice ? discountPrice : actualPrice;
//   };

//   const calculateItemTotal = (item, type = orderType) => {
//     const unitPrice = getItemUnitPrice(item, type);
//     return (unitPrice || 0) * (item.quantity || 1);
//   };

//   const handleAddItem = () => {
//     setOrderItems((prev) => [...prev, buildEmptyItem()]);
//   };

//   const handleRemoveItem = (itemId) => {
//     if (orderItems.length === 1) {
//       message.warning('At least one item is required');
//       return;
//     }
//     setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
//   };

//   const handleItemChange = (itemId, field, value) => {
//     setOrderItems((prev) => prev.map((item) => {
//       if (item.id !== itemId) return item;
//       const updatedItem = { ...item, [field]: value };

//       if (field === 'productId') {
//         const product = productOptions.find((p) => p.id?.toString() === value?.toString());
//         if (product) {
//           setSelectedProductsCache((prev) => ({
//             ...prev,
//             [product.id.toString()]: product,
//           }));
//           updatedItem.price = parseFloat(product?.price || 0);
//           updatedItem.discountPrice = parseFloat(product?.discountPrice || 0);
//           updatedItem.bulkOrderPrice = parseFloat(product?.bulkOrderPrice || 0);
//         } else {
//           updatedItem.price = 0;
//           updatedItem.discountPrice = 0;
//           updatedItem.bulkOrderPrice = 0;
//         }
//       }

//       updatedItem.total = calculateItemTotal(updatedItem);
//       return updatedItem;
//     }));
//   };

//   const handleOrderTypeChange = (value) => {
//     setOrderType(value);
//     setOrderItems((prev) => prev.map((item) => {
//       const updated = { ...item };
//       updated.total = calculateItemTotal(updated, value);
//       return updated;
//     }));
//   };

//   const calculateTotal = useMemo(
//     () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
//     [orderItems]
//   );

//   const formatCurrency = (amount) => `₹${(amount || 0).toFixed(2)}`;

//   const handleSubmit = async (values) => {
//     if (!selectedCustomer) {
//       message.error('Please select a customer');
//       return;
//     }

//     if (!selectedAddress) {
//       message.error('Please select or add a delivery address');
//       return;
//     }

//     const validItems = orderItems.filter((item) => item.productId && item.quantity > 0);
//     if (!validItems.length) {
//       message.error('Please add at least one valid item');
//       return;
//     }

//     setLoading(true);
//     try {
//       const items = validItems.map((item) => ({
//         productId: parseInt(item.productId, 10),
//         quantity: item.quantity,
//         ...((orderType === 'custom' || orderType === 'bulk') && item.customPrice ? { customPrice: parseFloat(item.customPrice) } : {}),
//       }));
//       const result = await createOrder(selectedCustomer.id, formatAddress(selectedAddress), items, orderType, paymentMethod);

//       if (result.success) {
//         message.success('Order created successfully');
//         onOrderCreated?.();
//         onClose();
//       }
//     } catch (error) {
//       message.error('Failed to create order: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getProductImage = (product) => {
//     const validImage = product?.images?.find((img) => img.image && img.image.trim() !== '');
//     if (!validImage) return null;
//     return validImage.image.startsWith('data:')
//       ? validImage.image
//       : `${import.meta.env.VITE_GRAPHQL_URI.replace('/graphql/', '').replace('/graphql', '')}/media/${validImage.image}`;
//   };

//   const columns = useMemo(() => {
//     const baseColumns = [
//       {
//         title: 'Product',
//         dataIndex: 'productId',
//         key: 'productId',
//         render: (productId, record) => (
//           <Select
//             style={{ width: '100%' }}
//             placeholder="Select product"
//             value={productId}
//             onChange={(value) => handleItemChange(record.id, 'productId', value)}
//             showSearch
//             optionLabelProp="label"
//             filterOption={false}
//             onSearch={handleProductSearch}
//             onPopupScroll={handleProductPopupScroll}
//             notFoundContent={productListLoading ? <span>Loading...</span> : null}
//             dropdownRender={(menu) => (
//               <>
//                 {menu}
//                 {productListLoading && (
//                   <div style={{ textAlign: 'center', padding: '8px', color: '#999' }}>
//                     Loading more...
//                   </div>
//                 )}
//               </>
//             )}
//           >
//             {productOptions.filter((p) => p.isActive).map((product) => {
//               const imageSrc = getProductImage(product);
//               return (
//                 <Option key={product.id} value={product.id} label={product.name}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
//                     <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f5f5f5', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       {imageSrc ? (
//                         <img src={imageSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                       ) : (
//                         <span style={{ fontSize: 18, color: '#999' }}>📦</span>
//                       )}
//                     </div>
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontWeight: 'bold' }}>{product.name}</div>
//                       <div style={{ fontSize: 12, color: '#666' }}>Stock: {product.stock?.quantity ?? 0}</div>
//                     </div>
//                   </div>
//                 </Option>
//               );
//             })}
//           </Select>
//         ),
//       },
//       {
//         title: 'Price',
//         dataIndex: 'price',
//         key: 'price',
//         render: (price, record) => {
//           const actualPrice = parseFloat(price || 0);
//           const discountPrice = parseFloat(record.discountPrice || 0);
//           const displayPrice = discountPrice > 0 && discountPrice < actualPrice ? discountPrice : actualPrice;
//           const hasDiscount = discountPrice > 0 && discountPrice < actualPrice;

//           return hasDiscount ? (
//             <div>
//               <div style={{ fontWeight: 'bold' }}>{formatCurrency(displayPrice)}</div>
//               <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>{formatCurrency(actualPrice)}</div>
//             </div>
//           ) : (
//             <span>{formatCurrency(displayPrice)}</span>
//           );
//         },
//       }
//     ];

//     if (orderType === 'custom') {
//       baseColumns.push({
//         title: 'Custom Price',
//         dataIndex: 'customPrice',
//         key: 'customPrice',
//         render: (customPrice, record) => (
//           <InputNumber
//             min={0}
//             value={customPrice}
//             onChange={(value) => handleItemChange(record.id, 'customPrice', value)}
//             style={{ width: 120 }}
//             formatter={(v) => v ? `₹${v}` : ''}
//             parser={(v) => v.replace(/[^0-9.]/g, '')}
//           />
//         ),
//       });
//     } else if (orderType === 'bulk') {
//       baseColumns.push({
//         title: 'Bulk Price',
//         dataIndex: 'bulkOrderPrice',
//         key: 'bulkOrderPrice',

//         render: (bulkOrderPrice, record) => {
//           const value = parseFloat(bulkOrderPrice || 0);
//           return value > 0 ? (
//             <span
//               style={{
//                 fontWeight: 600,
//                 color: '#722ed1',
//               }}
//             >
//               {formatCurrency(value)}
//             </span>
//           ) : (
//             <span
//               style={{
//                 color: '#999',
//               }}
//             >
//               No Bulk Price
//             </span>
//           );
//         },
//       });

//     }

//     baseColumns.push(
//       {
//         title: 'Quantity',
//         dataIndex: 'quantity',
//         key: 'quantity',
//         render: (quantity, record) => (
//           <InputNumber
//             min={1}
//             max={orderType === 'bulk' ? 99999 : 99}
//             value={quantity}
//             onChange={(value) => handleItemChange(record.id, 'quantity', value)}
//             style={{ width: 80 }}
//           />
//         ),
//       },
//       {
//         title: 'Total',
//         dataIndex: 'total',
//         key: 'total',
//         render: (total) => <span style={{ fontWeight: 'bold' }}>{formatCurrency(total)}</span>,
//       },
//       {
//         title: 'Action',
//         key: 'action',
//         render: (_, record) => (
//           <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => handleRemoveItem(record.id)} size="small" />
//         ),
//       }
//     );

//     return baseColumns;
//   }, [orderType, productOptions, productListLoading, orderItems]);

//   return (
//     <>
//       <Modal
//         title="Take Manual Order"
//         open={visible}
//         onCancel={onClose}
//         footer={null}
//         width={900}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//         >
//           <Card title="Customer Information" size="small">
//             <Row gutter={16}>
//               <Col xs={24} md={12}>
//                 <Form.Item label="Select Customer" required>
//                   <Space style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
//                     <Select
//                       showSearch
//                       placeholder="Type to search customers by name or email..."
//                       filterOption={false}
//                       onSearch={handleCustomerSearch}
//                       onPopupScroll={handleCustomerPopupScroll}
//                       onChange={handleCustomerSelect}
//                       value={selectedCustomer?.id}
//                       notFoundContent={customersLoading ? <span>Loading...</span> : null}
//                       style={{ flex: 1 }}
//                       allowClear
//                       onClear={() => {
//                         setSelectedCustomer(null);
//                         setSelectedAddress(null);
//                         setCustomerSearchText('');
//                         fetchCustomers('', false);
//                         form.resetFields(['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress']);
//                       }}
//                     >
//                       {customers.map((customer) => (
//                         <Option key={customer.id} value={customer.id}>
//                           {customer.name} {customer.email !== 'N/A' ? `(${customer.email})` : ''}
//                         </Option>
//                       ))}
//                     </Select>
//                     <Button
//                       type="primary"
//                       icon={<PlusOutlined />}
//                       onClick={() => setAddCustomerModalVisible(true)}
//                       size="small"
//                     >
//                       Add New
//                     </Button>
//                   </Space>
//                 </Form.Item>
//               </Col>

//             </Row>

//             {selectedCustomer ? (
//               <div style={{
//                 marginTop: 16,
//                 padding: '16px 20px',
//                 borderRadius: '8px',
//                 backgroundColor: '#fafafa',
//                 border: '1px solid #f0f0f0'
//               }}>
//                 <Row gutter={[24, 16]}>
//                   {/* Left Column: Customer Profile */}
//                   <Col xs={24} md={12}>
//                     <div style={{ marginBottom: 12, fontWeight: '600', fontSize: '14px', color: '#262626', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
//                       Customer Profile
//                     </div>
//                     <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//                       <div>
//                         <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Name</div>
//                         <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f1f1f' }}>{selectedCustomer.name}</div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Email</div>
//                         <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f1f1f' }}>{selectedCustomer.email || '—'}</div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Phone</div>
//                         <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f1f1f' }}>{selectedCustomer.phone || '—'}</div>
//                       </div>
//                     </Space>
//                   </Col>

//                   {/* Right Column: Address Details */}
//                   <Col xs={24} md={12}>
//                     <div style={{ marginBottom: 12, fontWeight: '600', fontSize: '14px', color: '#262626', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
//                       Shipping Address
//                     </div>
//                     {selectedCustomer.addresses?.length > 0 ? (
//                       <Space direction="vertical" size="small" style={{ width: '100%' }}>
//                         <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Select Address</div>
//                         <Select
//                           placeholder="Select delivery address"
//                           value={selectedAddress?.id}
//                           onChange={handleAddressSelect}
//                           style={{ width: '100%' }}
//                           dropdownRender={(menu) => (
//                             <>
//                               {menu}
//                               <Divider style={{ margin: '8px 0' }} />
//                               <Button
//                                 type="link"
//                                 icon={<PlusOutlined />}
//                                 onMouseDown={(e) => {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                 }}
//                                 onClick={() => setAddAddressModalVisible(true)}
//                                 style={{ width: '100%', justifyContent: 'flex-start' }}
//                                 size="small"
//                               >
//                                 Add New Address
//                               </Button>
//                             </>
//                           )}
//                         >
//                           {selectedCustomer.addresses.map((addr) => (
//                             <Option key={addr.id} value={addr.id}>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                                 <HomeOutlined />
//                                 <span>{addr.city}, {addr.state} - {addr.pincode}</span>
//                                 {addr.isDefault && <span style={{ color: '#52c41a', fontSize: 12 }}>(Default)</span>}
//                               </div>
//                             </Option>
//                           ))}
//                         </Select>
//                         {selectedAddress && (
//                           <div style={{
//                             marginTop: 8,
//                             padding: '10px 12px',
//                             borderRadius: '6px',
//                             backgroundColor: '#ffffff',
//                             border: '1px dashed #d9d9d9',
//                             fontSize: '13px',
//                             color: '#595959',
//                             lineHeight: '1.5'
//                           }}>
//                             {formatAddress(selectedAddress)}
//                           </div>
//                         )}
//                       </Space>
//                     ) : (
//                       <div style={{ textAlign: 'center', padding: '16px 0' }}>
//                         <p style={{ color: '#8c8c8c', marginBottom: 8, fontSize: '13px' }}>No address found for this customer.</p>
//                         <Button
//                           type="dashed"
//                           icon={<PlusOutlined />}
//                           onClick={() => setAddAddressModalVisible(true)}
//                           size="small"
//                         >
//                           Add Address
//                         </Button>
//                       </div>
//                     )}
//                   </Col>
//                 </Row>
//               </div>
//             ) : (
//               <div style={{
//                 marginTop: 16,
//                 padding: '24px',
//                 textAlign: 'center',
//                 color: '#bfbfbf',
//                 borderRadius: '8px',
//                 backgroundColor: '#fafafa',
//                 border: '1px dashed #d9d9d9',
//                 fontSize: '13px'
//               }}>
//                 Please select or add a customer to see profile and shipping details.
//               </div>
//             )}

//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col xs={24} md={12}>
//                 <Form.Item label="Advance Booking">
//                   <Switch
//                     checked={advanceBooking}
//                     onChange={(checked) => {
//                       setAdvanceBooking(checked);
//                       if (!checked) {
//                         setDeliveryDate(null);
//                         form.setFieldsValue({ deliveryDate: null });
//                       }
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               {advanceBooking && (
//                 <Col xs={24} md={12}>
//                   <Form.Item
//                     name="deliveryDate"
//                     label="Delivery Date"
//                     rules={[{ required: true, message: 'Please select delivery date' }]}
//                   >
//                     <Input
//                       type="date"
//                       value={deliveryDate ? deliveryDate.format('YYYY-MM-DD') : undefined}
//                       onChange={(event) => setDeliveryDate(event.target.value ? dayjs(event.target.value) : null)}
//                     />
//                   </Form.Item>
//                 </Col>
//               )}
//             </Row>
//           </Card>

//           <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
//             <Col xs={24} sm={12}>
//               <Form.Item label="Payment Method">
//                 <Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: 200 }} size="small">
//                   <Option value="cod">Cash on Delivery</Option>
//                   <Option value="upi">UPI</Option>
//                   <Option value="online">Online</Option>
//                   <Option value="bank_transfer">Bank Transfer</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Card title="Order Items" size="small" style={{ marginTop: 16 }}>
//             <Row gutter={[16, 16]} style={{ marginBottom: 16, alignItems: 'center' }}>
//               <Col xs={24} sm={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
//                   Add Item
//                 </Button>
//               </Col>
//             </Row>

//             <Table
//               columns={columns}
//               dataSource={orderItems}
//               pagination={false}
//               size="small"
//               rowKey="id"
//             />

//             <Divider />

//             <Row justify="end">
//               <Col>
//                 <div style={{ textAlign: 'right' }}>
//                   <div style={{ fontSize: 16, marginBottom: 8 }}>
//                     Total Amount: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{formatCurrency(calculateTotal)}</span>
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>

//           <div style={{ marginTop: 24, textAlign: 'center' }}>
//             <Space>
//               <Button type="primary" htmlType="submit" loading={loading} size="small" icon={<ShoppingCartOutlined />}>
//                 Create Order
//               </Button>
//               <Button onClick={onClose} size="small">Cancel</Button>
//             </Space>
//           </div>
//         </Form>
//       </Modal>

//       <ShippingAddressModal
//         open={addAddressModalVisible}
//         onCancel={() => {
//           setAddAddressModalVisible(false);
//           addressForm.resetFields();
//         }}
//         onSubmit={handleAddNewAddress}
//         form={addressForm}
//         loading={addAddressLoading}
//       />

//       <AddCustomerModal
//         open={addCustomerModalVisible}
//         onCancel={() => setAddCustomerModalVisible(false)}
//         onSuccess={(customer) => {
//           setAddCustomerModalVisible(false);
//           fetchCustomers('');
//           if (customer?.id) handleCustomerSelect(customer.id);
//         }}
//       />
//     </>
//   );
// };

// export default ManualOrderModal;



import { ShoppingCartOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { addShippingAddress } from '../../../api/orders';
import AddCustomerModal from '../../../components/modals/AddCustomerModal';
import ShippingAddressModal from '../../../components/modals/ShippingAddressModal';
import useOrders from '../../../hooks/useOrders';
import CustomerSection, { formatAddress } from './manualordermodal/CustomerSection';
import OrderItemsTable from './manualordermodal/OrderItemsTable';
import useManualOrder from './manualordermodal/useManualOrder';
import useProductSearch from './manualordermodal/useProductSearch';

const { Option } = Select;

const formatCurrency = (amount) => `₹${(amount || 0).toFixed(2)}`;

const ManualOrderModal = ({
  visible,
  onClose,
  onOrderCreated,
  defaultOrderType = 'normal',
}) => {
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  // ── Customer state ─────────────────────────────────────────────────────────
  const {
    customers,
    customersLoading,
    customersHasMore,
    fetchCustomers,
    upsertCustomer,
  } = useOrders();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [advanceBooking, setAdvanceBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // ── Modal visibility ───────────────────────────────────────────────────────
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

  // ── Order items hook ───────────────────────────────────────────────────────
  const {
    orderItems,
    orderType,
    orderTotal,
    loading,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleOrderTypeChange,
    handleSubmit: submitOrder,
    reset: resetOrder,
  } = useManualOrder({ onOrderCreated, onClose, defaultOrderType, });

  // ── Product search hook ────────────────────────────────────────────────────
  const {
    productOptions,
    productListLoading,
    handleProductSearch,
    handleProductPopupScroll,
    cacheProduct,
    reset: resetProducts,
  } = useProductSearch(visible);

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    setCustomerSearchText('');
    fetchCustomers('', false);
    setSelectedCustomer(null);
    setSelectedAddress(null);
    setAdvanceBooking(false);
    setPaymentMethod('cod');
    resetOrder();
    resetProducts();
    form.resetFields();
  }, [visible]);

  // ── Customer handlers ──────────────────────────────────────────────────────
  const handleCustomerSelect = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    setSelectedCustomer(customer);
    const defaultAddr = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
    setSelectedAddress(defaultAddr || null);
    form.setFieldsValue({ deliveryAddress: formatAddress(defaultAddr) });
  };

  const handleCustomerClear = () => {
    setSelectedCustomer(null);
    setSelectedAddress(null);
    setCustomerSearchText('');
    fetchCustomers('', false);
    form.resetFields(['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress']);
  };

  const handleCustomerSearch = (value) => {
    setCustomerSearchText(value || '');
    fetchCustomers(value || '', false);
  };

  const handleCustomerPopupScroll = (event) => {
    const { scrollTop, offsetHeight, scrollHeight } = event.target;
    if (scrollTop + offsetHeight >= scrollHeight - 16 && customersHasMore && !customersLoading) {
      fetchCustomers(customerSearchText, true);
    }
  };

  const handleAddressSelect = (addressId) => {
    const address = selectedCustomer?.addresses?.find((a) => a.id === addressId);
    if (!address) return;
    setSelectedAddress(address);
    form.setFieldsValue({ deliveryAddress: formatAddress(address) });
  };

  // ── Address handlers ───────────────────────────────────────────────────────
  const handleAddNewAddress = async (values) => {
    if (!selectedCustomer?.id) {
      message.error('Please select customer first');
      return;
    }
    setAddAddressLoading(true);
    try {
      const res = await addShippingAddress(selectedCustomer.id, values);
      if (res.success) {
        const newAddress = { id: res.addressId, ...values };
        const updatedCustomer = {
          ...selectedCustomer,
          addresses: [...(selectedCustomer.addresses || []), newAddress],
        };
        setSelectedCustomer(updatedCustomer);
        setSelectedAddress(newAddress);
        form.setFieldsValue({ deliveryAddress: formatAddress(newAddress) });
        message.success('Address added successfully');
        setAddAddressModalVisible(false);
        addressForm.resetFields();
        try { upsertCustomer(updatedCustomer); } catch { /* non-critical */ }
      } else {
        message.error(res.message || 'Failed to add address');
      }
    } catch (error) {
      message.error('Failed to add address: ' + error.message);
    } finally {
      setAddAddressLoading(false);
    }
  };

  // ── Item change (needs cacheProduct side-effect) ───────────────────────────
  const handleItemChangeWithCache = (itemId, field, value) => {
    if (field === 'productId') {
      const product = productOptions.find((p) => p.id?.toString() === value?.toString());
      if (product) cacheProduct(product);
    }
    handleItemChange(itemId, field, value, productOptions);
  };

  // ── Form submission ────────────────────────────────────────────────────────
  const handleFormFinish = async () => {

    const values = await form.validateFields();

    const payload = {
      selectedCustomer,
      selectedAddress,
      paymentMethod,
      formatAddress,

      isAdvanceBooking: advanceBooking,

      advanceDeliveryDatetime:
        advanceBooking && values.deliveryDate
          ? dayjs(values.deliveryDate)
            .hour(18)
            .minute(30)
            .second(0)
            .format()
          : null,
    };

    submitOrder(payload);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Modal title="Take Manual Order" open={visible} onCancel={onClose} footer={null} width={900}>
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>

          {/* ── Customer + address ─────────────────────── */}
          <Card title="Customer Information" size="small">
            <CustomerSection
              customers={customers}
              customersLoading={customersLoading}
              selectedCustomer={selectedCustomer}
              selectedAddress={selectedAddress}
              advanceBooking={advanceBooking}
              onCustomerSearch={handleCustomerSearch}
              onCustomerPopupScroll={handleCustomerPopupScroll}
              onCustomerSelect={handleCustomerSelect}
              onCustomerClear={handleCustomerClear}
              onAddressSelect={handleAddressSelect}
              onAddAddress={() => setAddAddressModalVisible(true)}
              onAddNewCustomer={() => setAddCustomerModalVisible(true)}
              onAdvanceBookingChange={(checked) => {
                setAdvanceBooking(checked);
                if (!checked) form.setFieldsValue({ deliveryDate: null });
              }}
              form={form}
            />
          </Card>

          {/* ── Payment method ─────────────────────────── */}
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            <Col xs={24} sm={12}>
              <Form.Item label="Payment Method">
                <Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: 200 }} size="small">
                  <Option value="cod">Cash on Delivery</Option>
                  <Option value="upi">UPI</Option>
                  <Option value="online">Online</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ── Order items ────────────────────────────── */}
          <Card title="Order Items" size="small" style={{ marginTop: 16 }}>
            <OrderItemsTable
              orderItems={orderItems}
              orderType={orderType}
              productOptions={productOptions}
              productListLoading={productListLoading}
              onItemChange={handleItemChangeWithCache}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onProductSearch={handleProductSearch}
              onProductPopupScroll={handleProductPopupScroll}
            />

            <Divider />

            <Row justify="end">
              <Col>
                <div style={{ fontSize: 16, textAlign: 'right' }}>
                  Total Amount:{' '}
                  <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {formatCurrency(orderTotal)}
                  </span>
                </div>
              </Col>
            </Row>
          </Card>

          {/* ── Submit ─────────────────────────────────── */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="small"
                icon={<ShoppingCartOutlined />}
              >
                Create Order
              </Button>
              <Button onClick={onClose} size="small">Cancel</Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <ShippingAddressModal
        open={addAddressModalVisible}
        onCancel={() => { setAddAddressModalVisible(false); addressForm.resetFields(); }}
        onSubmit={handleAddNewAddress}
        form={addressForm}
        loading={addAddressLoading}
      />

      <AddCustomerModal
        open={addCustomerModalVisible}
        onCancel={() => setAddCustomerModalVisible(false)}
        onSuccess={(customer) => {
          setAddCustomerModalVisible(false);
          fetchCustomers('');
          if (customer?.id) handleCustomerSelect(customer.id);
        }}
      />
    </>
  );
};

export default ManualOrderModal;