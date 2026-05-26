import { message } from 'antd';
import { useCallback, useState } from 'react';
import { getCustomOrders, updateCustomOrderStatus } from '../api/customOrders';

export default function useCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async (query = null) => {
    setLoading(true);
    try {
      const res = await getCustomOrders(query);
      if (res.success) {
        setOrders(res.orders || []);
      } else {
        throw new Error(res.message || 'Failed to load custom orders');
      }
    } catch (err) {
      message.error(err.message || 'Failed to load custom orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId, status, note = '') => {
    setLoading(true);
    try {
      const res = await updateCustomOrderStatus(orderId, status, note);
      if (!res.success) throw new Error(res.message || 'Failed to update custom order');
      return res;
    } catch (err) {
      message.error(err.message || 'Failed to update custom order');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    updateOrder,
  };
}
