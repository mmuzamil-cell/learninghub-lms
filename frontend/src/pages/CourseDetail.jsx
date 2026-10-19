import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchCourseByIdApi,
  enrollCourseApi,
  fetchMyCoursesApi,
  addCourseLessonApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollMessage, setEnrollMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Add lesson state for Instructor/Admin
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    duration: '25 mins',
  });
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const { data } = await fetchCourseByIdApi(id);
        setCourse(data);

        if (isAuthenticated) {
          try {
            const myRes = await fetchMyCoursesApi();
            const already = (myRes.data || []).some(
              (item) => item.course && item.course._id === id
            );
            setIsEnrolled(already);
          } catch (e) {
            // Ignore if not enrolled
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Course could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      setError('');
      setEnrollMessage('');
      await enrollCourseApi(id);
      setIsEnrolled(true);
      setEnrollMessage(
        'You have successfully enrolled! Visit your Student Dashboard to track progress.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not complete enrollment.'
      );
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.content) return;

    try {
      setAddingLesson(true);
      const { data } = await addCourseLessonApi(id, lessonForm);
      setCourse(data);
      setLessonForm({ title: '', content: '', duration: '25 mins' });
      setEnrollMessage('New lesson added to course curriculum.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson.');
    } finally {
      setAddingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Course not found'}</div>
        <Link to="/courses" className="btn btn-outline-primary">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  const canEditCourse =
    user &&
    (user.role === 'admin' ||
      (user.role === 'instructor' &&
        (!course.instructor ||
          course.instructor._id === user._id ||
          course.instructor === user._id)));

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/courses" className="text-decoration-none small">
          &larr; Back to Course Catalog
        </Link>
      </div>

      {enrollMessage && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{enrollMessage}</span>
          {user && user.role === 'student' && (
            <Link to="/dashboard/student" className="btn btn-sm btn-success">
              Open My Courses
            </Link>
          )}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {/* Main Course Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <img
              src={
                course.thumbnail ||
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
              }
              alt={course.title}
              className="w-100 rounded-top"
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
            <div className="card-body p-4">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge-category">{course.category}</span>
                <span className="badge bg-secondary">{course.level}</span>
                <span className="badge bg-light text-dark border">
                  Duration: {course.duration || '6 Weeks'}
                </span>
              </div>

              <h2 className="fw-bold mb-3">{course.title}</h2>
              <p className="text-secondary mb-4">{course.description}</p>

              <div className="d-flex flex-wrap gap-4 pt-3 border-top small text-muted">
                <div>
                  <strong>Instructor: </strong>
                  {(course.instructor && course.instructor.name) ||
                    course.instructorName ||
                    'Course Instructor'}
                </div>
                <div>
                  <strong>Lessons: </strong>
                  {course.lessons ? course.lessons.length : 0} Modules
                </div>
                {course.enrollmentCount !== undefined && (
                  <div>
                    <strong>Enrolled Students: </strong>
                    {course.enrollmentCount}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus / Lessons Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Course Curriculum &amp; Lessons</h4>

              {!course.lessons || course.lessons.length === 0 ? (
                <p className="text-muted mb-0">
                  No lessons have been uploaded for this course yet.
                </p>
              ) : (
                <div>
                  {course.lessons.map((lesson, idx) => (
                    <div className="lesson-item" key={lesson._id || idx}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0">
                          {lesson.title.startsWith(`${idx + 1}.`)
                            ? lesson.title
                            : `${idx + 1}. ${lesson.title}`}
                        </h6>
                        <span className="badge bg-light text-secondary border">
                          {lesson.duration || '20 mins'}
                        </span>
                      </div>
                      <p className="small text-muted mb-0">{lesson.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructor / Admin Add Lesson Form */}
              {canEditCourse && (
                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold mb-3">Add a New Lesson to This Course</h6>
                  <form onSubmit={handleAddLesson}>
                    <div className="row g-2">
                      <div className="col-md-8">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Lesson Title (e.g. Setting up Express Routes)"
                          value={lessonForm.title}
                          onChange={(e) =>
                            setLessonForm({ ...lessonForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Duration (e.g. 30 mins)"
                          value={lessonForm.duration}
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-12">
                        <textarea
                          rows="2"
                          className="form-control form-control-sm"
                          placeholder="Lesson summary or learning objectives..."
                          value={lessonForm.content}
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              content: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-12 text-end">
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                          disabled={addingLesson}
                        >
                          {addingLesson ? 'Uploading...' : '+ Upload Lesson'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment & Action Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '85px' }}>
            <div className="card-body p-4">
              <div className="mb-3">
                <span className="text-muted small d-block">Course Fee</span>
                <h3 className="fw-bold text-primary mb-0">
                  {Number(course.price) === 0
                    ? 'Free'
                    : `PKR ${Number(course.price).toLocaleString()}`}
                </h3>
              </div>

              <ul className="list-unstyled small text-secondary mb-4">
                <li className="mb-2">
                  &#10003; Full lifetime access to all course lessons
                </li>
                <li className="mb-2">
                  &#10003; Hands-on MERN projects &amp; source code
                </li>
                <li className="mb-2">
                  &#10003; Progress tracking on Student Dashboard
                </li>
              </ul>

              {isEnrolled ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-success" disabled>
                    &#10003; Already Enrolled
                  </button>
                  <Link
                    to="/dashboard/student"
                    className="btn btn-outline-primary"
                  >
                    Go to My Learning Dashboard
                  </Link>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary btn-lg"
                  >
                    {enrolling
                      ? 'Enrolling...'
                      : isAuthenticated
                      ? 'Enroll in Course'
                      : 'Login to Enroll'}
                  </button>
                </div>
              )}

              {canEditCourse && (
                <div className="mt-3 pt-3 border-top d-grid">
                  <Link
                    to={`/courses/edit/${course._id}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    Edit Course Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
