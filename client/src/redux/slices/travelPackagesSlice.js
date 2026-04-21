import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Async thunk to get all travel packages
export const TravelPackage = createAsyncThunk(
    'travelPackages/getTravelPackages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/travel-packages`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch travel packages');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching travel packages');
        }
    }
);

// Async thunk to send travel inquiry
export const SendQueryTravelPackage = createAsyncThunk(
    'travelPackages/SendQueryTravelPackage',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/travel-inquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to send travel inquiry');
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while sending the inquiry');
        }
    }
);

const initialState = {
    // For fetching packages
    loading: false,
    error: null,
    data: [],
    // For form submission (separate state)
    formLoading: false,
    formError: null,
    formSuccess: false,
};

const travelPackagesSlice = createSlice({
    name: 'travelPackages',
    initialState,
    reducers: {
        resetFormState: (state) => {
            state.formLoading = false;
            state.formError = null;
            state.formSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch packages
            .addCase(TravelPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(TravelPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(TravelPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Send inquiry (separate state - doesn't affect data)
            .addCase(SendQueryTravelPackage.pending, (state) => {
                state.formLoading = true;
                state.formError = null;
                state.formSuccess = false;
            })
            .addCase(SendQueryTravelPackage.fulfilled, (state) => {
                state.formLoading = false;
                state.formSuccess = true;
                state.formError = null;
            })
            .addCase(SendQueryTravelPackage.rejected, (state, action) => {
                state.formLoading = false;
                state.formSuccess = false;
                state.formError = action.payload;
            });
    },
});

export const { resetFormState } = travelPackagesSlice.actions;
export default travelPackagesSlice.reducer;