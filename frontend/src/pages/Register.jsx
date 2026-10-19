import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const newUser = await register(formData);
      if (newUser.role === 'admin') navigate('/dashboard/admin');
      else if (newUser.role === 'instructor') navigate('/dashboard/instructor');
      else navigate('/dashboard/student');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold mb-1">Create an Account</h3>
              <p className="text-muted small mb-4">
                Join LearnHub as a Student, Instructor, or Administrator
              </p>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Hamza Raza"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="hamza@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Select Account Role *
                  </label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student (Browse &amp; Enroll in Courses)</option>
                    <option value="instructor">Instructor (Create &amp; Manage Courses)</option>
                    <option value="admin">Admin (Manage Users &amp; Analytics)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">
                    Short Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    rows="2"
                    className="form-control"
                    placeholder="Tell us about your learning or teaching goals..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>

              <p className="text-center small text-muted mt-4 mb-0">
                Already registered?{' '}
                <Link to="/login" className="fw-semibold text-decoration-none">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
