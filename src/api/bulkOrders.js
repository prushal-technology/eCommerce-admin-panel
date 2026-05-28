import { getAllOrders, updateOrderStatus } from './orders';

export const getBulkOrders = async (query = null) => {
  return await getAllOrders(null, query, 'bulk');
};

export const updateBulkOrderStatus = async (orderId, status, note = '') => {
  return await updateOrderStatus(orderId, status, note);
};
