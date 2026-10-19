const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  updateEnrollmentProgress,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);
router.put('/enroll/:id/progress', protect, updateEnrollmentProgress);

module.exports = router;
