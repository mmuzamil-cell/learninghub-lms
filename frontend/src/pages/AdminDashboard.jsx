import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminAnalyticsApi,
  fetchAllUsersApi,
  updateUserRoleApi,
  deleteUserApi,
  fetchCoursesApi,
  deleteCourseApi,
} from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, coursesRes] = await Promise.all([
        fetchAdminAnalyticsApi(),
        fetchAllUsersApi(),
        fetchCoursesApi(),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load administrator data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await updateUserRoleApi(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: data.role } : u))
      );
      setFeedback(`Updated role for ${data.name} to ${data.role}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setFeedback('User removed from platform.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and its enrollments?')) return;
    try {
      await deleteCourseApi(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setFeedback('Course deleted by administrator.');
    } catch (err) {
      setError('Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-dark mb-1">ADMINISTRATION</span>
          <h2 className="fw-bold mb-0">Platform Analytics &amp; Control Panel</h2>
          <p className="text-muted small mb-0">
            Welcome, <strong className="text-primary">{user?.name || 'Muhammad Muzamil Ali'}</strong> • Monitor system metrics, manage user permissions, and moderate courses
          </p>
        </div>
        <Link to="/courses/new" className="btn btn-primary">
          + Add Platform Course
        </Link>
      </div>

      {feedback && (
        <div className="alert alert-success alert-dismissible fade show">
          {feedback}
          <button
            type="button"
            className="btn-close"
            onClick={() => setFeedback('')}
          />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
          />
        </div>
      )}

      {/* Analytics Cards */}
      {analytics && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <span className="text-muted small">Total Users</span>
              <h3 className="fw-bold mb-1 mt-1">{analytics.totalUsers}</h3>
              <span className="small text-secondary">
                {analytics.totalStudents} Students &bull;{' '}
                {analytics.totalInstructors} Instructors
              </span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <span className="text-muted small">Active Courses</span>
              <h3 className="fw-bold text-primary mb-1 mt-1">
                {analytics.totalCourses}
              </h3>
              <span className="small text-secondary">Across all categories</span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <span className="text-muted small">Total Enrollments</span>
              <h3 className="fw-bold text-success mb-1 mt-1">
                {analytics.totalEnrollments}
              </h3>
              <span className="small text-secondary">Active student seats</span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <span className="text-muted small">Estimated Course Volume</span>
              <h3 className="fw-bold text-dark mb-1 mt-1">
                PKR {Number(analytics.estimatedRevenue || 0).toLocaleString()}
              </h3>
              <span className="small text-secondary">Cumulative enrollments</span>
            </div>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Registered Users ({users.length})</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge text-uppercase ${
                          u.role === 'admin'
                            ? 'bg-dark'
                            : u.role === 'instructor'
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ maxWidth: '160px' }}>
                      <select
                        className="form-select form-select-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Moderation Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">All Platform Courses ({courses.length})</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold">
                      <Link
                        to={`/courses/${c._id}`}
                        className="text-dark text-decoration-none"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td>
                      {(c.instructor && c.instructor.name) ||
                        c.instructorName ||
                        'Instructor'}
                    </td>
                    <td>{c.category}</td>
                    <td>PKR {Number(c.price).toLocaleString()}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/courses/edit/${c._id}`}
                          className="btn btn-outline-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(c._id)}
                          className="btn btn-outline-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
