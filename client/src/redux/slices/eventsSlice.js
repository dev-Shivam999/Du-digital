import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Async thunk to fetch all events
export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async ({ page = 1, limit = 9 } = {}, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BackendURL}/api/events?page=${page}&limit=${limit}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch events');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching events');
        }
    }
);

// Async thunk to fetch single event with images
export const fetchEventById = createAsyncThunk(
    'events/fetchEventById',
    async (eventId, { rejectWithValue }) => {
        try {
            // Fetch event details directly
            const eventResponse = await fetch(`${BackendURL}/api/events/${eventId}`);
            if (!eventResponse.ok) {
                if (eventResponse.status === 404) {
                    throw new Error('Event not found');
                }
                throw new Error('Failed to fetch event details');
            }
            const event = await eventResponse.json();

            // Fetch event images
            const imagesResponse = await fetch(`${BackendURL}/api/events/${eventId}/images`);
            if (!imagesResponse.ok) {
                const errorData = await imagesResponse.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch event images');
            }

            const imageData = await imagesResponse.json();

            // Extract fileUrl from each image object
            const images = imageData.map(img => img.fileUrl);

            // Combine event with images
            return {
                ...event,
                images
            };
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while fetching event details');
        }
    }
);

const initialState = {
    events: [],
    totalPages: 0,
    selectedEvent: null,
    loading: false,
    eventLoading: false,
    error: null,
    success: false
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEventsState: (state) => {
            state.error = null;
            state.success = false;
        },
        clearSelectedEvent: (state) => {
            state.selectedEvent = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all events
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.events = action.payload.data || action.payload.events || action.payload; // Handle both paginated and non-paginated responses
                state.totalPages = action.payload.totalPages || 0;
                state.error = null;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch single event
            .addCase(fetchEventById.pending, (state) => {
                state.eventLoading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.eventLoading = false;
                state.selectedEvent = action.payload;
                state.error = null;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.eventLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearEventsState, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
