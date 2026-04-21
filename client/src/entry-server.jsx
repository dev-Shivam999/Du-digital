import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// All reducers
import investorReducer from './redux/slices/investorSlice';
import contactReducer from './redux/slices/contactSlice';
import partnerReducer from './redux/slices/partnerSlice';
import teamReducer from './redux/slices/teamSlice';
import galleryReducer from './redux/slices/gallerySlice';
import videoReducer from './redux/slices/videoSlice';
import officeReducer from './redux/slices/officeSlice';
import BlogReducer from './redux/slices/BlogsSlice';
import careersReducer from './redux/slices/careersSlice';
import newsReducer from './redux/slices/newsSlice';
import eventsReducer from './redux/slices/eventsSlice';
import TravelPackageReducer from './redux/slices/travelPackagesSlice';
import salesReducer from './redux/slices/salesSlice';

import App from './App';

/** Creates a fresh Redux store per request */
function createServerStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            investor: investorReducer,
            contact: contactReducer,
            partner: partnerReducer,
            team: teamReducer,
            gallery: galleryReducer,
            video: videoReducer,
            office: officeReducer,
            blog: BlogReducer,
            careers: careersReducer,
            news: newsReducer,
            events: eventsReducer,
            travelPackages: TravelPackageReducer,
            sales: salesReducer,
        },
        preloadedState,
    });
}

/**
 * render(url, preloadedState, onShellReady callback)
 */
export function render(url, preloadedState, onShellReady, onError) {
    const store = createServerStore(preloadedState);

    try {
        const html = renderToString(
            <MemoryRouter initialEntries={[url]}>
                <Provider store={store}>
                    <App />
                </Provider>
            </MemoryRouter>
        );
        // In this sync version, onShellReady receives a string, not a pipe
        onShellReady(html, store.getState());
    } catch (err) {
        if (onError) onError(err);
    }
}
