# DU Digital Admin Content Management System

A modern, professional admin panel for managing DU Digital's website content, built with React frontend and Node.js/Express backend. The UI is designed to match the professional aesthetic of the DU Digital brand.

## 🎨 Enhanced UI/UX Features

- **Modern Sidebar Navigation**: Collapsible sidebar with organized sections and smooth animations
- **Professional Color Scheme**: Inspired by DU Digital's brand colors with gradient effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Comprehensive Loading States**: Skeleton loaders, form overlays, and page loaders for better UX
- **Consistent UI Components**: Extensive component library for consistent styling across all pages
- **Dark Sidebar with Light Content**: Professional contrast with enhanced visual effects
- **Interactive Elements**: Advanced hover effects, smooth transitions, and modern icons
- **Toast Notifications**: Modern notification system replacing basic alerts
- **Markdown Editor**: Advanced markdown editor with live preview for blog content
- **Enhanced Animations**: Smooth page transitions, card animations, and loading states
- **Modal System**: Professional modal dialogs with proper focus management
- **Form Enhancements**: Better form validation, image previews, and loading states
- **Empty States**: User-friendly empty states with actionable CTAs
- **Status Indicators**: Color-coded badges and status indicators
- **Action Buttons**: Consistent action buttons with hover effects

## Project Structure

```
├── admin/          # React frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Main layout with sidebar
│   │   │   ├── Layout.css         # Layout-specific styles
│   │   │   ├── UI.jsx             # Reusable UI components
│   │   │   ├── Toast.jsx          # Toast notification system
│   │   │   └── LoadingStates.jsx  # Loading components and skeletons
│   │   ├── pages/                 # Enhanced page components
│   │   ├── services/              # API services
│   │   └── ...
├── backend/        # Node.js backend (Express + MongoDB)
├── package.json    # Root package.json for managing both projects
└── README.md       # This file
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

## Quick Start

1. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**

   - Backend: Update `backend/.env` with your MongoDB URI and other settings
   - Frontend: Update `admin/.env` with your API base URL

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   This will start both backend (port 5000) and frontend (port 3000) concurrently.

## Individual Commands

### Backend

```bash
cd backend
npm run dev      # Start development server
npm run build    # Build TypeScript
npm start        # Start production server
```

### Frontend

```bash
cd admin
npm run dev      # Start development server
npm run build    # Build for production
```

## UI Components

The admin panel includes a comprehensive UI component library (`admin/src/components/UI.jsx`) with:

- **LoadingSpinner**: Consistent loading states
- **PageHeader**: Standardized page headers with actions
- **EmptyState**: User-friendly empty states
- **StatCard**: Dashboard statistics cards
- **ActionCard**: Quick action buttons
- **Badge**: Status indicators
- **Button**: Consistent button styling
- **FormGroup**: Form field containers
- **Input/Textarea**: Form controls

### Usage Example:

```jsx
import { PageHeader, StatCard, EmptyState } from "../components/UI";
import { Users } from "lucide-react";

const MyPage = () => (
  <div>
    <PageHeader
      title="My Page"
      description="Manage your content"
      stats={[{ label: "5 Active", variant: "bg-success" }]}
    />
    <StatCard
      title="Total Users"
      count={150}
      icon={Users}
      color="#3b82f6"
      trend="+12%"
    />
  </div>
);
```

## Features

- **Content Management:** Blogs, News, Events, Gallery
- **Team Management:** Team members, Sales experts
- **Business Management:** Careers, Partners, Office locations
- **Communication:** Contact inquiries, Investor relations
- **Media Management:** Video uploads and management

## Technology Stack

### Backend

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- CORS enabled

### Frontend

- React 19
- Vite build tool
- React Router
- Axios for API calls
- TinyMCE for rich text editing
- Lucide React icons
- Modern CSS with CSS Variables

## API Endpoints

The backend provides RESTful APIs for all content types:

- `/api/blogs` - Blog management
- `/api/news` - News management
- `/api/events` - Event management
- `/api/gallery` - Image gallery
- `/api/team-members` - Team management
- `/api/careers` - Career postings
- `/api/contact` - Contact inquiries
- And more...

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://127.0.0.1:27017/dudigital
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=admin@dudigitalglobal.com
ADMIN_PASSWORD=admin@123456
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Design System

The admin panel follows a consistent design system:

### Colors

- **Primary**: Blue gradient (#3b82f6 to #8b5cf6)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Danger**: #ef4444
- **Gray Scale**: From #f8fafc to #0f172a

### Typography

- **Font**: Inter (system fallback)
- **Headings**: 600 weight, proper hierarchy
- **Body**: 400 weight, 1.6 line height

### Components

- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient primary, hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Dark sidebar with active states

## Contributing

When adding new pages or components:

1. Use the existing UI components from `components/UI.jsx`
2. Follow the established color scheme and spacing
3. Ensure responsive design
4. Test on different screen sizes
5. Maintain consistent styling patterns

## License

MIT
