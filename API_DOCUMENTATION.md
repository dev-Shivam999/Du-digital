# DU Digital Technical Documentation

## 1. Project Overview

This repository contains the full DU Digital platform in three main parts:

- `client/`: Public-facing website used by visitors and customers
- `admin/`: Internal admin panel used by the DU Digital team
- `backend/`: REST API, authentication, file upload handling, and database access

The system follows a typical full-stack architecture:

1. The public website and admin panel are both React applications.
2. Both frontends communicate with the Express backend through `/api/...` endpoints.
3. The backend connects to MongoDB through Mongoose models.
4. Uploaded files are stored in `backend/uploads`.

Base API URL:

```txt
http://localhost:5000/api
```

## 2. High-Level Architecture

```txt
client (public website) ----\
                              ---> backend (Express + TypeScript) ---> MongoDB
admin (admin panel) --------/
                              ---> uploads folder for images / files
```

## 3. Repository Structure

```txt
du-digital/
├── client/                    # Public React website
├── admin/                     # React admin dashboard
├── backend/                   # Express + TypeScript API server
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API route definitions
│   │   ├── models/            # Mongoose schemas/models
│   │   ├── middleware/        # Auth and upload middleware
│   │   ├── utils/             # Caching, email, SMS helpers
│   │   ├── db/                # MongoDB connection setup
│   │   └── index.ts           # Application entry point
│   ├── db/                    # JSON snapshots / test data files
│   ├── seeders/               # Seeder scripts
│   ├── uploads/               # Uploaded files
│   └── dist/                  # Compiled backend output
├── README.md
└── API_DOCUMENTATION.md
```

## 4. Frontend Structure

### 4.1 Public Website (`client/`)

The `client` app is the public DU Digital website built with:

- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS 4
- Swiper

Important folders:

- `client/src/pages/`: Route-level pages such as Home, About Us, Blogs, Careers, Events, Contact Us
- `client/src/components/`: Reusable UI grouped by feature/domain
- `client/src/redux/`: Redux store and API-related slices
- `client/src/hooks/`: Custom hooks
- `client/src/utils/`: Utility helpers
- `client/public/`: Static assets such as images, icons, and banners

Feature-oriented component folders include:

- `client/src/components/home/`
- `client/src/components/about-us/`
- `client/src/components/careers/`
- `client/src/components/news-and-events/`
- `client/src/components/become-partner/`
- `client/src/components/DigitalArrivalCards/`
- `client/src/components/reusable/`

Routing is defined in `client/src/App.jsx`. The public app includes routes like:

- `/`
- `/about-us`
- `/contact-us`
- `/blogs`
- `/blog/:id`
- `/events`
- `/events/:id`
- `/careers`
- `/investor-relation`
- `/video-gallery`

### 4.2 Admin Panel (`admin/`)

The `admin` app is the internal CMS/dashboard built with:

- React 19
- Vite
- React Router
- Redux Toolkit
- Axios

Important folders:

- `admin/src/pages/`: Admin management screens
- `admin/src/components/`: Shared layout and UI components
- `admin/src/services/`: API request layer
- `admin/src/context/`: Authentication context
- `admin/src/features/auth/`: Redux auth slice and permission state

Main admin modules:

- Dashboard
- Investor Relations
- Office Manager
- Contact Manager
- Partner Manager
- Gallery Manager
- News Manager
- Event Manager
- Career Manager
- Applicant Manager
- Sales Expert Manager
- Video Manager
- Blog Manager
- Team Member Manager
- User Manager
- Travel Package Manager
- Travel Inquiry Manager
- Form Manager
- Document Manager
- FAQ Manager
- Content Section Manager
- Pricing Plan Manager
- Form Image Manager
- Form Employees Address Manager
- Form Submission Manager

Routing is defined in `admin/src/App.jsx`.

## 5. Backend Structure

The backend is built with:

- Node.js
- Express
- TypeScript
- Mongoose
- JWT authentication
- Multer for uploads
- CORS

### 5.1 Backend Layers

#### `controllers/`
Contains the business logic for each resource. Each controller handles request validation, database operations, and responses.

Examples:

