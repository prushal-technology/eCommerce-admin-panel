// import { message } from 'antd';
// import { useMemo, useState } from 'react';
// import useOrders from '../../../../hooks/useOrders';

// const buildEmptyItem = () => ({
//     id: Date.now().toString(),
//     productId: null,
//     price: 0,
//     discountPrice: 0,
//     bulkOrderPrice: 0,
//     quantity: 1,
//     total: 0,
// });

// /**
//  * Manages order-items state, pricing calculations, and order submission
//  * for ManualOrderModal.
//  */
// const useManualOrder = ({ onOrderCreated, onClose, defaultOrderType = 'normal' }) => {
//     const { createOrder } = useOrders();

//     const [orderItems, setOrderItems] = useState([buildEmptyItem()]);
//     const [orderType, setOrderType] = useState(defaultOrderType);
//     const [loading, setLoading] = useState(false);

//     // ── Pricing helpers ──────────────────────────────────────────────────────
//     const getItemUnitPrice = (item, type = orderType) => {
//         if (type === 'bulk') return parseFloat(item.bulkOrderPrice || 0);
//         if (type === 'custom' && item.customPrice != null) return parseFloat(item.customPrice || 0);
//         const actual = parseFloat(item.price || 0);
//         const discount = parseFloat(item.discountPrice || 0);
//         return discount > 0 && discount < actual ? discount : actual;
//     };

//     const calculateItemTotal = (item, type = orderType) =>
//         (getItemUnitPrice(item, type) || 0) * (item.quantity || 1);

//     // ── Item mutations ───────────────────────────────────────────────────────
//     const handleAddItem = () =>
//         setOrderItems((prev) => [...prev, buildEmptyItem()]);

//     const handleRemoveItem = (itemId) => {
//         if (orderItems.length === 1) {
//             message.warning('At least one item is required');
//             return;
//         }
//         setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
//     };

//     const handleItemChange = (itemId, field, value, productOptions) => {
//         setOrderItems((prev) =>
//             prev.map((item) => {
//                 if (item.id !== itemId) return item;
//                 const updated = { ...item, [field]: value };

//                 if (field === 'productId') {
//                     const product = productOptions.find(
//                         (p) => p.id?.toString() === value?.toString()
//                     );
//                     if (product) {
//                         updated.price = parseFloat(product.price || 0);
//                         updated.discountPrice = parseFloat(product.discountPrice || 0);
//                         updated.bulkOrderPrice = parseFloat(product.bulkOrderPrice || 0);
//                     } else {
//                         updated.price = updated.discountPrice = updated.bulkOrderPrice = 0;
//                     }
//                 }

//                 updated.total = calculateItemTotal(updated);
//                 return updated;
//             })
//         );
//     };

//     const handleOrderTypeChange = (value) => {
//         setOrderType(value);
//         setOrderItems((prev) =>
//             prev.map((item) => ({ ...item, total: calculateItemTotal(item, value) }))
//         );
//     };

//     const orderTotal = useMemo(
//         () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
//         [orderItems]
//     );

//     // ── Submission ───────────────────────────────────────────────────────────

//     const handleSubmit = async ({
//         selectedCustomer,
//         selectedAddress,
//         paymentMethod,
//         formatAddress,
//         isAdvanceBooking,
//         advanceDeliveryDatetime
//     }) => {

//         if (purchaseType === 'home_delivery' && !selectedCustomer) {
//             message.error('Please select a customer');
//             return;
//         }

//         if (!selectedAddress) {
//             message.error('Please select or add a delivery address');
//             return;
//         }

//         const validItems = orderItems.filter(
//             (item) => item.productId && item.quantity > 0
//         );

//         if (!validItems.length) {
//             message.error('Please add at least one valid item');
//             return;
//         }

//         setLoading(true);

//         try {

//             const items = validItems.map((item) => ({
//                 productId: parseInt(item.productId, 10),
//                 quantity: item.quantity,

//                 ...(
//                     (orderType === 'custom' || orderType === 'bulk') &&
//                         item.customPrice
//                         ? {
//                             customPrice: parseFloat(item.customPrice)
//                         }
//                         : {}
//                 ),
//             }));

//             const result = await createOrder(
//                 selectedCustomer.id,
//                 formatAddress(selectedAddress),
//                 items,
//                 orderType,
//                 paymentMethod,
//                 isAdvanceBooking,
//                 advanceDeliveryDatetime
//             );

//             if (result.success) {

//                 message.success('Order created successfully');

//                 onOrderCreated?.();

//                 onClose();
//             }

//         } catch (error) {

