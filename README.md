# LearnHub - MERN Stack Learning Management System

LearnHub is a full-stack Learning Management System built with MongoDB, Express.js, React.js, and Node.js. It allows students to browse and enroll in courses, instructors to create and manage course curricula and lessons, and administrators to oversee users, courses, and platform analytics.

## Features

- **Course Catalog & Search**: Browse courses by category, search by keyword, and view detailed syllabus breakdowns.
- **Role-Based Access Control (RBAC)**:
  - **Student**: Browse catalog, enroll in courses, track lesson completion and course progress on the Student Dashboard.
  - **Instructor**: Create, update, and delete courses, and add video/reading lessons from the Instructor Dashboard.
  - **Admin**: View platform statistics (users, enrollments, revenue), manage user roles, and moderate all courses from the Admin Dashboard.
- **JWT Authentication & Security**: Password hashing with `bcryptjs` and stateless session authentication using JSON Web Tokens (`jsonwebtoken`).
- **RESTful API Architecture**: Clean separation of concerns across Mongoose models, Express controllers, middleware, and routes.
- **Responsive UI**: Styled with Bootstrap 5 and custom CSS for a clean layout across desktop and mobile devices.

## Project Structure

```text
LearnHub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── adminController.js    # User management & platform analytics
│   │   ├── authController.js     # Register, login, current user profile
│   │   ├── courseController.js   # Course CRUD & lesson management
│   │   └── enrollmentController.js # Student enrollment & progress tracking
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # Centralized error handling
│   ├── models/
│   │   ├── Course.js             # Course & embedded lessons schema
│   │   ├── Enrollment.js         # Student-Course enrollment & progress schema
│   │   └── User.js               # User schema with bcrypt pre-save hook
│   ├── routes/
│   │   ├── adminRoutes.js        # /admin endpoints
│   │   ├── authRoutes.js         # /register, /login, /me endpoints
│   │   ├── courseRoutes.js       # /courses CRUD endpoints
│   │   └── enrollmentRoutes.js   # /enroll, /my-courses endpoints
│   ├── .env                      # Default local environment variables
│   ├── .env.example              # Sample environment configuration
│   ├── package.json              # Backend dependencies and scripts
│   ├── seed.js                   # Sample database seeder script
│   └── server.js                 # Express app entry point
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template with Bootstrap 5
│   ├── src/
│   │   ├── components/
│   │   │   ├── CourseCard.jsx    # Reusable course preview card
│   │   │   ├── Footer.jsx        # Site footer
│   │   │   ├── Navbar.jsx        # Role-aware top navigation bar
│   │   │   └── ProtectedRoute.jsx # Role and auth route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & localStorage sync
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx      # Admin analytics, user & course table
│   │   │   ├── CourseDetail.jsx        # Single course view, syllabus & enroll
│   │   │   ├── CourseForm.jsx          # Add / Edit course & lessons page
│   │   │   ├── CourseListing.jsx       # Filterable course catalog + quick add
│   │   │   ├── Home.jsx                # Landing page with featured courses
│   │   │   ├── InstructorDashboard.jsx # Instructor course & lesson manager
│   │   │   ├── Login.jsx               # Sign-in page with demo role buttons
│   │   │   ├── Register.jsx            # Account registration page
│   │   │   └── StudentDashboard.jsx    # Enrolled courses & progress tracker
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # React Router v6 route definitions
│   │   ├── services/
│   │   │   └── api.js            # Axios instance & API helper functions
│   │   ├── App.css               # Custom theme styling
│   │   ├── App.jsx               # Root React component
│   │   └── index.js              # React DOM entry point
│   └── package.json              # Frontend dependencies and scripts
├── POSTMAN_COLLECTION.json       # Ready-to-import Postman collection for API testing
└── package.json                  # Root helper scripts
```

## Technologies Used

- **Frontend**: React 18, React Router DOM v6, Axios, Bootstrap 5, React-Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: JSON Web Token (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors`

## Installation & Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017/learnhub` (or a MongoDB Atlas connection URI)

### 1. Configure Backend Environment

A default `.env` file is already included in `backend/.env` for local development:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnhub
JWT_SECRET=learnhub_batch3_jwt_secret_key_2026
NODE_ENV=development
```

If you are using MongoDB Atlas, replace `MONGO_URI` in `backend/.env` with your Atlas connection string.

### 2. Install Dependencies & Seed Database (Backend)

Open a terminal in the project root and run:

```bash
cd backend
npm install
npm run seed
npm run dev
```

- `npm run seed` populates the database with sample Admin, Instructor, and Student accounts, 6 realistic courses with lessons, and initial enrollments.
- The backend server runs on `http://localhost:5000`.

### 3. Install Dependencies & Start React App (Frontend)

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
npm start
```

- The React application will open in your browser at `http://localhost:3000`.

## Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | **Muhammad Muzamil Ali** | `admin@learnhub.com` | `password123` |
| **Instructor** | Usman Tariq | `usman@learnhub.com` | `password123` |
| **Instructor** | Ayesha Siddiqui | `ayesha@learnhub.com` | `password123` |
| **Student** | Bilal Ahmed | `bilal@learnhub.com` | `password123` |
| **Student** | Fatima Noor | `fatima@learnhub.com` | `password123` |

## REST API Endpoints Summary

All endpoints are accessible both at the root path (e.g. `/courses`) and under `/api` (e.g. `/api/courses`).

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user (`student`, `instructor`, or `admin`) |
| `POST` | `/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/me` | Protected | Get logged-in user details |
| `GET` | `/courses` | Public | Get all courses (supports `?category=` and `?search=`) |
| `GET` | `/courses/:id` | Public | Get single course details with lessons |
| `POST` | `/courses` | Instructor / Admin | Create a new course |
| `PUT` | `/courses/:id` | Instructor / Admin | Update an existing course |
| `DELETE` | `/courses/:id` | Instructor / Admin | Delete a course |
| `POST` | `/courses/:id/lessons` | Instructor / Admin | Add a lesson to a course |
| `POST` | `/enroll` | Student (Protected) | Enroll logged-in student in a course |
| `GET` | `/my-courses` | Student (Protected) | Get logged-in student's enrolled courses |
| `PUT` | `/enroll/:id/progress` | Student (Protected) | Update course completion progress percentage |
| `GET` | `/admin/analytics` | Admin | View platform counts and revenue metrics |
| `GET` | `/admin/users` | Admin | List all registered users |
| `DELETE` | `/admin/users/:id` | Admin | Remove a user account |

## Deployment Preparation

To build the React frontend for production:

```bash
cd frontend
npm run build
```

When `NODE_ENV=production` is set in `backend/.env`, `backend/server.js` automatically serves the compiled static build from `frontend/build`.
