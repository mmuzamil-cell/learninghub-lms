import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CourseListing from '../pages/CourseListing';
import CourseDetail from '../pages/CourseDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CourseForm from '../pages/CourseForm';
import StudentDashboard from '../pages/StudentDashboard';
import InstructorDashboard from '../pages/InstructorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<CourseListing />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Instructor & Admin Course Management Routes */}
      <Route
        path="/courses/new"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseForm />
          </ProtectedRoute>
        }
      />

      {/* Role-Based Protected Dashboards */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/instructor"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