//             message.error(
//                 'Failed to create order: ' + error.message
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     const reset = () => {
//         setOrderItems([buildEmptyItem()]);
//         setOrderType(defaultOrderType || 'normal');
//     };

//     return {
//         orderItems,
//         orderType,
//         orderTotal,
//         loading,
//         handleAddItem,
//         handleRemoveItem,
//         handleItemChange,
//         handleOrderTypeChange,
//         handleSubmit,
//         reset,
//     };
// };

// export default useManualOrder;


// import { message } from 'antd';
// import { useMemo, useState } from 'react';
// import useOrders from '../../../../hooks/useOrders';

// const buildEmptyItem = () => ({
//     id: Date.now().toString(),
//     productId: null,
//     price: 0,
//     discountPrice: 0,
//     bulkOrderPrice: 0,
//     quantity: 1,
//     total: 0,
// });

// /**
//  * Manages order-items state, pricing calculations, and order submission
//  * for ManualOrderModal.
//  */
// const useManualOrder = ({ onOrderCreated, onClose, defaultOrderType = 'normal' }) => {
//     const { createOrder } = useOrders();

//     const [orderItems, setOrderItems] = useState([buildEmptyItem()]);
//     const [orderType, setOrderType] = useState(defaultOrderType);
//     const [loading, setLoading] = useState(false);

//     // ── Pricing helpers ──────────────────────────────────────────────────────
//     const getItemUnitPrice = (item, type = orderType) => {
//         if (type === 'bulk') return parseFloat(item.bulkOrderPrice || 0);
//         if (type === 'custom' && item.customPrice != null) return parseFloat(item.customPrice || 0);
//         const actual = parseFloat(item.price || 0);
//         const discount = parseFloat(item.discountPrice || 0);
//         return discount > 0 && discount < actual ? discount : actual;
//     };

//     const calculateItemTotal = (item, type = orderType) =>
//         (getItemUnitPrice(item, type) || 0) * (item.quantity || 1);

//     // ── Item mutations ───────────────────────────────────────────────────────
//     const handleAddItem = () =>
//         setOrderItems((prev) => [...prev, buildEmptyItem()]);

//     const handleRemoveItem = (itemId) => {
//         if (orderItems.length === 1) {
//             message.warning('At least one item is required');
//             return;
//         }
//         setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
//     };

//     const handleItemChange = (itemId, field, value, productOptions) => {
//         setOrderItems((prev) =>
//             prev.map((item) => {
//                 if (item.id !== itemId) return item;
//                 const updated = { ...item, [field]: value };

//                 if (field === 'productId') {
//                     const product = productOptions.find(
//                         (p) => p.id?.toString() === value?.toString()
//                     );
//                     if (product) {
//                         updated.price = parseFloat(product.price || 0);
//                         updated.discountPrice = parseFloat(product.discountPrice || 0);
//                         updated.bulkOrderPrice = parseFloat(product.bulkOrderPrice || 0);
//                     } else {
//                         updated.price = updated.discountPrice = updated.bulkOrderPrice = 0;
//                     }
//                 }

//                 updated.total = calculateItemTotal(updated);
//                 return updated;
//             })
//         );
//     };

//     const handleOrderTypeChange = (value) => {
//         setOrderType(value);
//         setOrderItems((prev) =>
//             prev.map((item) => ({ ...item, total: calculateItemTotal(item, value) }))
//         );
//     };

//     const orderTotal = useMemo(
//         () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
//         [orderItems]
//     );

//     // ── Submission ───────────────────────────────────────────────────────────
//     const handleSubmit = async ({
//         selectedCustomer,
//         selectedAddress,
//         paymentMethod,
//         formatAddress,
//         purchaseType,           // ← received from ManualOrderModal payload
//         isAdvanceBooking,
//         advanceDeliveryDatetime,
//     }) => {
//         const isHomeDelivery = purchaseType === 'home_delivery';

//         // Customer & address are only required for Home Delivery
//         if (isHomeDelivery && !selectedCustomer) {
//             message.error('Please select a customer');
//             return;
//         }

//         if (isHomeDelivery && !selectedAddress) {
//             message.error('Please select or add a delivery address');
//             return;
//         }

//         const validItems = orderItems.filter(
//             (item) => item.productId && item.quantity > 0
//         );

//         if (!validItems.length) {
//             message.error('Please add at least one valid item');
//             return;
//         }

//         setLoading(true);

//         try {
//             const items = validItems.map((item) => ({
//                 productId: parseInt(item.productId, 10),
//                 quantity: item.quantity,
//                 ...(
//                     (orderType === 'custom' || orderType === 'bulk') && item.customPrice
//                         ? { customPrice: parseFloat(item.customPrice) }
//                         : {}
//                 ),
//             }));

//             // For Walk-in, customerId and address may be null — pass accordingly
//             const result = await createOrder(
//                 selectedCustomer?.id ?? null,
//                 selectedAddress ? formatAddress(selectedAddress) : null,
//                 items,
//                 orderType,
//                 paymentMethod,
//                 isAdvanceBooking,
//                 advanceDeliveryDatetime
//             );

//             if (result.success) {
//                 message.success('Order created successfully');
//                 onOrderCreated?.();
//                 onClose();
//             }
//         } catch (error) {
//             message.error('Failed to create order: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const reset = () => {
//         setOrderItems([buildEmptyItem()]);
//         setOrderType(defaultOrderType || 'normal');
//     };

//     return {
//         orderItems,
//         orderType,
//         orderTotal,
//         loading,
//         handleAddItem,
//         handleRemoveItem,
//         handleItemChange,
//         handleOrderTypeChange,
//         handleSubmit,
//         reset,
//     };
// };

// export default useManualOrder;






import { message } from 'antd';
import { useMemo, useState } from 'react';
import useOrders from '../../../../hooks/useOrders';

const buildEmptyItem = () => ({
    id: Date.now().toString(),
    productId: null,
    price: 0,
    discountPrice: 0,
    bulkOrderPrice: 0,
    quantity: 1,
    total: 0,
});

/**
 * Manages order-items state, pricing calculations, and order submission
 * for ManualOrderModal.
 */
const useManualOrder = ({ onOrderCreated, onClose, defaultOrderType = 'normal' }) => {
    const { createOrder } = useOrders();

    const [orderItems, setOrderItems] = useState([buildEmptyItem()]);
    const [orderType, setOrderType] = useState(defaultOrderType);
    const [loading, setLoading] = useState(false);

    const getItemUnitPrice = (item, type = orderType) => {
        if (type === 'bulk') return parseFloat(item.bulkOrderPrice || 0);
        if (type === 'custom' && item.customPrice != null) return parseFloat(item.customPrice || 0);
        const actual = parseFloat(item.price || 0);
        const discount = parseFloat(item.discountPrice || 0);
        return discount > 0 && discount < actual ? discount : actual;
    };

    const calculateItemTotal = (item, type = orderType) =>
        (getItemUnitPrice(item, type) || 0) * (item.quantity || 1);

    const handleAddItem = () =>
        setOrderItems((prev) => [...prev, buildEmptyItem()]);

    const handleRemoveItem = (itemId) => {
        if (orderItems.length === 1) {
            message.warning('At least one item is required');
            return;
        }
        setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleItemChange = (itemId, field, value, productOptions) => {
        setOrderItems((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;
                const updated = { ...item, [field]: value };
                if (field === 'productId') {
                    const product = productOptions.find(
                        (p) => p.id?.toString() === value?.toString()
                    );
                    if (product) {
                        updated.price = parseFloat(product.price || 0);
                        updated.discountPrice = parseFloat(product.discountPrice || 0);
                        updated.bulkOrderPrice = parseFloat(product.bulkOrderPrice || 0);
                    } else {
                        updated.price = updated.discountPrice = updated.bulkOrderPrice = 0;
                    }
                }
                updated.total = calculateItemTotal(updated);
                return updated;
            })
        );
    };

    const handleOrderTypeChange = (value) => {
        setOrderType(value);
        setOrderItems((prev) =>
            prev.map((item) => ({ ...item, total: calculateItemTotal(item, value) }))
        );
    };

    const orderTotal = useMemo(
        () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
        [orderItems]
    );

    const handleSubmit = async ({
        selectedCustomer,
        selectedAddress,
        paymentMethod,
        formatAddress,
        purchaseType,
        isAdvanceBooking,
        advanceDeliveryDatetime,
    }) => {
        const isHomeDelivery = purchaseType === 'home_delivery';

        if (isHomeDelivery && !selectedCustomer) {
            message.error('Please select a customer');
            return;
        }
        if (isHomeDelivery && !selectedAddress) {
            message.error('Please select or add a delivery address');
            return;
        }

        const validItems = orderItems.filter(
            (item) => item.productId && item.quantity > 0
        );
        if (!validItems.length) {
            message.error('Please add at least one valid item');
            return;
        }

        setLoading(true);
        try {
            const items = validItems.map((item) => ({
                productId: parseInt(item.productId, 10),
                quantity: item.quantity,
                ...(
                    (orderType === 'custom' || orderType === 'bulk') && item.customPrice
                        ? { customPrice: parseFloat(item.customPrice) }
                        : {}
                ),
            }));

            // Single payload object — matches createOrder's new signature
            // and maps directly to createAdminOrder mutation variables.
            const orderPayload = {
                purchaseType: isHomeDelivery ? 'home_delivery' : 'walk_in_purchase',
                orderType,
                paymentMethod,
                isAdvanceBooking: !!isAdvanceBooking,
                advanceDeliveryDatetime: isAdvanceBooking ? advanceDeliveryDatetime : null,
                items,
                // Only include userId + shippingAddress for Home Delivery
                ...(isHomeDelivery && {
                    userId: parseInt(selectedCustomer.id, 10),
                    shippingAddress: formatAddress(selectedAddress),
                }),
            };

            const result = await createOrder(orderPayload);

            if (result?.success) {
                message.success('Order created successfully');
                onOrderCreated?.();
                onClose();
            }
        } catch (error) {
            message.error('Failed to create order: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setOrderItems([buildEmptyItem()]);
        setOrderType(defaultOrderType || 'normal');
    };

    return {
        orderItems,
        orderType,
        orderTotal,
        loading,
        handleAddItem,
        handleRemoveItem,
        handleItemChange,
        handleOrderTypeChange,
        handleSubmit,
        reset,
    };
};

export default useManualOrder;