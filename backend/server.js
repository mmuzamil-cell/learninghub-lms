const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(200).json({
    status: 'ok',
    service: 'LearnHub MERN LMS Backend',
    database: dbStatusMap[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Mount primary API routes at root (/register, /login, /courses, /enroll, /my-courses)
app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/', enrollmentRoutes);
app.use('/admin', adminRoutes);

// Also mount under /api prefix for compatibility with standard API clients
app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'LearnHub LMS API Server is running',
      endpoints: {
        auth: ['POST /register', 'POST /login', 'GET /me'],
        courses: [
          'GET /courses',
          'GET /courses/:id',
          'POST /courses',
          'PUT /courses/:id',
          'DELETE /courses/:id',
        ],
        enrollments: ['POST /enroll', 'GET /my-courses', 'PUT /enroll/:id/progress'],
        admin: ['GET /admin/analytics', 'GET /admin/users'],
      },
    });
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LearnHub Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
