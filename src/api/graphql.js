// GraphQL Client Configuration

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URI;

// GraphQL request function
export const graphqlRequest = async (query, variables = {}) => {
  try {
    // Handle gql Document objects - extract the query string
    const queryString = typeof query === 'object' && query.kind === 'Document'
      ? query.loc?.source?.body || query.definitions?.[0]?.loc?.source?.body
      : query;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if available
        ...(localStorage.getItem('authToken') && {
          'Authorization': `JWT ${localStorage.getItem('authToken')}`
        })
      },
      body: JSON.stringify({
        query: queryString,
        variables
      })
    });

    const result = await response.json();

    // ✅ Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0].message;
      console.error("GraphQL Error:", errorMessage);
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    // Handle network errors
    // if (error.message === 'Failed to fetch') {
    //   notification.error({
    //     message: 'Network Error',
    //     description: 'Unable to connect to the server. Please check your internet connection.',
    //     placement: 'topRight',
    //   });
    //   throw new Error('Network connection failed');
    // }

    // Re-throw other errors
    console.error("GraphQL Error:", error);
    throw error;
  }
};

// Authentication helper functions
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// GraphQL query templates
export const GRAPHQL_QUERIES = {
  // Authentication
  LOGIN: `
    mutation Login($email: String!, $password: String!) {
      tokenAuth(email: $email, password: $password) {
        token
        role
        user {
          id
          email
          role
        }
      }
    }
  `,

  GET_CATEGORIES: `
    query GetAllCategories {
      allCategories {
        id
        name
        description
        isActive
        parent {
          id
          name
        }
      }
    }
  `,

  GET_ALL_PRODUCTS: `
    query GetAllProducts($first: Int!, $after: String, $search: String, $categoryId: Int) {
      products(first: $first, after: $after, search: $search, categoryId: $categoryId) {
        products {
          id
          name
          description
          price
          discountPrice
          unit
          sku
          measureValue
          isActive
          isFeatured
          isWishlisted
          isAddedcart
          stock {
            quantity
            reservedQuantity
            availableQuantity
            isOutOfStock
          }
          images {
            id
            image
            sortOrder
          }
            category{
        id
        name
      }
        }
        nextCursor
        hasMore
      }
    }
  `,

  CREATE_PRODUCT: `
    mutation CreateProduct($categoryId: Int!, $name: String!, $description: String, $sku: String!, $price: Float!, $discountPrice: Float, $isActive: Boolean, $unit: String!, $measureValue: Decimal!, $isFeatured: Boolean, $quantity: Int!, $reservedQuantity: Int) {
      createProduct(categoryId: $categoryId, name: $name, description: $description, sku: $sku, price: $price, discountPrice: $discountPrice, isActive: $isActive, unit: $unit, measureValue: $measureValue, isFeatured: $isFeatured, quantity: $quantity, reservedQuantity: $reservedQuantity) {
        product {
          id
          name
          unit
          measureValue
          isFeatured
          stock {
            quantity
            reservedQuantity
          }
        }
      }
    }
  `,

  UPDATE_PRODUCT: `
    mutation UpdateProduct($id: Int!, $name: String, $description: String, $sku: String, $price: Float, $discountPrice: Float, $isActive: Boolean, $isFeatured: Boolean, $unit: String, $measureValue: Decimal, $categoryId: Int, $quantity: Int!, $reservedQuantity: Int) {
      updateProduct(id: $id, name: $name, description: $description, sku: $sku, price: $price, discountPrice: $discountPrice, isActive: $isActive, isFeatured: $isFeatured, unit: $unit, measureValue: $measureValue, categoryId: $categoryId, quantity: $quantity, reservedQuantity: $reservedQuantity) {
        product {
          id
          name
          sku
          price
          discountPrice
          isActive
          isFeatured
          unit
          measureValue
          category {
            id
          }
        }
      }
    }
  `,

  DELETE_PRODUCT: `
    mutation DeleteProduct($id: Int!) {
      deleteProduct(id: $id) {
        success
      }
    }
 `,

  ADD_PRODUCT_IMAGE: `
    mutation AddProductImage($productId: Int!, $image: String!, $sortOrder: Int) {
      addProductImage(productId: $productId, image: $image, sortOrder: $sortOrder) {
        product {
          id
          name
          images {
            id
            image
            sortOrder
          }
        }
      }
    }
  `,

  DELETE_PRODUCT_IMAGE: `
    mutation DeleteProductImage($imageId: Int!) {
      deleteProductImage(imageId: $imageId) {
        success
      }
    }
  `,

  GET_STOCK: `
    query GetStock($productId: Int!) {
      stock(productId: $productId) {
        quantity
        reservedQuantity
        availableQuantity
      }
    }
  `,

  GET_PRODUCT_BY_ID: `
  query GetProductById($id: Int!) {
    product(id: $id) {
      id
      name
      description
      sku
      price
      discountPrice
      isActive
      unit
      measureValue
      isFeatured
      stock {
      id
      quantity
      reservedQuantity
    }
      category {
        id
        name
      }
      images {
        id
        image
        sortOrder
      }
    }
  }
`,
  UPDATE_STOCK: `
mutation UpdateStock($productId: Int!, $quantity: Int!) {
  updateStock(productId: $productId, quantity: $quantity) {
    stock {
      id
      quantity
      reservedQuantity
    }
  }
}
`,

  GET_ALL_STOCKS: `
    query GetAllStocks {
      allStocks {
        id
        product {
          id
          name
          sku
          category {
            name
          }
        }
        quantity
        reservedQuantity
      }
    }
  `,

  GET_DASHBOARD: `
    query AdminDashboard {
      dashboardStats {
        totalOrdersToday
        totalOrdersMonth
        totalRevenue
        totalProducts
        totalCustomers
        pendingOrders
        lowStockProducts
      }
      salesTrend {
        month
        sales
        orders
      }
      topProducts {
        id
        name
        totalSold
        stock
        price
      }
      recentProducts {
        id
        name
        stock
        price
      }
      recentOrders {
        id
        orderNumber
        customerName
        status
        createdAt
      }
    }
  `,

  CREATE_ADMIN_ORDER: `
    mutation CreateAdminOrder($userId: Int!, $shippingAddress: String!, $items: [OrderItemInput!]!) {
      createAdminOrder(userId: $userId, shippingAddress: $shippingAddress, items: $items) {
        order {
          id
          orderNumber
          customerName
          items {
            product {
              name
            }
            quantity
            subtotal
          }
          status
          createdAt
        }
      }
    }
  `,

  UPDATE_ORDER_STATUS: `
    mutation UpdateOrderStatus($orderId: Int!, $status: String!, $note: String) {
      updateOrderStatus(orderId: $orderId, status: $status, note: $note) {
        success
        order {
          id
          status
        }
      }
    }
  `,

  GET_ALL_ORDERS: `
    query GetAllOrders($orderFrom: String, $query: String) {
      allOrders(orderFrom: $orderFrom, query: $query) {
        id
        orderNumber
        status
        totalAmount
        finalAmount
        createdAt
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        shippingAddress
        items {
          quantity
          subtotal
          product {
            name
            unit
            measureValue
            images {
              image
            }
          }
        }
      }
    }
  `,

  ADMIN_CREATE_CUSTOMER: `
    mutation AdminCreateCustomer($email: String!, $password: String!, $firstName: String!, $lastName: String!, $phone: String) {
      adminCreateCustomer(email: $email, password: $password, firstName: $firstName, lastName: $lastName, phone: $phone) {
        customer {
          id
        }
      }
    }
  `,

  GET_CUSTOMERS: `
    query GetCustomers($search: String) {
      customers(first: 10, search: $search) {
        customers {
          id
          user {
            firstName
            lastName
            email
            phone
          }
          addresses {
            id
            city
            state
            pincode
            isDefault
          }
        }
        nextCursor
        hasMore
      }
    }
  `,

  GET_PRODUCTS_SIMPLE: `
    query GetProductsSimple {
      products {
        id
        name
        sku
        price
        stock
        status
        category {
          name
        }
      }
    }
  `,
};



export default graphqlRequest;