- `auth.controller.ts`
- `blog.controller.ts`
- `event.controller.ts`
- `formSubmission.controller.ts`
- `travelPackage.controller.ts`

#### `routes/`
Maps API endpoints to controller functions.

Examples:

- `auth.routes.ts`
- `user.routes.ts`
- `blog.routes.ts`
- `office.routes.ts`
- `pricingPlan.routes.ts`

#### `models/`
Defines MongoDB collections using Mongoose schemas.

Examples:

- `User.model.ts`
- `Blog.model.ts`
- `News.model.ts`
- `TeamMember.model.ts`
- `TravelPackages.model.ts`
- `FormField.model.ts`

#### `middleware/`
Reusable request middleware.

- `auth.middleware.ts`: JWT verification, admin-only access, permission checks
- `upload.middleware.ts`: Multer-based file upload handling

#### `utils/`
Shared helpers.

- `cache.ts`
- `emailService.ts`
- `sms.ts`

#### `db/`
MongoDB connection setup in `backend/src/db/index.ts`

### 5.2 Server Bootstrap

The backend entrypoint is `backend/src/index.ts`.

Main responsibilities:

- Load environment variables
- Create the Express app
- Enable JSON and URL-encoded request parsing
- Enable CORS
- Serve uploaded files from `/api/uploads`
- Connect to MongoDB
- Register all route modules
- Start the HTTP server

Note:

- The code includes a cluster-based startup pattern.
- It currently forks only one worker, so it behaves like a single-worker deployment with restart support.

## 6. Database Structure

### 6.1 Primary Database

The application uses MongoDB through Mongoose.

Connection setup:

- File: `backend/src/db/index.ts`
- Env var: `MONGODB_URI`

Default fallback connection:

```txt
mongodb://127.0.0.1:27017/myAppDB
```

### 6.2 Main Collections / Models

The backend manages these main data entities:

- `User`
- `Blog`
- `NewsMedia`
- `Event`
- `EventImage`
- `Gallery`
- `TeamMember`
- `Career`
- `Employee`
- `ContactInquiry`
- `Partner`
- `PartnerProgram`
- `OfficeType`
- `OfficeLocation`
- `InvestorCategory`
- `InvestorReport`
- `Video`
- `TravelPlan`
- `TravelInquiry`
- `Form`
- `FormField`
- `FormImage`
- `FormEmployeesAddress`
- `FormSubmission`
- `DocumentRequirement`
- `FAQ`
- `ContentSection`
- `PricingPlan`
- `OtpSchema`

### 6.3 `backend/db/` JSON Files

The `backend/db/` folder contains JSON files such as:

- `test.blogs.json`
- `test.users.json`
- `test.forms.json`
- `test.formfields.json`
- `test.travelplans.json`

These appear to be local snapshots, seed-style data, or test/reference data. They are useful for development and sample content but are separate from the live MongoDB connection used by the runtime backend.

## 7. Authentication and Authorization

Authentication is JWT-based.

### Auth Flow

1. Admin user logs in through `/api/auth/login`
2. Backend returns a token
3. Admin frontend stores the token in `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to protected requests
5. Backend middleware validates the token and loads the user

### Authorization Rules

The backend supports:

- `protect`: logged-in user only
- `adminOnly`: admin role only
- `hasPermission(permissionName)`: permission-based access

The admin app also supports role-based redirects, for example:

- sales users can be redirected toward contacts
- HR users can be redirected toward team/member-related areas

## 8. File Upload Structure

Uploaded assets are stored in:

```txt
backend/uploads/
```

The upload middleware:

- uses Multer disk storage
- generates timestamp-based filenames
- stores images and document uploads on the server filesystem

Static serving:

```txt
/api/uploads/<filename>
```

Examples of uploaded content:

- blog featured images
- gallery images
- event images
- logos
- form attachments
- user images
- PDFs for investor reports

## 9. API Module Map

The backend mounts these route groups:

| Base Path | Purpose |
| :--- | :--- |
| `/api/auth` | Login and current user |
| `/api/users` | User management |
| `/api/investor` | Investor relations categories and reports |
| `/api/office` | Office types and office locations |
| `/api/contact` | Contact inquiries |
| `/api/partner` | Partner program inquiries |
| `/api/gallery` | Gallery image management |
| `/api/news` | News and media |
| `/api/events` | Events and event images |
| `/api/careers` | Career openings |
| `/api/employees` | Job applicants |
| `/api/sales-experts` | Sales experts |
| `/api/videos` | Video gallery items |
| `/api/blogs` | Blogs |
| `/api/team-members` | Team members |
| `/api/travel-packages` | Travel package records |
| `/api/travel-inquiries` | Travel inquiry submissions |
| `/api/forms` | Dynamic/custom form definitions |
| `/api/documents` | Document requirement records |
| `/api/faqs` | FAQ data |
| `/api/content-sections` | Homepage/content section CMS data |
| `/api/pricing-plans` | Pricing plan content |
| `/api/form-images` | Form image assets |
| `/api/form-employees-addresses` | Employee address form records |
| `/api/form-submissions` | Submitted forms |
| `/api/otp` | OTP-related APIs |

## 10. API Reference

Base URL: `http://localhost:5000/api`

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Login user and get JWT token | No |
| `GET` | `/me` | Get current logged-in user details | Yes |

