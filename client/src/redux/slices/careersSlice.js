import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Async thunk to fetch careers
export const fetchCareers = createAsyncThunk(
    'careers/fetchCareers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/careers/`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch careers');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching careers');
        }
    }
);
export const SubmitCv = createAsyncThunk(
    'careers/submitCv',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('careerId', data.jobId);
            formData.append('jobTitle', data.jobTitle);
            formData.append('fullName', data.name);
            formData.append('email', data.email);
            formData.append('phone', JSON.stringify(data.phone));
            formData.append('cv', data.resume);

            const response = await fetch(`${BackendURL}/api/employees`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit CV');
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while submitting CV');
        }
    }
);

const initialState = {
    jobs: [],
    loading: false,
    error: null,
    success: false,
    success2: false
};

const careersSlice = createSlice({
    name: 'careers',
    initialState,
    reducers: {
        clearCareersState: (state) => {
            state.error = null;
            state.success = false;
            state.success2 = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCareers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.success2 = false;
            })
            .addCase(fetchCareers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.jobs = action.payload;
                state.error = null;
            })
            .addCase(fetchCareers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            }).addCase(SubmitCv.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success2 = false;
            })
            .addCase(SubmitCv.fulfilled, (state, action) => {
                state.loading = false;
                state.success2 = true;
                state.error = null;
            })
            .addCase(SubmitCv.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success2 = false;
            });
    }
});

export const { clearCareersState } = careersSlice.actions;
export default careersSlice.reducer;
