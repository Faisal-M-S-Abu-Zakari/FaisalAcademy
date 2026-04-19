import { Router } from 'express';
import {
  getCourseComments,
  createComment,
  deleteComment,
  getAllComments,
} from '../controllers/comment.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

// We need mergeParams to get the courseId from course routes if nested, 
// but we might just use regular routes. Let's use mergeParams=true just in case.
const router = Router({ mergeParams: true });

// Routes for a specific course: /api/courses/:courseId/comments
router.route('/')
  .get(getCourseComments)
  .post(protect, createComment);

// Admin route to view all comments /api/comments
// Admin route to delete /api/comments/:id
// Also user deleting their own comment: /api/comments/:id
router.route('/all')
  .get(protect, authorize('admin'), getAllComments);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
