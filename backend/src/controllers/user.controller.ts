import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /api/users - Admin only
export const getUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id/role - Admin only
export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id - Admin only
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
