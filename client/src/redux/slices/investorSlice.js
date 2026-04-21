import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Async thunk to fetch a single category by slug
export const fetchInvestorCategoryBySlug = createAsyncThunk(
    'investor/fetchCategoryBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/investor/category/${slug}`);
            if (!response.ok) {
                throw new Error('Failed to fetch category');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    category: null,
    reports: [],
    loading: false,
    error: null
}

const investorSlice = createSlice({
    name: 'investor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvestorCategoryBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvestorCategoryBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload.category;
                state.reports = action.payload.reports || [];
                state.error = null;
            })
            .addCase(fetchInvestorCategoryBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default investorSlice.reducer;
