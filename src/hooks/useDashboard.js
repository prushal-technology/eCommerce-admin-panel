import { message } from 'antd';
import { useCallback, useState } from 'react';
import { getDashboard as getDashboardApi } from '../api/products';

export default function useDashboard() {
  const [dashboard, setDashboard] = useState({
    stats: null,
    salesTrend: [],
    topProducts: [],
    recentProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDashboardApi();
      if (response.success) {
        setDashboard({
          stats: response.dashboardStats,
          salesTrend: response.salesTrend,
          topProducts: response.topProducts,
          recentProducts: response.recentProducts,
          recentOrders: response.recentOrders,
        });
        return response;
      }

      message.error(response.message || 'Failed to load dashboard data');
      return null;
    } catch (error) {
      message.error(error.message || 'Failed to load dashboard data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...dashboard,
    loading,
    fetchDashboard,
  };
}