### User Management (`/users`)

Protected: Admin only

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get all users |
| `POST` | `/` | Create a new user |
| `PUT` | `/:id` | Update user details and permissions |
| `DELETE` | `/:id` | Delete a user |

### Sales Experts (`/sales-experts`)

Protected: Uses `User` model with role-based handling

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get all sales experts |
| `POST` | `/` | Add a new sales expert |
| `PUT` | `/:id` | Update sales expert details |
| `DELETE` | `/:id` | Delete sales expert |

### Blogs (`/blogs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all blogs | No |
| `GET` | `/:id` | Get single blog by ID | No |
| `POST` | `/` | Create blog with `featuredImage` upload | Yes |
| `PUT` | `/:id` | Update blog with optional `featuredImage` | Yes |
| `DELETE` | `/:id` | Delete blog | Yes |

### News & Media (`/news`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all news items | No |
| `POST` | `/` | Create news with `image` upload | Yes |
| `PUT` | `/:id` | Update news with optional `image` | Yes |
| `DELETE` | `/:id` | Delete news | Yes |

### Events (`/events`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all events | No |
| `POST` | `/` | Create event with `image` upload | Yes |
| `GET` | `/:id/images` | Get event gallery images | No |
| `POST` | `/:id/images` | Upload gallery images with `images[]` | Yes |

### Gallery (`/gallery`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all gallery images | No |
| `POST` | `/` | Upload image with `image` | Yes |
| `DELETE` | `/:id` | Delete image | Yes |

### Videos (`/videos`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all videos | No |
| `POST` | `/` | Add video using YouTube URL or metadata | Yes |
| `PUT` | `/:id` | Update video details | Yes |
| `DELETE` | `/:id` | Delete video | Yes |

### Investor Relations (`/investor`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats` | Get investor dashboard stats | No |
| `GET` | `/categories` | Get all investor categories | No |
| `GET` | `/category/:slug` | Get a specific category with reports | No |
| `POST` | `/categories` | Create category | Yes |
| `PUT` | `/categories/:id` | Update category | Yes |
| `DELETE` | `/categories/:id` | Delete category | Yes |
| `POST` | `/report` | Create report with `pdf` upload | Yes |
| `PUT` | `/report/:id` | Update report with optional `pdf` | Yes |
| `DELETE` | `/report/:id` | Delete report | Yes |

### Office Locations (`/office`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/locations` | Get all office locations | No |
| `GET` | `/locations/grouped` | Get locations grouped by region/type | No |
| `GET` | `/types` | Get office types | No |
| `POST` | `/locations` | Add office location | Yes |
| `PUT` | `/locations/:id` | Update office location | Yes |
| `DELETE` | `/locations/:id` | Delete office location | Yes |
| `POST` | `/types` | Add office type | Yes |
| `DELETE` | `/types/:id` | Delete office type | Yes |

### Team Members (`/team-members`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all team members | No |
| `POST` | `/` | Add team member | Yes |
| `PUT` | `/:id` | Update team member | Yes |
| `DELETE` | `/:id` | Delete team member | Yes |

