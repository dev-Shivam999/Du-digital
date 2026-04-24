import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files allowed'));
    },
});

// POST /api/upload/image — used by the blog editor for inline images
router.post('/image', protect, upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
