import { getAllOrders, updateOrderStatus } from './orders';

export const getCustomOrders = async (query = null, after = null, first = 10) => {
  return await getAllOrders(null, query, 'custom', after, first);
};

export const updateCustomOrderStatus = async (orderId, status, note = '') => {
  return await updateOrderStatus(orderId, status, note);
};
