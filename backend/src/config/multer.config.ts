// src/config/multer.config.ts
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

// Valid file types for upload
const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];

// File size limits (5MB max)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file, cb) => {
        // --- LOGIKA BARU UNTUK MENENTUKAN AWALAN ---
        let prefix = 'file'; // Awalan default

        if (req.originalUrl.includes('/packages')) {
            prefix = 'package';
        } else if (req.originalUrl.includes('/articles')) {
            prefix = 'article';
        } else if (req.originalUrl.includes('/settings/hero')) {
            prefix = 'hero';
        } else if (req.originalUrl.includes('/settings/experience')) {
            prefix = 'experience';
        } else if (req.originalUrl.includes('/gallery')) {
            prefix = 'gallery';
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Gabungkan awalan baru dengan akhiran unik dan ekstensi file asli
        cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`));
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only allow single file uploads
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
export const handleMulterError = (err: any, req: Request, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files. Only one file allowed.' });
        }
    }
    
    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({
            message: err.message,
            allowedTypes: allowedFileTypes
        });
    }
    
    next(err);
};