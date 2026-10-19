const getInitialUsers = () => [
  {
    name: 'Muhammad Muzamil Ali',
    email: 'admin@learnhub.com',
    password: 'password123',
    role: 'admin',
    bio: 'Platform Administrator & Lead System Architect at LearnHub',
  },
  {
    name: 'Usman Tariq',
    email: 'usman@learnhub.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Senior Full-Stack Engineer specializing in Node.js, React, and cloud architecture.',
  },
  {
    name: 'Ayesha Siddiqui',
    email: 'ayesha@learnhub.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Product Designer and Data Science educator with 7+ years of industry experience.',
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal@learnhub.com',
    password: 'password123',
    role: 'student',
    bio: 'Computer Science undergraduate learning full-stack web development.',
  },
  {
    name: 'Fatima Zahra',
    email: 'fatima@learnhub.com',
    password: 'password123',
    role: 'student',
    bio: 'Aspiring software engineer building modern web applications.',
  },
];

const getInitialCourses = (instructor1, instructor2) => [
  {
    title: 'Mastering MERN Stack Web Development',
    description:
      'Build and deploy full-stack web applications from scratch using MongoDB, Express.js, React 18, and Node.js. Covers RESTful APIs, JWT authentication, Mongoose data modeling, and responsive UI design.',
    instructor: instructor1._id,
    instructorName: instructor1.name,
    category: 'Web Development',
    price: 4500,
    level: 'Intermediate',
    duration: '8 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. Project Setup & Node/Express Fundamentals',
        content: 'Setting up an Express server, routing, middleware, and environment configuration.',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
      },
      {
        title: '2. MongoDB & Mongoose Schema Design',
        content: 'Creating schemas, model relationships, validation, and CRUD operations with Mongoose.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE',
      },
      {
        title: '3. React Hooks, Context API & Axios Integration',
        content: 'Building reusable components, managing state with useState/useEffect, and fetching API data.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
      },
      {
        title: '4. JWT Authentication & Role-Based Protected Routes',
        content: 'Securing endpoints with JSON Web Tokens, bcrypt password hashing, and React route guards.',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
      },
    ],
  },
  {
    title: 'Modern JavaScript (ES6+) & Asynchronous Programming',
    description:
      'Deep dive into modern JavaScript syntax, closures, promises, async/await, DOM manipulation, and clean modular code before moving into frontend frameworks.',
    instructor: instructor1._id,
    instructorName: instructor1.name,
    category: 'Web Development',
    price: 2800,
    level: 'Beginner',
    duration: '5 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. Let, Const, Arrow Functions & Destructuring',
        content: 'Understanding block scope, template literals, spread/rest operators, and object destructuring.',
        duration: '30 mins',
        videoUrl: '',
      },
      {
        title: '2. Array Methods: map, filter, reduce',
        content: 'Writing declarative data transformations for React rendering and API processing.',
        duration: '35 mins',
        videoUrl: '',
      },
      {
        title: '3. Promises, Fetch API & Async/Await',
        content: 'Handling asynchronous network calls and error handling with try/catch blocks.',
        duration: '40 mins',
        videoUrl: '',
      },
    ],
  },
  {
    title: 'UI/UX Design Systems with Figma & Bootstrap 5',
    description:
      'Learn how to design accessible user interfaces, wireframes, responsive grids, and interactive prototypes that translate cleanly into React components.',
    instructor: instructor2._id,
    instructorName: instructor2.name,
    category: 'Design',
    price: 3200,
    level: 'Beginner',
    duration: '6 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. Visual Hierarchy, Spacing & Typography',
        content: 'Establishing readable type scales, contrast ratios, and consistent spacing tokens.',
        duration: '25 mins',
        videoUrl: '',
      },
      {
        title: '2. Responsive Grid Layouts in Bootstrap 5',
        content: 'Using containers, rows, breakpoints, and utility classes for mobile-first pages.',
        duration: '40 mins',
        videoUrl: '',
      },
    ],
  },
  {
    title: 'REST API Architecture & Backend Security with Node.js',
    description:
      'Design scalable backend services with Express, custom middleware, input sanitization, rate limiting, JWT authentication, and MongoDB aggregation pipelines.',
    instructor: instructor1._id,
    instructorName: instructor1.name,
    category: 'Backend Engineering',
    price: 4000,
    level: 'Advanced',
    duration: '6 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. MVC Pattern in Express Applications',
        content: 'Structuring routes, controllers, services, and database models for maintainability.',
        duration: '35 mins',
        videoUrl: '',
      },
      {
        title: '2. Authentication vs Authorization Middleware',
        content: 'Implementing role-based access control for Admin, Instructor, and Student personas.',
        duration: '45 mins',
        videoUrl: '',
      },
    ],
  },
  {
    title: 'Python for Data Analysis & Machine Learning Basics',
    description:
      'Practical introduction to NumPy, Pandas, data cleaning, exploratory visualization, and building supervised learning models with scikit-learn.',
    instructor: instructor2._id,
    instructorName: instructor2.name,
    category: 'Data Science',
    price: 5000,
    level: 'Intermediate',
    duration: '8 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. Dataframes & Series with Pandas',
        content: 'Loading CSV datasets, filtering rows, handling missing values, and group-by aggregations.',
        duration: '40 mins',
        videoUrl: '',
      },
      {
        title: '2. Regression & Classification Models',
        content: 'Training, splitting, and evaluating baseline machine learning models.',
        duration: '50 mins',
        videoUrl: '',
      },
    ],
  },
  {
    title: 'Git, GitHub & Full-Stack Cloud Deployment',
    description:
      'Master version control workflows, pull requests, environment variable management, and deploying MERN stack applications to production.',
    instructor: instructor2._id,
    instructorName: instructor2.name,
    category: 'DevOps',
    price: 2200,
    level: 'Beginner',
    duration: '4 Weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    lessons: [
      {
        title: '1. Branching, Merging & Resolving Conflicts',
        content: 'Collaborating cleanly on feature branches and maintaining a readable commit history.',
        duration: '30 mins',
        videoUrl: '',
      },
      {
        title: '2. Preparing React & Node Apps for Production',
        content: 'Building static assets, configuring CORS and .env variables, and health verification.',
        duration: '35 mins',
        videoUrl: '',
      },
    ],
  },
];

module.exports = {
  getInitialUsers,
  getInitialCourses,
};
