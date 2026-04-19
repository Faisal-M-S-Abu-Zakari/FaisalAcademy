import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          photoUrl: user.photoUrl,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// POST /api/auth/login
export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          photoUrl: user.photoUrl,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// GET /api/auth/me
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate('enrolledCourses');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        photoUrl: user.photoUrl,
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// PUT /api/auth/me
export const updateMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, bio, photoUrl } = req.body;
    
    // We do not allow password or role updates here
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, bio, photoUrl },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        photoUrl: updatedUser.photoUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
