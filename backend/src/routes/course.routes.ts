import { Router } from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getInstructorStats,
} from '../controllers/course.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validators/course.validator';

const router = Router();

// Public routes
router.get('/', getCourses);

// Must be defined before /:id so it doesn't match the ID route
router.get('/instructor/stats', protect, authorize('instructor'), getInstructorStats);

router.get('/:id', getCourse);

// Protected routes
router.post(
  '/',
  protect,
  authorize('instructor', 'admin'),
  validate(createCourseSchema),
  createCourse
);
router.put(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  validate(updateCourseSchema),
  updateCourse
);
router.delete(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  deleteCourse
);

// Student enrollment
router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);

export default router;
