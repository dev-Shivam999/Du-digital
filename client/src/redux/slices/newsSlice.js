import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Async thunk to fetch news
export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async ({ page = 1, limit = 10, append = false } = {}, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/news?page=${page}&limit=${limit}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch news');
            }

            const data = await response.json();
            return { ...data, append };
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching news');
        }
    }
);

const initialState = {
    news: [],
    yearCounts: {},
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    success: false
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        clearNewsState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const newNews = action.payload.data || action.payload.news || action.payload;
                if (action.payload.append) {
                    // Prevent duplicates by checking _id
                    const existingIds = new Set(state.news.map(item => item._id));
                    const uniqueNewNews = newNews.filter(item => !existingIds.has(item._id));
                    state.news = [...state.news, ...uniqueNewNews];
                } else {
                    state.news = newNews;
                }
                state.totalPages = action.payload.totalPages || 0;
                state.currentPage = action.payload.currentPage || 1;
                state.yearCounts = action.payload.yearCounts || {};
                state.error = null;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearNewsState } = newsSlice.actions;
export default newsSlice.reducer;
