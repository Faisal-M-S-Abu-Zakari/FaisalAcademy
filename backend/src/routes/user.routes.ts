import { Router } from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// All routes require admin access
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
