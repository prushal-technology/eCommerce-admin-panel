import CryptoJS from 'crypto-js';
import { GRAPHQL_QUERIES, graphqlRequest, setAuthToken } from './graphql';

const ENCRYPTION_KEY = import.meta.env.VITE_USER_ENCRYPTION_KEY?.trim();

// ================= LOGIN =================
export const loginAPI = async (email, password) => {
  try {
    const data = await graphqlRequest(GRAPHQL_QUERIES.LOGIN, {
      email,
      password
    });

    const authData = data?.tokenAuth;

    if (authData?.token) {
      const token = authData.token;

      // ✅ Store token
      localStorage.setItem('authToken', token);
      setAuthToken(token);

      // ✅ Normalize role (important)
      const userRole = authData.role?.toLowerCase() || 'employee';

      const userInfo = {
        id: authData.user?.id,
        email: authData.user?.email,
        first_name: authData.user?.firstName || (userRole === 'admin' ? 'Admin' : 'User'),
        role: userRole,
        isAuthenticated: true
      };

      //console.log('Saving userInfo:', userInfo);
      //console.log('ENCRYPTION_KEY:', ENCRYPTION_KEY);

      // ✅ Encrypt user data
      const encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(userInfo),
        ENCRYPTION_KEY
      ).toString();

      localStorage.setItem('user', encryptedUser);
      //console.log('Saved encrypted user to localStorage');

      return {
        success: true,
        user: userInfo
      };
    }

    return {
      success: false,
      message: 'Invalid credentials'
    };

  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.errors?.[0]?.message ||
        error.message ||
        'Login failed'
    };
  }
};

// ================= LOGOUT =================
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  setAuthToken(null);
};

// ================= GET USER =================
export const getCurrentUser = () => {
  try {
    const encryptedUser = localStorage.getItem('user');
    if (!encryptedUser) return null;

    const bytes = CryptoJS.AES.decrypt(encryptedUser, ENCRYPTION_KEY);
    const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    return null;
  }
};

// ================= GET ROLE =================
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'guest';
};


// ================= AUTH CHECK =================
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  return !!token && !!user;
};