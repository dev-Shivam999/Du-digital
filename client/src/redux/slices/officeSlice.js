import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Async thunk to fetch grouped office locations
export const fetchGroupedOffices = createAsyncThunk(
    'office/fetchGroupedOffices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/office/locations/grouped`);
            if (!response.ok) {
                throw new Error('Failed to fetch office locations');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    india: [],
    international: [],
    loading: false,
    error: null
}

const officeSlice = createSlice({
    name: 'office',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroupedOffices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupedOffices.fulfilled, (state, action) => {
                state.loading = false;
                state.india = action.payload.india || [];
                state.international = action.payload.international || [];
                state.error = null;
            })
            .addCase(fetchGroupedOffices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default officeSlice.reducer;

