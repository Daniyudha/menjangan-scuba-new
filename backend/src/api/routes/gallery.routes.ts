// src/api/routes/gallery.routes.ts
import { Router } from 'express';
import {
    getGalleryImages,
    uploadGalleryImage,
    deleteGalleryImage,
    getGalleryCategories,
    createCategory,
    deleteCategory,
    uploadCkeditorImage,
    getGalleryVideos,
    createGalleryVideo,
    deleteGalleryVideo
} from '../controllers/gallery.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../../config/multer.config';

const router = Router();

// --- Image Routes ---
router.get('/images', getGalleryImages); // Publik
router.post('/images', protect, upload.single('upload'), uploadGalleryImage); // Dilindungi
router.delete('/images/:id', protect, deleteGalleryImage); // Dilindungi

// --- Category Routes ---
router.get('/categories', getGalleryCategories); // Publik
router.post('/categories', protect, createCategory); // Dilindungi
router.delete('/categories/:id', protect, deleteCategory); // Dilindungi

// --- CKEditor Route ---
// Dilindungi karena hanya admin yang bisa upload via CKEditor
router.post('/ckeditor', protect, upload.single('upload'), uploadCkeditorImage);

// --- Video Routes ---
router.get('/videos', getGalleryVideos); // Publik
router.post('/videos', protect, createGalleryVideo); // Dilindungi
router.delete('/videos/:id', protect, deleteGalleryVideo); // Dilindungi

export default router;