import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Async thunk to fetch team members grouped by category
export const fetchTeamMembers = createAsyncThunk(
    'team/fetchTeamMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/team-members/?groupBy=category`);
            if (!response.ok) {
                throw new Error('Failed to fetch team members');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    teamMembersByCategory: {},
    loading: false,
    error: null
}

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.teamMembersByCategory = action.payload;
                state.error = null;
            })
            .addCase(fetchTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default teamSlice.reducer;

