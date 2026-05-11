// Product API Functions
import { GRAPHQL_QUERIES, graphqlRequest } from './graphql';

// Get all products
export const getAllProducts = async (first = 10, after = null, search = null, categoryId = null) => {
  try {
    const variables = { first };
    if (after) variables.after = after;
    if (search) variables.search = search;
    if (categoryId) variables.categoryId = Number(categoryId);

    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_ALL_PRODUCTS, variables);
    
    return {
      success: true,
      products: data.products?.products || [],
      nextCursor: data.products?.nextCursor,
      hasMore: data.products?.hasMore
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch products'
    };
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const { categoryId, name, description, sku, price, discountPrice, isActive = true, unit, measureValue, isFeatured = false, quantity, reservedQuantity } = productData;
    
    // Convert categoryId to number if it's a string
    const numericCategoryId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
    
    // Convert price to number
    const numericPrice = parseFloat(price);
    
    const variables = {
      categoryId: numericCategoryId,
      name,
      description,
      sku,
      price: numericPrice,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      isActive,
      unit,
      measureValue: measureValue ? String(measureValue) : null,
      isFeatured,
      quantity: quantity ? parseInt(quantity, 10) : null,
      reservedQuantity: reservedQuantity ? parseInt(reservedQuantity, 10) : null
    };
    
    const data = await graphqlRequest(GRAPHQL_QUERIES.CREATE_PRODUCT, variables);
    
    if (data && data.createProduct) {
      return {
        success: true,
        product: data.createProduct.product,
        message: 'Product created successfully'
      };
    }
    
    return {
      success: false,
      message: 'Failed to create product'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create product'
    };
  }
};

// Update existing product
export const updateProduct = async (id, productData) => {
  try {
    const variables = {
      id: Number(id),
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      price: Number(productData.price),
      discountPrice:
        productData.discountPrice !== undefined &&
        productData.discountPrice !== null &&
        productData.discountPrice !== ""
          ? Number(productData.discountPrice)
          : null,
      isActive: productData.isActive,
      isFeatured: productData.isFeatured,
      unit: productData.unit,
      measureValue: productData.measureValue ? parseFloat(productData.measureValue) : null,
      categoryId: productData.categoryId ? Number(productData.categoryId) : null,
      quantity: productData.quantity ? parseInt(productData.quantity, 10) : null,
      reservedQuantity: productData.reservedQuantity ? parseInt(productData.reservedQuantity, 10) : 0
    };

    const data = await graphqlRequest(
      GRAPHQL_QUERIES.UPDATE_PRODUCT,
      variables
    );

    return {
      success: true,
      product: data.updateProduct.product
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Delete product image
export const deleteProductImage = async (imageId) => {
  try {
    const numericImageId = typeof imageId === 'string' ? parseInt(imageId, 10) : imageId;
    
    const data = await graphqlRequest(GRAPHQL_QUERIES.DELETE_PRODUCT_IMAGE, { imageId: numericImageId });
    
    if (data && data.deleteProductImage) {
      return {
        success: data.deleteProductImage.success,
        message: data.deleteProductImage.success ? 'Image deleted successfully' : 'Failed to delete image'
      };
    }
    
    return {
      success: false,
      message: 'Invalid response structure from server'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete product image'
    };
  }
};

// Get product stock
export const getProductStock = async (productId) => {
  try {
    const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_STOCK, { productId: numericProductId });
    
    if (data && data.stock) {
      return {
        success: true,
        stock: data.stock
      };
    }
    
    return {
      success: false,
      message: 'No stock data available'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch product stock'
    };
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    // Convert ID to number if it's a string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    //console.log('Deleting product with ID:', id, '(converted to:', numericId, ')');
    
    const data = await graphqlRequest(GRAPHQL_QUERIES.DELETE_PRODUCT, { id: numericId });
    //console.log('Delete product response:', data);
    
    // Check if response has data directly (like other mutations)
    if (data && data.deleteProduct) {
      //console.log('Delete success field:', data.deleteProduct.success);
      if (data.deleteProduct.success) {
        return {
          success: true,
          message: 'Product deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete product'
        };
      }
    }
    
    // Check if response has data wrapper
    if (data && data.data && data.data.deleteProduct) {
      //console.log('Delete success field (data wrapper):', data.data.deleteProduct.success);
      if (data.data.deleteProduct.success) {
        return {
          success: true,
          message: 'Product deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete product'
        };
      }
    }
    
    //console.error('Invalid delete response structure:', data);
    return {
      success: false,
      message: 'Invalid response structure from server'
    };
  } catch (error) {
    //console.error('Delete product error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete product'
    };
  }
};

// Get product categories
export const getProductCategories = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_CATEGORIES);
    
    if (data && data.allCategories) {
      return {
        success: true,
        categories: data.allCategories
      };
    }
    
    return {
      success: false,
      categories: [],
      message: 'No categories found'
    };
  } catch (error) {
   console.error('Categories API Error:', error);
    return {
      success: false,
      categories: [],
      message: error.message || 'Failed to fetch categories'
    };
  }
};

