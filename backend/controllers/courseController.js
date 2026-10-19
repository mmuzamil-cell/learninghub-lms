const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses (with optional category & search filter)
// @route   GET /courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, search, instructor } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (instructor) {
      filter.instructor = instructor;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { instructorName: regex },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch courses' });
  }
};

// @desc    Get single course by ID
// @route   GET /courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name email bio'
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollmentCount = await Enrollment.countDocuments({ course: course._id });

    res.status(200).json({
      ...course.toObject(),
      enrollmentCount,
    });
  } catch (error) {
    res.status(404).json({ message: 'Course not found or invalid course ID' });
  }
};

// @desc    Create a new course
// @route   POST /courses
// @access  Instructor / Admin (also supports direct Postman testing for Q1)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      instructor,
      instructorName,
      level,
      duration,
      thumbnail,
      lessons,
    } = req.body;

    if (!title || !description || !category || price === undefined || price === '') {
      return res.status(400).json({
        message: 'Please provide title, description, category, and price',
      });
    }

    let instructorId = req.user ? req.user._id : instructor;
    let resolvedInstructorName = req.user ? req.user.name : instructorName;

    if (!instructorId) {
      const fallbackInstructor = await User.findOne({
        role: { $in: ['instructor', 'admin'] },
      });
      if (fallbackInstructor) {
        instructorId = fallbackInstructor._id;
        resolvedInstructorName = resolvedInstructorName || fallbackInstructor.name;
      }
    } else if (!resolvedInstructorName) {
      const foundUser = await User.findById(instructorId);
      if (foundUser) {
        resolvedInstructorName = foundUser.name;
      }
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      instructor: instructorId || undefined,
      instructorName: resolvedInstructorName || 'Course Instructor',
      level: level || 'Beginner',
      duration: duration || '6 Weeks',
      thumbnail:
        thumbnail && thumbnail.trim() !== ''
          ? thumbnail.trim()
          : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      lessons: Array.isArray(lessons) ? lessons : [],
    });

    const populated = await Course.findById(course._id).populate(
      'instructor',
      'name email role'
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not create course' });
  }
};

// @desc    Update an existing course
// @route   PUT /courses/:id
// @access  Instructor / Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If user is an instructor (not admin), verify ownership when instructor field exists
    if (
      req.user &&
      req.user.role === 'instructor' &&
      course.instructor &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'You can only edit courses that you created',
      });
    }

    const fields = [
      'title',
      'description',
      'category',
      'price',
      'level',
      'duration',
      'thumbnail',
      'instructorName',
      'lessons',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = field === 'price' ? Number(req.body[field]) : req.body[field];
      }
    });

    const updatedCourse = await course.save();
    const populated = await Course.findById(updatedCourse._id).populate(
      'instructor',
      'name email role'
    );

    res.status(200).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update course' });
  }
};

// @desc    Delete a course
// @route   DELETE /courses/:id
// @access  Instructor / Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (
      req.user &&
      req.user.role === 'instructor' &&
      course.instructor &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'You can only delete courses that you created',
      });
    }

    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.status(200).json({ message: 'Course deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete course' });
  }
};

// @desc    Add a lesson to a course
// @route   POST /courses/:id/lessons
// @access  Instructor / Admin
const addLesson = async (req, res) => {
  try {
    const { title, content, duration, videoUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Lesson title and content are required' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.lessons.push({
      title: title.trim(),
      content: content.trim(),
      duration: duration || '20 mins',
      videoUrl: videoUrl || '',
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add lesson' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
};
