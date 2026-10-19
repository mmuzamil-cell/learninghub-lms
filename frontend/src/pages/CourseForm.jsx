import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createCourseApi,
  fetchCourseByIdApi,
  updateCourseApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: '',
    level: 'Beginner',
    duration: '6 Weeks',
    thumbnail: '',
    lessons: [
      {
        title: '1. Course Introduction & Setup',
        content: 'Overview of course syllabus, tools, and project goals.',
        duration: '20 mins',
      },
    ],
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    const loadCourse = async () => {
      try {
        const { data } = await fetchCourseByIdApi(id);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Web Development',
          price: data.price !== undefined ? data.price : '',
          level: data.level || 'Beginner',
          duration: data.duration || '6 Weeks',
          thumbnail: data.thumbnail || '',
          lessons: Array.isArray(data.lessons) ? data.lessons : [],
        });
      } catch (err) {
        setError('Could not load course details for editing.');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, isEditMode]);

  const handleLessonChange = (index, field, value) => {
    const updated = [...formData.lessons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, lessons: updated });
  };

  const addLessonField = () => {
    setFormData({
      ...formData,
      lessons: [
        ...formData.lessons,
        {
          title: `${formData.lessons.length + 1}. New Lesson`,
          content: '',
          duration: '30 mins',
        },
      ],
    });
  };

  const removeLessonField = (index) => {
    const updated = formData.lessons.filter((_, idx) => idx !== index);
    setFormData({ ...formData, lessons: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        instructorName: user ? user.name : 'Course Instructor',
      };

      if (isEditMode) {
        await updateCourseApi(id, payload);
      } else {
        await createCourseApi(payload);
      }

      if (user?.role === 'admin') navigate('/dashboard/admin');
      else navigate('/dashboard/instructor');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save course changes.'
      );
    } finally {
      setSaving(false);
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
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold mb-0">
              {isEditMode ? 'Edit Course & Curriculum' : 'Create New Course'}
            </h3>
            <Link to="/courses" className="btn btn-outline-secondary btn-sm">
              Cancel
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-semibold">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">
                      Category *
                    </label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Backend Engineering">Backend Engineering</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">
                      Difficulty Level
                    </label>
                    <select
                      className="form-select"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 6 Weeks"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Thumbnail Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.thumbnail}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Detailed Course Description *
                    </label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Lessons Builder */}
                <hr className="my-4" />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Course Lessons</h5>
                  <button
                    type="button"
                    onClick={addLessonField}
                    className="btn btn-outline-primary btn-sm"
                  >
                    + Add Lesson Module
                  </button>
                </div>

                {formData.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="p-3 mb-3 bg-light rounded border"
                  >
                    <div className="row g-2">
                      <div className="col-md-7">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Lesson Title"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(index, 'title', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Duration (e.g. 30 mins)"
                          value={lesson.duration}
                          onChange={(e) =>
                            handleLessonChange(index, 'duration', e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          type="button"
                          onClick={() => removeLessonField(index)}
                          className="btn btn-outline-danger btn-sm w-100"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Lesson description or key topics covered"
                          value={lesson.content}
                          onChange={(e) =>
                            handleLessonChange(index, 'content', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving Course...'
                      : isEditMode
                      ? 'Update Course'
                      : 'Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
