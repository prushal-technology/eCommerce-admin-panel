import { getAuthToken, graphqlRequest as rawGraphqlRequest, removeAuthToken, setAuthToken } from '../api/graphql';

// Lightweight wrapper to keep existing graphqlRequest but provide
// a centralized place to add additional handling in future.
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const data = await rawGraphqlRequest(query, variables);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'GraphQL Error' };
  }
};

export { getAuthToken, removeAuthToken, setAuthToken };

export default {
  graphqlRequest,
  setAuthToken,
  getAuthToken,
  removeAuthToken
};
