import { message } from 'antd';
import { useCallback, useState } from 'react';
import {
    createBulkOrder,
    deleteBulkOrder,
    getBulkOrders,
    getProductsForBulkOrder,
    updateBulkOrder
} from '../api/bulkOrders';

export default function useBulkOrders() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchBulkOrders = useCallback(async (query = null) => {
    setLoading(true);
    try {
      const res = await getBulkOrders(query);
      if (res.success) {
        setBulkOrders(res.bulkOrders || []);
      } else {
        throw new Error(res.message || 'Failed to load bulk orders');
      }
    } catch (err) {
      message.error(err.message || 'Failed to load bulk orders');
      setBulkOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await getProductsForBulkOrder();
      if (res.success) {
        setProducts(res.products || []);
      } else {
        throw new Error(res.message || 'Failed to load products');
      }
    } catch (err) {
      message.error(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const createOrder = useCallback(async (details, items) => {
    setLoading(true);
    try {
      const res = await createBulkOrder(details, items);
      if (!res.success) throw new Error(res.message || 'Failed to create bulk order');
      return res;
    } catch (err) {
      message.error(err.message || 'Failed to create bulk order');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (bulkOrderId, status, bulkOrderDetails) => {
    setLoading(true);
    try {
      const res = await updateBulkOrder(bulkOrderId, status, bulkOrderDetails);
      if (!res.success) throw new Error(res.message || 'Failed to update bulk order');
      return res;
    } catch (err) {
      message.error(err.message || 'Failed to update bulk order');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (bulkOrderId) => {
    setLoading(true);
    try {
      const res = await deleteBulkOrder(bulkOrderId);
      if (!res.success) throw new Error(res.message || 'Failed to delete bulk order');
      return res;
    } catch (err) {
      message.error(err.message || 'Failed to delete bulk order');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bulkOrders,
    products,
    loading,
    loadingProducts,
    fetchBulkOrders,
    fetchProducts,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