### Careers / Jobs (`/careers`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all job vacancies | No |
| `POST` | `/` | Create a job vacancy | Yes |
| `DELETE` | `/:id` | Delete a job vacancy | Yes |

### Applicants (`/employees`)

Note: This module is used for job applications/applicants.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit job application, usually with `cv` upload | No |
| `GET` | `/` | Get all applications | Yes |

### Contact Inquiries (`/contact`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit contact form | No |
| `GET` | `/` | Get all inquiries | Yes |
| `GET` | `/stats` | Get inquiry statistics | Yes |

### Partner Requests (`/partner`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit partner request | No |
| `GET` | `/` | Get all partner requests | Yes |
| `GET` | `/stats` | Get partner statistics | Yes |
| `PUT` | `/:id` | Update partner request/status | Yes |

### Travel Packages (`/travel-packages`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get travel packages | No/depends on route logic |
| `POST` | `/` | Create travel package | Yes |
| `PUT` | `/:id` | Update travel package | Yes |
| `DELETE` | `/:id` | Delete travel package | Yes |

### Travel Inquiries (`/travel-inquiries`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit travel inquiry | No |
| `GET` | `/` | Get travel inquiries | Yes |

### Forms (`/forms`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get forms/pages | No/depends on route logic |
| `POST` | `/` | Create form/page definition | Yes |
| `PUT` | `/:id` | Update form/page definition | Yes |
| `DELETE` | `/:id` | Delete form/page definition | Yes |

### Documents (`/documents`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get document requirements | No |
| `POST` | `/` | Create document requirement | Yes |
| `PUT` | `/:id` | Update document requirement | Yes |
| `DELETE` | `/:id` | Delete document requirement | Yes |

### FAQs (`/faqs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get FAQs | No |
| `POST` | `/` | Create FAQ | Yes |
| `PUT` | `/:id` | Update FAQ | Yes |
| `DELETE` | `/:id` | Delete FAQ | Yes |

### Content Sections (`/content-sections`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get CMS content sections | No |
| `POST` | `/` | Create content section | Yes |
| `PUT` | `/:id` | Update content section | Yes |
| `DELETE` | `/:id` | Delete content section | Yes |

### Pricing Plans (`/pricing-plans`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get pricing plans | No |
| `POST` | `/` | Create pricing plan | Yes |
| `PUT` | `/:id` | Update pricing plan | Yes |
| `DELETE` | `/:id` | Delete pricing plan | Yes |

### Form Images (`/form-images`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get form image records | No/depends on route logic |
| `POST` | `/` | Create/upload form image | Yes |
| `PUT` | `/:id` | Update form image | Yes |
| `DELETE` | `/:id` | Delete form image | Yes |

### Form Employees Addresses (`/form-employees-addresses`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get employee address form records | Yes |
| `POST` | `/` | Create employee address record | Yes |
| `PUT` | `/:id` | Update employee address record | Yes |
| `DELETE` | `/:id` | Delete employee address record | Yes |

### Form Submissions (`/form-submissions`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get submitted forms | Yes |
| `GET` | `/stats` | Get submission statistics | Yes |
| `GET` | `/today` | Get today's submissions | Yes |
| `GET` | `/by-slug/:slug` | Get submissions by form slug | Yes |
| `GET` | `/:id` | Get a single submission | Yes |
| `POST` | `/slug/:slug` | Submit form data by public form slug | No |
| `PUT` | `/:id/status` | Update submission status | Yes |
| `DELETE` | `/:id` | Delete submission record | Yes |

### OTP (`/otp`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/send` | Send OTP to a mobile number | No |

## 11. Environment Variables

### Backend

Typical values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/dudigital
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Admin / Client

Typical frontend API variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 12. Summary

This codebase is a multi-app DU Digital platform with:

- a public website in `client/`
- an internal CMS/admin dashboard in `admin/`
- a TypeScript Express API in `backend/`
- MongoDB models for content, forms, users, media, offices, investor data, careers, and travel data
- file-based upload storage in `backend/uploads`

If needed, this document can be expanded further into:

- endpoint request/response examples
- per-model schema documentation
- ER-style database relationship notes
- deployment documentation
- environment setup steps
