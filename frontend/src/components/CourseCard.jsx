import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onDelete, canManage }) => {
  const instructorLabel =
    (course.instructor && course.instructor.name) ||
    course.instructorName ||
    'Course Instructor';

  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;

  return (
    <div className="course-card h-100 d-flex flex-column">
      <img
        src={
          course.thumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
        }
        alt={course.title}
        className="course-card-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
        }}
      />
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge-category">{course.category}</span>
          <span className="badge bg-light text-dark border">
            {course.level || 'Beginner'}
          </span>
        </div>

        <h5 className="fw-bold mb-2">
          <Link
            to={`/courses/${course._id}`}
            className="text-dark text-decoration-none"
          >
            {course.title}
          </Link>
        </h5>

        <p className="text-muted small mb-3 flex-grow-1">
          {course.description && course.description.length > 110
            ? `${course.description.substring(0, 110)}...`
            : course.description}
        </p>

        <div className="small text-secondary mb-3 d-flex justify-content-between">
          <span>By {instructorLabel}</span>
          <span>{lessonCount} Lessons</span>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
          <span className="fw-bold text-primary fs-5">
            {Number(course.price) === 0
              ? 'Free'
              : `PKR ${Number(course.price).toLocaleString()}`}
          </span>

          <div className="d-flex gap-2">
            <Link
              to={`/courses/${course._id}`}
              className="btn btn-outline-primary btn-sm"
            >
              View Details
            </Link>
            {canManage && (
              <>
                <Link
                  to={`/courses/edit/${course._id}`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Edit
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(course._id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
