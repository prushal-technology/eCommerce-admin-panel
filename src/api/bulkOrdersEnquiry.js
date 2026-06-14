import { graphqlRequest } from './graphql';

// ───────────────── BULK ORDER ENQUIRIES ─────────────────

export const getAllBulkOrderEnquiries = async (query = null,
  first = 10,
  after = null) => {
  try {
    const data = await graphqlRequest(
      `
      query AllBulkOrderEnquiries(
  $query: String
  $first: Int!
  $after: String
) {
  allBulkOrderEnquiries(
    query: $query
    first: $first
    after: $after
  ) {
    enquiries {
      id
      status
      bulkOrderDetails
      createdAt

      placedByUser {
        firstName
        lastName
      }

      items {
        id
        quantity
        product {
          id
          name
          unit
          measureValue
          images {
            id
            image
            sortOrder
          }
        }
      }
    }

    nextCursor
    hasMore
    total
  }
}
    `,
      { query, first, after }
    );

    return {
      success: true,
      enquiries: data?.allBulkOrderEnquiries?.enquiries || [],
      nextCursor: data?.allBulkOrderEnquiries?.nextCursor || null,
      hasMore: data?.allBulkOrderEnquiries?.hasMore || false,
      total: data?.allBulkOrderEnquiries?.total || 0,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateBulkOrderEnquiry = async (bulkOrderId, status, bulkOrderDetails = '') => {
  try {
    const data = await graphqlRequest(
      `
      mutation UpdateBulkOrderEnquiry(
        $bulkOrderId: Int!
        $status: String!
        $bulkOrderDetails: String
      ) {
        updateBulkOrderEnquiry(
          bulkOrderId: $bulkOrderId
          status: $status
          bulkOrderDetails: $bulkOrderDetails
        ) {
          bulkOrder {
            id
            status
            bulkOrderDetails
            items {
              id
              quantity
              product {
                id
                name
              }
            }
          }
        }
      }
    `,
      {
        bulkOrderId: parseInt(bulkOrderId, 10),
        status,
        bulkOrderDetails,
      }
    );

    return {
      success: true,
      bulkOrder: data?.updateBulkOrderEnquiry?.bulkOrder,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};