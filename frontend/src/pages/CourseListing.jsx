import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchCoursesApi,
  createCourseApi,
  deleteCourseApi,
} from '../services/api';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'Web Development',
  'Backend Engineering',
  'Data Science',
  'Design',
  'DevOps',
];

const CourseListing = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Add Course Drawer/Form state for adding courses directly from the catalog
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Web Development',
    price: '',
    level: 'Beginner',
    duration: '6 Weeks',
    instructorName: user ? user.name : '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim() !== '') params.search = searchQuery.trim();

      const { data } = await fetchCoursesApi(params);
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch courses from server. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');

    if (!newCourse.title || !newCourse.description || newCourse.price === '') {
      setError('Please fill in course title, price, and description.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...newCourse,
        price: Number(newCourse.price),
        instructorName:
          (user && user.name) || newCourse.instructorName || 'Course Instructor',
      };
      const { data } = await createCourseApi(payload);
      setCourses((prev) => [data, ...prev]);
      setFeedback(`Course "${data.title}" added and synced with MongoDB!`);
      setNewCourse({
        title: '',
        category: 'Web Development',
        price: '',
        level: 'Beginner',
        duration: '6 Weeks',
        instructorName: user ? user.name : '',
        description: '',
      });
      setShowQuickAdd(false);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not create course. Check permissions.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourseApi(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setFeedback('Course removed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const canCreateOrManage =
    !isAuthenticated || (user && (user.role === 'instructor' || user.role === 'admin'));

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Course Catalog</h2>
          <p className="text-muted mb-0">
            Browse available courses or filter by topic and skill level
          </p>
        </div>

        <div className="d-flex gap-2">
          {canCreateOrManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowQuickAdd((prev) => !prev)}
            >
              {showQuickAdd ? 'Close Form' : '+ Quick Add Course'}
            </button>
          )}
          {isAuthenticated &&
            (user.role === 'instructor' || user.role === 'admin') && (
              <Link to="/courses/new" className="btn btn-outline-dark">
                Full Course Editor
              </Link>
            )}
        </div>
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

      {/* Quick Add Course Form (Demonstrates live Frontend -> Backend -> State update) */}
      {showQuickAdd && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Add a New Course</h5>
            <form onSubmit={handleQuickAddSubmit}>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label small fw-semibold">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Full-Stack Next.js Bootcamp"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    value={newCourse.category}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label small fw-semibold">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="3500"
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Level</label>
                  <select
                    className="form-select"
                    value={newCourse.level}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-semibold">
                    Description *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief overview of what students will learn in this course..."
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Usman Tariq"
                    value={newCourse.instructorName}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        instructorName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowQuickAdd(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`btn btn-sm ${
                      selectedCategory === category
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search courses by title or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-dark btn-sm px-3">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <h5 className="fw-bold">No matching courses found</h5>
          <p className="text-muted mb-3">
            Try clearing your search filters or add a new course above.
          </p>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => {
            const isOwnerOrAdmin =
              user &&
              (user.role === 'admin' ||
                (user.role === 'instructor' &&
                  (!course.instructor ||
                    course.instructor._id === user._id ||
                    course.instructor === user._id)));

            return (
              <div className="col-md-6 col-lg-4" key={course._id}>
                <CourseCard
                  course={course}
                  canManage={isOwnerOrAdmin}
                  onDelete={handleDeleteCourse}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseListing;
