import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-dark py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="text-white fw-bold mb-1">LearnHub LMS</h5>
            <p className="small mb-0 text-secondary">
              Full-Stack MERN Learning Management System for Students and Instructors.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-inline-flex gap-3 small">
              <Link to="/" className="text-decoration-none text-light">
                Home
              </Link>
              <Link to="/courses" className="text-decoration-none text-light">
                Browse Courses
              </Link>
              <Link to="/login" className="text-decoration-none text-light">
                Login
              </Link>
              <Link to="/register" className="text-decoration-none text-light">
                Register
              </Link>
            </div>
            <p className="small text-secondary mb-0 mt-2">
              &copy; {new Date().getFullYear()} LearnHub LMS &bull; Developed by Muhammad Muzamil Ali
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
