
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './Plans.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import investorReducer from './redux/slices/investorSlice'
import contactReducer from './redux/slices/contactSlice'
import partnerReducer from './redux/slices/partnerSlice'
import teamReducer from './redux/slices/teamSlice'
import galleryReducer from './redux/slices/gallerySlice'
import videoReducer from './redux/slices/videoSlice'
import officeReducer from './redux/slices/officeSlice'
import BlogReducer from './redux/slices/BlogsSlice'
import careersReducer from './redux/slices/careersSlice'
import newsReducer from './redux/slices/newsSlice'
import eventsReducer from './redux/slices/eventsSlice'
import TravelPackageReducer from './redux/slices/travelPackagesSlice'
import salesReducer from './redux/slices/salesSlice'

// Pick up server-injected Redux state (from SSR server)
const preloadedState = window.__PRELOADED_STATE__ || {}
delete window.__PRELOADED_STATE__ // clean up

const store = configureStore({
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
})

const rootEl = document.getElementById('root')
const app = (
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)

// SSR server always sends pre-rendered HTML → hydrate
// Dev / fallback without SSR → normal render
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}


/*
unzip dist.zip
sudo rm -rf /var/www/du-digital/client/dist
sudo mkdir -p /var/www/du-digital/client
sudo cp -r dist /var/www/du-digital/client/
sudo chown -R www-data:www-data /var/www/du-digital
sudo chmod -R 755 /var/www/du-digital
sudo nginx -t
sudo systemctl reload nginx

unzip dist.zip
sudo rm -rf /var/www/du-digital/admin/dist
sudo mkdir -p /var/www/du-digital/admin
sudo cp -r dist /var/www/du-digital/admin/
sudo chown -R www-data:www-data /var/www/du-digital
sudo chmod -R 755 /var/www/du-digital
sudo nginx -t
sudo systemctl reload nginx
*/


// file path
// {mv ~/Downloads/okxxx.pem ~/.ssh/ }
//  ssh -i ~/.ssh/okxxx.pem ubuntu@13.203.217.17
/*
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm list-remote

nvm install lts

*/