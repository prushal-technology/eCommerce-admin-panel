import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { createAdminOrder, getAllOrders, getCustomers, updateOrderStatus } from '../api/orders';
import { getAllProducts } from '../api/products';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchOrders = useCallback(async (orderFrom = null, query = null) => {
    setLoading(true);
    try {
      const res = await getAllOrders(orderFrom, query);
      if (res.success) setOrders(res.orders || []);
      else throw new Error(res.message || 'Failed to fetch orders');
    } catch (err) {
      message.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(async (search = '') => {
    setCustomersLoading(true);
    try {
      const res = await getCustomers(search || null);
      if (!res.success) throw new Error(res.message || 'Failed to fetch customers');
      const transformed = (res.customers || []).map(c => ({
        id: c.id,
        name: `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || `Customer ${c.id}`,
        email: c.user?.email || 'N/A',
        phone: c.user?.phone || 'N/A',
        addresses: c.addresses || []
      }));
      setCustomers(transformed);
      return transformed;
    } catch (err) {
      message.error('Failed to fetch customers: ' + err.message);
      setCustomers([]);
      return [];
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      // reuse existing products API - keep consistent with current behavior
      const res = await getAllProducts(50, null);
      if (!res.success) throw new Error(res.message || 'Failed to fetch products');
      const transformed = (res.products || []).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price || 0,
        stock: p.stock?.quantity || 0,
        status: p.isActive ? 'active' : 'inactive',
        category: p.category?.name || 'N/A',
        sku: p.sku || `PRD-${p.id}`
      }));
      setProducts(transformed);
      return transformed;
    } catch (err) {
      message.error('Failed to fetch products: ' + err.message);
      setProducts([]);
      return [];
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (userId, shippingAddress, items) => {
    try {
      const res = await createAdminOrder(userId, shippingAddress, items);
      if (res.success) {
        message.success(`Order ${res.order?.orderNumber || ''} created`);
        fetchOrders();
      } else {
        message.error(res.message || 'Failed to create order');
      }
      return res;
    } catch (err) {
      message.error('Failed to create order: ' + err.message);
      return { success: false, message: err.message };
    }
  }, [fetchOrders]);

  const changeOrderStatus = useCallback(async (orderId, status, note = '') => {
    try {
      const res = await updateOrderStatus(orderId, status, note);
      if (res.success) {
        // update local cache
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        message.success('Order status updated');
      } else {
        message.error(res.message || 'Failed to update order status');
      }
      return res;
    } catch (err) {
      message.error('Failed to update order status: ' + err.message);
      return { success: false, message: err.message };
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    fetchOrders,
    customers,
    customersLoading,
    fetchCustomers,
    products,
    productsLoading,
    fetchProducts,
    createOrder,
    changeOrderStatus,
  };
}
