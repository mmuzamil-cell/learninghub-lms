const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get platform analytics for Admin dashboard
// @route   GET /admin/analytics
// @access  Protected (Admin)
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const enrollments = await Enrollment.find().populate('course', 'price category title');
    const estimatedRevenue = enrollments.reduce((sum, item) => {
      return sum + (item.course && item.course.price ? item.course.price : 0);
    }, 0);

    const courses = await Course.find();
    const categoryBreakdown = {};
    courses.forEach((c) => {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    });

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      estimatedRevenue,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not load analytics' });
  }
};

// @desc    Get all users
// @route   GET /admin/users
// @access  Protected (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
};

// @desc    Update a user's role
// @route   PUT /admin/users/:id/role
// @access  Protected (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not update user role' });
  }
};

// @desc    Delete a user
// @route   DELETE /admin/users/:id
// @access  Protected (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await Enrollment.deleteMany({ student: user._id });
    await user.deleteOne();

    res.status(200).json({ message: 'User removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete user' });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
