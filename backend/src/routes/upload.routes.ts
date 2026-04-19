import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // We will save to backend/public/uploads
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.post(
  '/',
  protect,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // Return the publicly accessible URL. Path will be /uploads/filename
    const publicUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      data: { url: publicUrl },
    });
  }
);

export default router;
