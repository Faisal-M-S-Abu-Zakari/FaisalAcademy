import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import userRoutes from './routes/user.routes';
import newsletterRoutes from './routes/newsletter.routes';
import commentRoutes from './routes/comment.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Noon Academy API is running' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server Error',
    });
  }
);

export default app;
