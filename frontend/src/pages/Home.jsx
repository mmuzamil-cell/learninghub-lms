import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCoursesApi } from '../services/api';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await fetchCoursesApi();
        setFeaturedCourses(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        setError('Unable to connect to the backend server. Make sure the Express backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-primary mb-3 px-3 py-2">
                MERN Stack Learning Platform
              </span>
              <h1 className="display-5 fw-bold mb-3">
                Build Practical Tech Skills with Industry-Led Courses
              </h1>
              <p className="lead text-light opacity-75 mb-4">
                LearnHub connects students and instructors in one interactive workspace.
                Browse structured courses, track lesson completion, and manage curricula seamlessly.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/courses" className="btn btn-primary btn-lg px-4">
                  Explore Courses
                </Link>
                {!isAuthenticated ? (
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                    Join for Free
                  </Link>
                ) : (
                  <Link
                    to={
                      user.role === 'admin'
                        ? '/dashboard/admin'
                        : user.role === 'instructor'
                        ? '/dashboard/instructor'
                        : '/dashboard/student'
                    }
                    className="btn btn-outline-light btn-lg px-4"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>

            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="bg-white text-dark p-4 rounded-4 shadow">
                <h5 className="fw-bold mb-3">Role-Based Learning Portal</h5>
                <div className="mb-3 pb-3 border-bottom">
                  <strong className="text-primary d-block">For Students</strong>
                  <span className="small text-muted">
                    Browse courses by category, enroll with one click, and track lesson-by-lesson completion progress.
                  </span>
                </div>
                <div className="mb-3 pb-3 border-bottom">
                  <strong className="text-success d-block">For Instructors</strong>
                  <span className="small text-muted">
                    Publish new courses, update pricing and syllabus details, and upload structured course lessons.
                  </span>
                </div>
                <div>
                  <strong className="text-dark d-block">For Administrators</strong>
                  <span className="small text-muted">
                    Monitor enrollment metrics, manage user roles, and oversee all courses on the platform.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Courses</h2>
              <p className="text-muted mb-0">
                Explore top courses recently published by our instructors
              </p>
            </div>
            <Link to="/courses" className="btn btn-outline-primary">
              View All Courses
            </Link>
          </div>

          {error && <div className="alert alert-warning">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="alert alert-info">
              No courses found yet. Run <code>npm run seed</code> in the backend folder or add a new course!
            </div>
          ) : (
            <div className="row g-4">
              {featuredCourses.map((course) => (
                <div className="col-md-6 col-lg-4" key={course._id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
