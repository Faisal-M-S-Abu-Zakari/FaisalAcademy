import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Comment from '../models/Comment';
import Course from '../models/Course';

export const getCourseComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await Comment.find({ course: req.params.courseId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const comment = await Comment.create({
      text: req.body.text,
      user: req.user!._id,
      course: course._id,
      parentComment: req.body.parentComment || null,
    });

    const populatedComment = await Comment.findById(comment._id);

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllComments = async (req: AuthRequest, res: Response) => {
  try {
    // For admin to see all comments
    const comments = await Comment.find().sort({ createdAt: -1 }).populate('course', 'title');
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only admin or the comment owner can delete
    if (req.user!.role !== 'admin' && comment.user._id.toString() !== req.user!._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
