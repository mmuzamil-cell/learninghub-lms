const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { getInitialUsers, getInitialCourses } = require('./seedData');

let memoryServer = null;

const ensureInitialData = async () => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount > 0) return;

    console.log('Empty database detected. Inserting initial sample data...');
    await Enrollment.deleteMany();
    await User.deleteMany();

    const users = await User.create(getInitialUsers());
    const instructor1 = users.find((u) => u.email === 'usman@learnhub.com');
    const instructor2 = users.find((u) => u.email === 'ayesha@learnhub.com');
    const student1 = users.find((u) => u.email === 'bilal@learnhub.com');
    const student2 = users.find((u) => u.email === 'fatima@learnhub.com');

    const courses = await Course.insertMany(
      getInitialCourses(instructor1, instructor2)
    );

    await Enrollment.create([
      {
        student: student1._id,
        course: courses[0]._id,
        progress: 50,
        completedLessons: [
          courses[0].lessons[0]._id.toString(),
          courses[0].lessons[1]._id.toString(),
        ],
        status: 'active',
      },
      {
        student: student1._id,
        course: courses[1]._id,
        progress: 100,
        completedLessons: courses[1].lessons.map((l) => l._id.toString()),
        status: 'completed',
      },
      {
        student: student2._id,
        course: courses[0]._id,
        progress: 25,
        completedLessons: [courses[0].lessons[0]._id.toString()],
        status: 'active',
      },
    ]);

    console.log('Sample courses and demo accounts initialized.');
  } catch (err) {
    console.warn('Auto-seed skipped:', err.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnhub';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await ensureInitialData();
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting In-Memory MongoDB Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      await ensureInitialData();
    } catch (memErr) {
      console.error(`Database connection error: ${memErr.message}`);
      console.warn('Server continuing to run. Please verify MONGO_URI credentials.');
    }
  }
};

module.exports = connectDB;
