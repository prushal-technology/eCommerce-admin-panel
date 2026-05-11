import { graphqlRequest } from "./graphql";

// GET WISHLIST
export const getWishlist = async () => {
    const query = `
    query {
      myWishlist {
        id
        product {
          id
          name
          price
        }
      }
    }
  `;

    return graphqlRequest(query);
};

// ADD
export const addToWishlist = async (productId) => {
    const query = `
    mutation($productId: Int!) {
      addToWishlist(productId: $productId) {
        wishlist {
          id
        }
      }
    }
  `;

    return graphqlRequest(query, { productId: Number(productId) });
};

// REMOVE
export const removeFromWishlist = async (productId) => {
    const query = `
    mutation($productId: Int!) {
      removeFromWishlist(productId: $productId) {
        success
      }
    }
  `;

    return graphqlRequest(query, { productId: Number(productId) });
};