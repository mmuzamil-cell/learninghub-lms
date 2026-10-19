import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCoursesApi, deleteCourseApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadInstructorCourses = async () => {
    try {
      setLoading(true);
      const { data } = await fetchCoursesApi();
      const allCourses = Array.isArray(data) ? data : [];
      const mine = allCourses.filter(
        (c) =>
          (c.instructor &&
            (c.instructor._id === user?._id || c.instructor === user?._id)) ||
          c.instructorName === user?.name
      );
      setCourses(mine.length > 0 ? mine : allCourses);
    } catch (err) {
      setError('Could not load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructorCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await deleteCourseApi(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setMessage('Course deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete course.');
    }
  };

  const totalLessons = courses.reduce(
    (sum, c) => sum + (Array.isArray(c.lessons) ? c.lessons.length : 0),
    0
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-success mb-1">INSTRUCTOR STUDIO</span>
          <h2 className="fw-bold mb-0">Instructor Dashboard</h2>
          <p className="text-muted small mb-0">
            Create courses, manage pricing, and upload lesson modules
          </p>
        </div>
        <Link to="/courses/new" className="btn btn-primary">
          + Create New Course
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">Managed Courses</span>
            <h3 className="fw-bold mb-0 mt-1">{courses.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">Total Lessons Published</span>
            <h3 className="fw-bold text-primary mb-0 mt-1">{totalLessons}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">Instructor Profile</span>
            <h5 className="fw-bold text-success mb-0 mt-2">{user?.name}</h5>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Your Courses</h5>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-muted mb-0">
              No courses published yet. Click &quot;Create New Course&quot; to get started.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Lessons</th>
                    <th>Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <Link
                          to={`/courses/${course._id}`}
                          className="fw-semibold text-dark text-decoration-none"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td>
                        <span className="badge-category">{course.category}</span>
                      </td>
                      <td>{course.level || 'Beginner'}</td>
                      <td>{course.lessons ? course.lessons.length : 0}</td>
                      <td className="fw-semibold">
                        PKR {Number(course.price).toLocaleString()}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/courses/${course._id}`}
                            className="btn btn-outline-primary"
                          >
                            Lessons
                          </Link>
                          <Link
                            to={`/courses/edit/${course._id}`}
                            className="btn btn-outline-secondary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(course._id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
