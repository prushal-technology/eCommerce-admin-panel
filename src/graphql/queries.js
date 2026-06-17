import { gql } from '@apollo/client';

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilter, $pagination: PaginationInput) {
    products(filter: $filter, pagination: $pagination) {
      edges {
        node {
          id
          name
          shortDescription
          deliveryRuleDays
          description
          price
          category {
            id
            name
          }
          
          status
          imageUrl
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      shortDescription
      deliveryRuleDays
      description
      price
      category {
        id
        name
      }
      stock
      status
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $pagination: PaginationInput) {
    searchProducts(query: $query, pagination: $pagination) {
      edges {
        node {
          id
          name
          description
          price
          category {
            name
          }
          stock
          status
          imageUrl
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

// Category Queries
export const GET_CATEGORIES = gql`
  query GetCategories(
    $first: Int!
    $after: String
    $query: String
  ) {
    allCategories(
      first: $first
      after: $after
      query: $query
    ) {
      categories {
        id
        name
        description
        image
        isActive
        createdAt

        parent {
          id
          name
        }
      }

      nextCursor
      hasMore
      totalCategories
      activeCategories
      inactiveCategories
    }
  }
`;

// export const GET_CATEGORY = gql`
//   query GetCategory($id: ID!) {
//     category(id: $id) {
//       id
//       name
//       description
//       productCount
//       icon
//       status
//       createdAt
//     }
//   }
// `;

// Order Queries
// export const GET_ORDERS = gql`
//   query GetOrders($filter: OrderFilter, $pagination: PaginationInput) {
//     orders(filter: $filter, pagination: $pagination) {
//       edges {
//         node {
//           id
//           orderNumber
//           status
//           total
//           currency
//           customer {
//             id
//             name
//             email
//           }
//           items {
//             id
//             product {
//               id
//               name
//               imageUrl
//             }
//             quantity
//             price
//             total
//           }
//           shippingAddress {
//             street
//             city
//             state
//             zipCode
//             country
//           }
//           paymentMethod
//           createdAt
//           updatedAt
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//       }
//       totalCount
//     }
//   }
// `;

// export const GET_ORDER = gql`
//   query GetOrder($id: ID!) {
//     order(id: $id) {
//       id
//       orderNumber
//       status
//       total
//       currency
//       customer {
//         id
//         name
//         email
//         phone
//       }
//       items {
//         id
//         product {
//           id
//           name
//           description
//           imageUrl
//         }
//         quantity
//         price
//         total
//       }
//       shippingAddress {
//         street
//         city
//         state
//         zipCode
//         country
//       }
//       billingAddress {
//         street
//         city
//         state
//         zipCode
//         country
//       }
//       paymentMethod
//       paymentStatus
//       trackingNumber
//       createdAt
//       updatedAt
//     }
//   }
// `;

// Customer Queries
// export const GET_CUSTOMERS = gql`
//   query GetCustomers($filter: CustomerFilter, $pagination: PaginationInput) {
//     customers(filter: $filter, pagination: $pagination) {
//       edges {
//         node {
//           id
//           name
//           email
//           phone
//           status
//           totalOrders
//           totalSpent
//           joinDate
//           lastOrderDate
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//       }
//       totalCount
//     }
//   }
// `;

// export const GET_ALL_CUSTOMERS = gql`
//   query GetAllCustomers {
//     allCustomers {
//       id
//       customerId
//       user {
//         email
//       }
//     }
//   }
// `;

// export const GET_CUSTOMER = gql`
//   query GetCustomer($id: ID!) {
//     customer(id: $id) {
//       id
//       name
//       email
//       phone
//       status
//       totalOrders
//       totalSpent
//       joinDate
//       lastOrderDate
//       addresses {
//         id
//         street
//         city
//         state
//         zipCode
//         country
//         isDefault
//       }
//       orders(pagination: { limit: 10 }) {
//         edges {
//           node {
//             id
//             orderNumber
//             status
//             total
//             createdAt
//           }
//         }
//       }
//     }
//   }
// `;

// Inventory Queries
// export const GET_INVENTORY = gql`
//   query GetInventory($filter: InventoryFilter, $pagination: PaginationInput) {
//     inventory(filter: $filter, pagination: $pagination) {
//       edges {
//         node {
//           id
//           product {
//             id
//             name
//             sku
//           }
//           currentStock
//           minStock
//           maxStock
//           reorderPoint
//           status
//           lastUpdated
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//       }
//       totalCount
//     }
//   }
// `;

// export const GET_INVENTORY_STATS = gql`
//   query GetInventoryStats {
//     inventoryStats {
//       totalItems
//       inStockCount
//       lowStockCount
//       outOfStockCount
//       totalValue
//     }
//   }
// `;

// Analytics Queries
// export const GET_DASHBOARD_STATS = gql`
//   query GetDashboardStats($dateRange: DateRange) {
//     dashboardStats(dateRange: $dateRange) {
//       totalRevenue
//       totalOrders
//       totalCustomers
//       avgOrderValue
//       revenueChange
//       ordersChange
//       customersChange
//       avgOrderValueChange
//     }
//   }
// `;

// export const GET_SALES_DATA = gql`
//   query GetSalesData($dateRange: DateRange, $groupBy: SalesGroupBy) {
//     salesData(dateRange: $dateRange, groupBy: $groupBy) {
//       date
//       revenue
//       orders
//       customers
//     }
//   }
// `;

// export const GET_CATEGORY_SALES = gql`
//   query GetCategorySales($dateRange: DateRange) {
//     categorySales(dateRange: $dateRange) {
//       category {
//         id
//         name
//       }
//       revenue
//       orders
//       percentage
//     }
//   }
// `;

// export const GET_TOP_PRODUCTS = gql`
//   query GetTopProducts($dateRange: DateRange, $limit: Int) {
//     topProducts(dateRange: $dateRange, limit: $limit) {
//       product {
//         id
//         name
//         imageUrl
//       }
//       sales
//       revenue
//     }
//   }
// `;

// export const GET_CUSTOMER_GROWTH = gql`
//   query GetCustomerGrowth($dateRange: DateRange, $groupBy: CustomerGrowthGroupBy) {
//     customerGrowth(dateRange: $dateRange, groupBy: $groupBy) {
//       date
//       newCustomers
//       returningCustomers
//       totalCustomers
//     }
//   }
// `;

// Auth Queries
export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
      permissions
    }
  }
`;

// Order Queries
export const GET_SYSTEM_ORDERS = gql`
  query GetSystemOrders {
    allOrders(orderFrom: "admin_panel") {
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
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders {
    allOrders(orderFrom: "storefront") {
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
`;

// Employee Queries
export const GET_EMPLOYEES = gql`
  query GetEmployees($first: Int!, $after: String, $search: String) {
    employees(first: $first, after: $after, search: $search) {
      employees {
        id
        employeeId
        roleName
        isActive
        user {
          id
          email
          firstName
          lastName
          phone
        }
      }
      nextCursor
      hasMore
    }
  }
`;


