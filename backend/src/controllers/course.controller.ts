import { Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /api/courses
export const getCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/courses/instructor/stats
export const getInstructorStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const instructorId = req.user!._id;
    // Find all courses by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);
    
    // Count distinct users who have at least one of these courseIds in enrolledCourses
    const totalStudents = await User.countDocuments({
      enrolledCourses: { $in: courseIds },
      role: 'student'
    });

    res.status(200).json({
      success: true,
      data: {
        courses: courses.length,
        totalStudents,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/courses/:id
export const getCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name email'
    );

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/courses
export const createCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, imageUrl, category, lessons } = req.body;

    const course = await Course.create({
      title,
      description,
      imageUrl,
      category,
      instructor: req.user!._id,
      lessons: lessons || [],
    });

    await course.populate('instructor', 'name email');

    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    // Only the instructor who created it or an admin can update
    if (
      course.instructor.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
      return;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('instructor', 'name email');

    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    // Only the instructor who created it or an admin can delete
    if (
      course.instructor.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
      return;
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove from all students' enrolledCourses
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/courses/:id/enroll
export const enrollInCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      });
      return;
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled',
      data: { enrolledCourses: user.enrolledCourses },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
