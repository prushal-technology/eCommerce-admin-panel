import { getAllOrders, updateOrderStatus } from './orders';

export const getCustomOrders = async (query = null) => {
  return await getAllOrders(null, query, 'custom');
};

export const updateCustomOrderStatus = async (orderId, status, note = '') => {
  return await updateOrderStatus(orderId, status, note);
};
