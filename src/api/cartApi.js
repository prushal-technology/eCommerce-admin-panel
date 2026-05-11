import { graphqlRequest } from "./graphql";

// ADD TO CART
export const addToCart = async (productId, quantity = 1) => {
    const query = `
    mutation($productId: Int!, $quantity: Int!) {
      addToCart(productId: $productId, quantity: $quantity) {
        cart { id }
      }
    }
  `;

    return graphqlRequest(query, { productId, quantity });
};

// UPDATE ITEM
export const updateCartItem = async (cartItemId, quantity) => {
    const query = `
    mutation($cartItemId: Int!, $quantity: Int!) {
      updateCartItem(cartItemId: $cartItemId, quantity: $quantity) {
        cart { id }
      }
    }
  `;

    return graphqlRequest(query, {
        cartItemId: Number(cartItemId),
        quantity: Number(quantity), // ✅ IMPORTANT
    });
};

// REMOVE ITEM
export const removeCartItem = async (cartItemId) => {
    const query = `
    mutation($cartItemId: Int!) {
      removeCartItem(cartItemId: $cartItemId) {
        cart { id }
      }
    }
  `;

    return graphqlRequest(query, { cartItemId });
};

export const getCart = async () => {
    const query = `
    query {
      myCart {
        id
        items {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
  `;

    return graphqlRequest(query);
};