// Add product image
export const addProductImage = async (productId, imageFile, sortOrder = 1) => {
  try {
    // Convert productId to number if it's a string
    const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    
    // Convert file to base64
    const base64Image = await fileToBase64(imageFile);
    
    const data = await graphqlRequest(GRAPHQL_QUERIES.ADD_PRODUCT_IMAGE, {
      productId: numericProductId,
      image: base64Image,
      sortOrder
    });
    
    if (data && data.addProductImage) {
      return {
        success: true,
        product: data.addProductImage.product,
        message: 'Image added successfully'
      };
    }
    
    return {
      success: false,
      message: 'Failed to add image'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to add image'
    };
  }
};

export const getProductById = async (id) => {
  try {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    // WORKAROUND: The GraphQL backend currently lacks a `product(id)` query.
    // Instead of failing with "Cannot query field 'product'...", we fetch
    // from the `products` list and find the matching product. This allows
    // the previous detail view functionality to continue working.
    let hasMore = true;
    let nextCursor = null;

    while (hasMore) {
      const data = await graphqlRequest(
        GRAPHQL_QUERIES.GET_ALL_PRODUCTS,
        { first: 100, after: nextCursor }
      );

      const productsList = data?.products?.products || [];
      const product = productsList.find(p => parseInt(p.id, 10) === numericId);

      if (product) {
        return {
          success: true,
          product: product
        };
      }

      hasMore = data?.products?.hasMore || false;
      nextCursor = data?.products?.nextCursor || null;
    }

    return {
      success: false,
      message: "Product not found"
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch product"
    };
  }
};


export const updateStock = async (productId, quantity) => {
  try {
    const variables = {
      productId: Number(productId),
      quantity: Number(quantity)
    };

    const data = await graphqlRequest(
      GRAPHQL_QUERIES.UPDATE_STOCK,   // ✅ VERY IMPORTANT
      variables
    );

    if (data && data.updateStock) {
      return {
        success: true,
        stock: data.updateStock.stock
      };
    }

    return { success: false, message: "Stock update failed" };

  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Helper function to convert file to base64
export const getAllStocks = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_ALL_STOCKS);
    if (data && data.allStocks) {
      return { success: true, allStocks: data.allStocks };
    }
    return { success: false, message: "No stocks found" };
  } catch (error) {
    return { success: false, message: error.message || "Failed to fetch stocks" };
  }
};

export const getDashboard = async () => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.GET_DASHBOARD);
    return {
      success: true,
      dashboardStats: data.dashboardStats,
      salesTrend: data.salesTrend || [],
      topProducts: data.topProducts || [],
      recentProducts: data.recentProducts || [],
      recentOrders: data.recentOrders || [],
    };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch dashboard data' };
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
