import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async ({ filter = {}, pagination = {} }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter, pagination }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchInventoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/inventory/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory stats');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async ({ id, inventoryData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update inventory item');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adjustStock = createAsyncThunk(
  'inventory/adjustStock',
  async ({ productId, quantity, reason }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/inventory/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to adjust stock');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  inventory: [],
  stats: {
    totalItems: 0,
    inStockCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalValue: 0,
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  filters: {
    search: '',
    status: '',
    category: '',
  },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventory = action.payload.inventory || [];
        state.pagination = { ...state.pagination, ...action.payload.pagination };
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Inventory Stats
      .addCase(fetchInventoryStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchInventoryStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Inventory Item
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.inventory.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Adjust Stock
      .addCase(adjustStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adjustStock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.inventory.findIndex(item => item.product.id === action.payload.productId);
        if (index !== -1) {
          state.inventory[index] = { ...state.inventory[index], ...action.payload };
        }
      })
      .addCase(adjustStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, setPagination } = inventorySlice.actions;
export default inventorySlice.reducer;
