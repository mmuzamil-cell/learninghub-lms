import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')
        ? process.env.REACT_APP_API_URL
        : '')
    : (process.env.REACT_APP_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token from localStorage to outgoing requests
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('learnhub_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        localStorage.removeItem('learnhub_user');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const registerUserApi = (userData) => api.post('/register', userData);
export const loginUserApi = (credentials) => api.post('/login', credentials);
export const getProfileApi = () => api.get('/me');

// Course API calls
export const fetchCoursesApi = (params = {}) => api.get('/courses', { params });
export const fetchCourseByIdApi = (id) => api.get(`/courses/${id}`);
export const createCourseApi = (courseData) => api.post('/courses', courseData);
export const updateCourseApi = (id, courseData) => api.put(`/courses/${id}`, courseData);
export const deleteCourseApi = (id) => api.delete(`/courses/${id}`);
export const addCourseLessonApi = (id, lessonData) =>
  api.post(`/courses/${id}/lessons`, lessonData);

// Enrollment API calls
export const enrollCourseApi = (courseId) => api.post('/enroll', { courseId });
export const fetchMyCoursesApi = () => api.get('/my-courses');
export const updateCourseProgressApi = (enrollmentId, payload) =>
  api.put(`/enroll/${enrollmentId}/progress`, payload);

// Admin API calls
export const fetchAdminAnalyticsApi = () => api.get('/admin/analytics');
export const fetchAllUsersApi = () => api.get('/admin/users');
export const updateUserRoleApi = (userId, role) =>
  api.put(`/admin/users/${userId}/role`, { role });
export const deleteUserApi = (userId) => api.delete(`/admin/users/${userId}`);

export default api;
