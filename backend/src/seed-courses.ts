import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from './models/Course';
import User from './models/User';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedCourses = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses.');

    // 2. Find or create an instructor
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Seed Instructor',
        email: 'instructor@seed.com',
        password: 'password123',
        role: 'instructor'
      });
      console.log('Created seed instructor.');
    } else {
      console.log('Found existing instructor.');
    }

    // 3. Define dummy courses
    const coursesToInsert = [
      {
        title: 'Mastering React 18: Build Pro Web Apps',
        description: 'Dive deep into React 18, React Router v6, Redux Toolkit, and context API. Learn to build fast, interactive, and scaleable frontend applications.',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['React 18 fundamentals', 'Hooks in-depth', 'State management', 'React Router'],
        instructor: instructor._id,
        lessons: [
          { title: 'Introduction to React', videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
          { title: 'Components and Props', videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8' }
        ]
      },
      {
        title: 'Complete Node.js Developer in 2024',
        description: 'Learn Node.js by building real-world applications with Express, MongoDB, Mongoose, and more. Become a backend engineering expert.',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Node.js fundamentals', 'Express REST APIs', 'MongoDB', 'Authentication'],
        instructor: instructor._id,
        lessons: [
          { title: 'Node.js basics', videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' }
        ]
      },
      {
        title: 'UI/UX Design Masterclass: From Beginner to Pro',
        description: 'Learn Figma, UI principles, UX research, wireframing, and prototyping. Design stunning interfaces that users love.',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Figma mastery', 'Color theory', 'Typography', 'Prototyping'],
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to Design', videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' }
        ]
      },
      {
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn Python, NumPy, Pandas, Matplotlib, Seaborn, and Scikit-Learn. Build machine learning models and analyze complex datasets.',
        category: 'Data Science',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Python basics', 'Data Analysis with Pandas', 'Machine Learning', 'Data Visualization'],
        instructor: instructor._id,
        lessons: [
          { title: 'Python Basics', videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' }
        ]
      },
      {
        title: 'Digital Marketing Strategies 2024',
        description: 'Grow your business online with SEO, Social Media Marketing, Email Marketing, and Facebook Ads. Comprehensive marketing guide.',
        category: 'Marketing',
        imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['SEO', 'Social Media Marketing', 'Google Ads', 'Content Strategy'],
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to SEO', videoUrl: 'https://www.youtube.com/watch?v=hF515-0TsyM' }
        ]
      },
      {
        title: 'Advanced CSS and Sass',
        description: 'Build complex, responsive layouts with CSS Grid, Flexbox, and Sass. Create beautiful animations and modern web designs.',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['CSS Grid', 'Flexbox', 'Sass basics', 'Responsive Design'],
        instructor: instructor._id,
        lessons: [
          { title: 'CSS Grid Basics', videoUrl: 'https://www.youtube.com/watch?v=jV8B24rSN5o' }
        ]
      },
      {
        title: 'Graphic Design Masterclass',
        description: 'Learn Photoshop, Illustrator, and InDesign. Become a professional graphic designer by creating logos, business cards, and brochures.',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Photoshop', 'Illustrator', 'InDesign', 'Logo Design'],
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to Photoshop', videoUrl: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' }
        ]
      },
      {
        title: 'The Complete SQL Bootcamp',
        description: 'Learn SQL querying for PostgreSQL, MySQL, and SQL Server. Become an expert in data manipulation and complex queries.',
        category: 'Data Science',
        imageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['SQL Basics', 'Joins', 'Aggregations', 'Database Design'],
        instructor: instructor._id,
        lessons: [
          { title: 'What is SQL?', videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }
        ]
      },
      {
        title: 'Social Media Marketing Agency',
        description: 'Start and scale your own social media marketing agency. Learn how to get clients and deliver amazing results with Facebook Ads.',
        category: 'Marketing',
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Starting an SMMA', 'Client acquisition', 'Facebook Ads', 'Reporting'],
        instructor: instructor._id,
        lessons: [
          { title: 'What is SMMA?', videoUrl: 'https://www.youtube.com/watch?v=ZRXH3b0W2wQ' }
        ]
      },
      {
        title: 'Mobile App Development with Flutter',
        description: 'Build native iOS and Android apps with a single codebase using Flutter and Dart. A complete guide to cross-platform mobile development.',
        category: 'Mobile Development',
        imageUrl: 'https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Flutter basics', 'Dart programming', 'State Management', 'API Integration'],
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to Flutter', videoUrl: 'https://www.youtube.com/watch?v=fq4N0hgOWzU' }
        ]
      },
      {
        title: 'iOS App Development with Swift',
        description: 'Learn Swift and build real-world iOS apps. This course covers everything from basic syntax to advanced UI and networking.',
        category: 'Mobile Development',
        imageUrl: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Swift 5', 'UIKit', 'SwiftUI', 'App Store Deployment'],
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to Swift', videoUrl: 'https://www.youtube.com/watch?v=comQ1-x2a1Q' }
        ]
      },
      {
        title: 'Photography Masterclass: A Complete Guide to Photography',
        description: 'Learn how to take amazing photos, both as an amateur or professional. Covers composition, lighting, and editing.',
        category: 'Photography',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        whatYouWillLearn: ['Camera Basics', 'Composition', 'Lighting', 'Photo Editing'],
        instructor: instructor._id,
        lessons: [
          { title: 'Camera Basics', videoUrl: 'https://www.youtube.com/watch?v=V7z7BAZdt2M' }
        ]
      }
    ];

    // 4. Insert dummy courses
    await Course.insertMany(coursesToInsert);
    console.log(`Inserted ${coursesToInsert.length} courses!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedCourses();
