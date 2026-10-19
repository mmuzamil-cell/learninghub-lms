import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUserByRole = (userObj) => {
    const fromPath = location.state?.from?.pathname;
    if (fromPath && fromPath !== '/login') {
      navigate(fromPath, { replace: true });
      return;
    }
    if (userObj.role === 'admin') navigate('/dashboard/admin');
    else if (userObj.role === 'instructor') navigate('/dashboard/instructor');
    else navigate('/dashboard/student');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      redirectUserByRole(loggedInUser);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please verify your credentials and ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (demoEmail) => {
    logout();
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    try {
      setLoading(true);
      const loggedInUser = await login(demoEmail, 'password123');
      redirectUserByRole(loggedInUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small mb-4">
                Sign in to your LearnHub account to access your dashboard
              </p>

              {isAuthenticated && user && (
                <div className="alert alert-info py-2 small mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    Currently signed in as: <strong>{user.name}</strong> ({user.role})
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm py-0 px-2 ms-2"
                    onClick={() => {
                      logout();
                      setEmail('');
                      setPassword('');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@learnhub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Quick Demo Credentials helper for easy testing */}
              <div className="mt-4 pt-3 border-top">
                <p className="small text-muted mb-2">
                  1-Click Instant Demo Login:
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    disabled={loading}
                    onClick={() => loginAsDemo('bilal@learnhub.com')}
                  >
                    Student (Bilal)
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    disabled={loading}
                    onClick={() => loginAsDemo('usman@learnhub.com')}
                  >
                    Instructor (Usman)
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={loading}
                    onClick={() => loginAsDemo('admin@learnhub.com')}
                  >
                    Admin (Muhammad Muzamil Ali)
                  </button>
                </div>
              </div>

              <p className="text-center small text-muted mt-4 mb-0">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="fw-semibold text-decoration-none">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
