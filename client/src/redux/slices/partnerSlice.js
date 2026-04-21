import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Async thunk to submit partner form
export const submitPartnerForm = createAsyncThunk(
    'partner/submitForm',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/partner/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit partner form');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while submitting the form');
        }
    }
);

// Async thunk to fetch official partners
export const fetchOfficialPartners = createAsyncThunk(
    'partner/fetchOfficialPartners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/partner/official`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch official partners');
            }

            const data = await response.json();
            console.log("data", data)
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching official partners');
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    submittedData: null,
    officialPartners: [],
    loadingOfficialPartners: false,
    successMsg:""
}

const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {
        clearPartnerState: (state) => {
            state.error = null;
            state.success = false;
            state.submittedData = null;
            state.successMsg=null
        },
        dataFill:(state,action)=>{
            state.success =action.payload.data.success;
            state.error = action.payload.data.error;
            state.successMsg = action.payload.data.msg;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPartnerForm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitPartnerForm.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.submittedData = action.payload;
                state.error = null;
            })
            .addCase(submitPartnerForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch Official Partners
            .addCase(fetchOfficialPartners.pending, (state) => {
                state.loadingOfficialPartners = true;
                state.error = null;
            })
            .addCase(fetchOfficialPartners.fulfilled, (state, action) => {
                state.loadingOfficialPartners = false;
                state.officialPartners = action.payload;
            })
            .addCase(fetchOfficialPartners.rejected, (state, action) => {
                state.loadingOfficialPartners = false;
                state.error = action.payload;
            });
    }
})

export const { clearPartnerState,dataFill } = partnerSlice.actions;
export default partnerSlice.reducer;

