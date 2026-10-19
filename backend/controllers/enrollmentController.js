const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll a student in a course
// @route   POST /enroll
// @access  Protected (Student / Authenticated User)
const enrollInCourse = async (req, res) => {
  try {
    const { courseId, course: bodyCourseId, studentId } = req.body;
    const targetCourseId = courseId || bodyCourseId;
    const targetStudentId = req.user ? req.user._id : studentId;

    if (!targetCourseId) {
      return res.status(400).json({ message: 'Please provide a valid courseId' });
    }

    if (!targetStudentId) {
      return res.status(401).json({ message: 'Please log in to enroll in a course' });
    }

    const course = await Course.findById(targetCourseId);
    if (!course) {
      return res.status(404).json({ message: 'Selected course does not exist' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: targetStudentId,
      course: targetCourseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: 'You are already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      student: targetStudentId,
      course: targetCourseId,
      progress: 0,
      completedLessons: [],
      status: 'active',
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .populate('student', 'name email');

    res.status(201).json({
      message: 'Enrolled in course successfully',
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Enrollment failed' });
  }
};

// @desc    Get logged-in student's enrolled courses
// @route   GET /my-courses
// @access  Protected
const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user ? req.user._id : req.query.studentId;
    if (!studentId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    // Filter out any orphaned enrollment if a course was deleted
    const validEnrollments = enrollments.filter((item) => item.course !== null);

    res.status(200).json(validEnrollments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not fetch enrolled courses' });
  }
};

// @desc    Update lesson progress on an enrollment
// @route   PUT /enroll/:id/progress
// @access  Protected
const updateEnrollmentProgress = async (req, res) => {
  try {
    const { progress, lessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    if (
      req.user &&
      enrollment.student.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }

    if (lessonId) {
      const idx = enrollment.completedLessons.indexOf(lessonId);
      if (idx === -1) {
        enrollment.completedLessons.push(lessonId);
      } else {
        enrollment.completedLessons.splice(idx, 1);
      }

      const totalLessons =
        enrollment.course && enrollment.course.lessons
          ? enrollment.course.lessons.length
          : 0;

      if (totalLessons > 0) {
        enrollment.progress = Math.round(
          (enrollment.completedLessons.length / totalLessons) * 100
        );
      }
    } else if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, Number(progress)));
    }

    enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active';
    await enrollment.save();

    const updated = await Enrollment.findById(enrollment._id).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email' },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not update progress' });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
  updateEnrollmentProgress,
};
