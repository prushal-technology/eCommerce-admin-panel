import { GRAPHQL_QUERIES, graphqlRequest } from './graphql';

export const getBulkOrders = async (query = null) => {
  try {
    const variables = query ? { query } : {};
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_BULK_ORDERS, variables);
    return {
      success: true,
      bulkOrders: data.allBulkOrderEnquiries || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch bulk orders'
    };
  }
};

export const createBulkOrder = async (bulkOrderDetails, items) => {
  try {
    const variables = {
      bulkOrderDetails,
      items: items.map((item) => ({
        productId: parseInt(item.productId, 10),
        quantity: parseInt(item.quantity, 10)
      }))
    };
    const data = await graphqlRequest(GRAPHQL_QUERIES.CREATE_BULK_ORDER_ENQUIRY, variables);
    return {
      success: true,
      bulkOrder: data.createBulkOrderEnquiry?.bulkOrder || null
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create bulk order enquiry'
    };
  }
};

export const updateBulkOrder = async (bulkOrderId, status, bulkOrderDetails) => {
  try {
    const variables = {
      bulkOrderId: parseInt(bulkOrderId, 10),
      status,
      bulkOrderDetails
    };
    const data = await graphqlRequest(GRAPHQL_QUERIES.UPDATE_BULK_ORDER_ENQUIRY, variables);
    return {
      success: true,
      bulkOrder: data.updateBulkOrderEnquiry?.bulkOrder || null
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update bulk order enquiry'
    };
  }
};

export const deleteBulkOrder = async (bulkOrderId) => {
  try {
    const variables = { bulkOrderId: parseInt(bulkOrderId, 10) };
    const data = await graphqlRequest(GRAPHQL_QUERIES.DELETE_BULK_ORDER_ENQUIRY, variables);
    return {
      success: data.deleteBulkOrderEnquiry?.success === true
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete bulk order enquiry'
    };
  }
};

export const getProductsForBulkOrder = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_PRODUCTS_SIMPLE, { first: 100 });
    return {
      success: true,
      products: data.products?.products || []
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch products for bulk order'
    };
  }
};
