import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchMyCoursesApi,
  updateCourseProgressApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const { data } = await fetchMyCoursesApi();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load your enrolled courses.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const handleProgressChange = async (enrollmentId, newProgress) => {
    try {
      const { data } = await updateCourseProgressApi(enrollmentId, {
        progress: newProgress,
      });
      setEnrollments((prev) =>
        prev.map((item) => (item._id === enrollmentId ? data : item))
      );
    } catch (err) {
      setError('Could not update course progress.');
    }
  };

  const completedCount = enrollments.filter((e) => e.progress >= 100).length;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-primary mb-1">STUDENT PORTAL</span>
          <h2 className="fw-bold mb-0">Welcome, {user?.name}</h2>
          <p className="text-muted small mb-0">
            Track your enrolled courses and lesson completion progress
          </p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          + Browse More Courses
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">Enrolled Courses</span>
            <h3 className="fw-bold mb-0 mt-1">{enrollments.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">In Progress</span>
            <h3 className="fw-bold text-primary mb-0 mt-1">
              {enrollments.length - completedCount}
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span className="text-muted small">Completed Courses</span>
            <h3 className="fw-bold text-success mb-0 mt-1">{completedCount}</h3>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <h4 className="fw-bold mb-3">My Enrolled Courses</h4>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center">
          <h5 className="fw-bold">You haven&apos;t enrolled in any courses yet</h5>
          <p className="text-muted mb-3">
            Explore our catalog and enroll in a course to start learning.
          </p>
          <div>
            <Link to="/courses" className="btn btn-primary">
              Explore Course Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((item) => {
            const course = item.course;
            if (!course) return null;

            return (
              <div className="col-md-6" key={item._id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge-category">{course.category}</span>
                      <span
                        className={`badge ${
                          item.progress >= 100 ? 'bg-success' : 'bg-primary'
                        }`}
                      >
                        {item.progress >= 100 ? 'Completed' : 'Active'}
                      </span>
                    </div>

                    <h5 className="fw-bold mb-1">
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-dark text-decoration-none"
                      >
                        {course.title}
                      </Link>
                    </h5>
                    <p className="small text-muted mb-3">
                      Instructor:{' '}
                      {(course.instructor && course.instructor.name) ||
                        course.instructorName ||
                        'Course Instructor'}
                    </p>

                    <div className="mb-3 mt-auto">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Course Progress</span>
                        <span className="fw-bold">{item.progress}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className={`progress-bar ${
                            item.progress >= 100 ? 'bg-success' : 'bg-primary'
                          }`}
                          role="progressbar"
                          style={{ width: `${item.progress}%` }}
                          aria-valuenow={item.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="btn-group btn-group-sm">
                        {[25, 50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleProgressChange(item._id, pct)}
                            className={`btn ${
                              item.progress === pct
                                ? 'btn-dark'
                                : 'btn-outline-secondary'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Continue &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
