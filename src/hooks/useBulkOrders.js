import { message } from 'antd';
import { useCallback, useState } from 'react';
import { getBulkOrders, updateBulkOrderStatus } from '../api/bulkOrders';

export default function useBulkOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async (query = null) => {
    setLoading(true);
    try {
      const res = await getBulkOrders(query);
      if (res.success) {
        setOrders(res.orders || []);
      } else {
        throw new Error(res.message || 'Failed to load bulk orders');
      }
    } catch (err) {
      message.error(err.message || 'Failed to load bulk orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId, status, note = '') => {
    setLoading(true);
    try {
      const res = await updateBulkOrderStatus(orderId, status, note);
      if (!res.success) throw new Error(res.message || 'Failed to update bulk order');
      return res;
    } catch (err) {
      message.error(err.message || 'Failed to update bulk order');
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
