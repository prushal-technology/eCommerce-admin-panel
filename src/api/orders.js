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
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_PRODUCTS_SIMPLE, { first: 5 });
    return {
      success: true,
      products: data.products?.products || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch products'
    };
  }
};

// Create admin order
export const createAdminOrder = async (userId, shippingAddress, items, orderType = null, paymentMethod = null) => {
  try {
    const variables = {
      userId: parseInt(userId, 10),
      shippingAddress,
      items: items,
      ...(orderType ? { orderType } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
    };

    const data = await graphqlRequest(GRAPHQL_QUERIES.CREATE_ADMIN_ORDER, variables);

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
export const getAllOrders = async (orderFrom = null, query = null, orderType = null) => {
  try {
    const variables = {
      ...(orderFrom ? { orderFrom } : {}),
      ...(query ? { query } : {}),
      ...(orderType ? { orderType } : {})
    };
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_ALL_ORDERS, variables);
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

// Add shipping address (used by manual order workflows)
export const addShippingAddress = async (values) => {
  try {
    const mutation = `
      mutation AddShippingAddress($name: String!, $phone: String!, $city: String!, $state: String!, $pincode: String!, $landmark: String, $isDefault: Boolean) {
        addShippingAddress(name: $name, phone: $phone, city: $city, state: $state, pincode: $pincode, landmark: $landmark, isDefault: $isDefault) {
          addressId
        }
      }
    `;
    const data = await graphqlRequest(mutation, values);
    if (data?.addShippingAddress?.addressId) {
      return { success: true, addressId: data.addShippingAddress.addressId };
    }
    return { success: false, message: 'Failed to add address' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to add address' };
  }
};

// Fetch order tracking data
export const getOrderTracking = async (orderId) => {
  try {
    const query = `
      query GetOrderTracking($orderId: Int!) {
        orderTracking(orderId: $orderId) {
          status
          notes
          updatedAt
          date
          time
        }
      }
    `;
    const data = await graphqlRequest(query, { orderId: Number(orderId) });
    return { success: true, tracking: data.orderTracking || [] };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch tracking' };
  }
};
