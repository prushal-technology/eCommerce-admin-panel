import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Mock user database for testing
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@ecommerce.com',
    password: 'manager123',
    role: 'manager',
    permissions: ['read', 'write']
  },
  {
    id: '3',
    name: 'Employee User',
    email: 'employee@ecommerce.com',
    password: 'employee123',
    role: 'employee',
    permissions: ['read']
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@ecommerce.com',
    password: 'password123',
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  }
];

// Mock async thunks for testing
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Find user in mock database
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user;
      
      const mockResponse = {
        user: userWithoutPassword,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };
      
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      return mockResponse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Mock user data
      return {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        permissions: ['read', 'write', 'delete']
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('authToken');
      });
  },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
