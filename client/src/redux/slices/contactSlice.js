import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Async thunk to submit contact form
export const submitContactForm = createAsyncThunk(
    'contact/submitForm',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit contact form');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while submitting the form');
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    submittedData: null,
    successMsg:null
}

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        clearContactState: (state) => {
            state.error = null;
            state.success = false;
            state.submittedData = null;
            state.successMsg = null;
        },dataFill2:(state,action)=>{
            state.success =action.payload.data.success;
            state.error = action.payload.data.error;
            state.successMsg = action.payload.data.msg;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContactForm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitContactForm.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.submittedData = action.payload;
                state.error = null;
            })
            .addCase(submitContactForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
})

export const { clearContactState,dataFill2 } = contactSlice.actions;
export default contactSlice.reducer;
