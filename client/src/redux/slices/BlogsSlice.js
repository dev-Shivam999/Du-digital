import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// Async thunk to fetch blogs
export const fetchBlogs = createAsyncThunk(
    'Blogs/fetchBlogs',
    async (params, { rejectWithValue }) => {
        try {
            // Handle both primitive input (page number) and object input ({page, limit})
            const page = typeof params === 'object' ? params.page : params;
            const limit = typeof params === 'object' ? params.limit : 10;
            const safePage = page || 1;

            const response = await fetch(`${BackendURL}/api/blogs?page=${safePage}&limit=${limit}&IsUsers=true`);
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchSingleBlog = createAsyncThunk(
    'Blogs/fetchSingleBlog',
    async (id, { rejectWithValue }) => {
        try {

            const response = await fetch(`${BackendURL}/api/blogs/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    Blogs: [],
    SingleBlog: {},
    totalPages: 0,
    loading: false,
    error: null
}

const BlogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                // Transform API data to match component expectations
                state.Blogs = action.payload.blogs
                state.totalPages = action.payload.totalPages

                state.error = null;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSingleBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleBlog.fulfilled, (state, action) => {
                state.loading = false;
                // Transform API data to match component expectations
                state.SingleBlog = action.payload
                state.error = null;
            })
            .addCase(fetchSingleBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export default BlogsSlice.reducer;

