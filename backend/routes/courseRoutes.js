const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
} = require('../controllers/courseController');
const { optionalCourseAuth } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(optionalCourseAuth, createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put(optionalCourseAuth, updateCourse)
  .delete(optionalCourseAuth, deleteCourse);

router.post('/:id/lessons', optionalCourseAuth, addLesson);

module.exports = router;
