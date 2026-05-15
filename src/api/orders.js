// Orders API Functions
import { GRAPHQL_QUERIES, graphqlRequest } from './graphql';

// Get all customers for manual order
export const getCustomers = async (search = null) => {
  try {
    const variables = search ? { search } : {};
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_CUSTOMERS, variables);
    return {
      success: true,
      customers: data.customers?.customers || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch customers'
    };
  }
};

// Get all products for manual order
export const getProductsForOrder = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_PRODUCTS_SIMPLE);
    return {
      success: true,
      products: data.products || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch products'
    };
  }
};

// Create admin order
export const createAdminOrder = async (userId, shippingAddress, items) => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.CREATE_ADMIN_ORDER, {
      userId: parseInt(userId, 10),
      shippingAddress,
      items
    });
    
    if (data && data.createAdminOrder) {
      return {
        success: true,
        order: data.createAdminOrder.order
      };
    }
    
    return {
      success: false,
      message: 'Failed to create order'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create order'
    };
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_ALL_ORDERS);
    return {
      success: true,
      orders: data.allOrders || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch orders'
    };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status, note = "") => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.UPDATE_ORDER_STATUS, {
      orderId: parseInt(orderId, 10),
      status,
      note
    });
    
    if (data && data.updateOrderStatus) {
      if (data.updateOrderStatus.success === false) {
        return {
          success: false,
          message: 'Failed to update order status'
        };
      }
      return {
        success: true,
        order: data.updateOrderStatus.order
      };
    }
    
    return {
      success: false,
      message: 'Failed to update order status'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update order status'
    };
  }
};
