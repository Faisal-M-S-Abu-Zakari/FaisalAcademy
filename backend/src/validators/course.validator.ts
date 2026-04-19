import { z } from 'zod';

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  videoUrl: z.string().url('Must be a valid URL'),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  whatYouWillLearn: z.array(z.string()).optional().default([]),
  lessons: z.array(lessonSchema).optional().default([]),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
  lessons: z.array(lessonSchema).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
