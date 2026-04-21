import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Async thunk to fetch gallery images
export const fetchGallery = createAsyncThunk(
    'gallery/fetchGallery',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/gallery/`);
            if (!response.ok) {
                throw new Error('Failed to fetch gallery images');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    images: [],
    loading: false,
    error: null
}

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGallery.fulfilled, (state, action) => {
                state.loading = false;
                // Transform API data to match component expectations
                state.images = action.payload.map(item => ({
                    _id: item._id,
                    imageSrc: item.FileUser,
                    imageName: item.FileUser.split('/').pop() || 'Gallery Image',
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }));
                state.error = null;
            })
            .addCase(fetchGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default gallerySlice.reducer;

