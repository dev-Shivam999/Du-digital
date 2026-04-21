import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Async thunk to fetch sales experts
export const fetchSalesExperts = createAsyncThunk(
    'sales/fetchSalesExperts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/sales-experts/`);
            if (!response.ok) {
                throw new Error('Failed to fetch sales experts');
            }
            const result = await response.json();
            return result.data; // Return the data array from the response
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    salesExperts: [],
    loading: false,
    error: null
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesExperts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalesExperts.fulfilled, (state, action) => {
                state.loading = false;
                state.salesExperts = action.payload;
                state.error = null;
            })
            .addCase(fetchSalesExperts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default salesSlice.reducer;
