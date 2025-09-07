// src/api/routes/article.routes.ts
import { Router } from 'express';
import { handleMulterError, upload } from '../../config/multer.config'; // Diperlukan untuk upload gambar
import {
    createArticle,
    deleteArticle,
    getArticleById,
    getArticles,
    getPublicArticleDetail,
    updateArticle
} from '../controllers/article.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Endpoint GET bisa publik
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.get('/public/:id', getPublicArticleDetail);

// Endpoint modifikasi dilindungi
// 'upload.single('featuredImage')' akan menangani upload file sebelum controller dijalankan
router.get('/admin/:id', protect, getArticleById);
router.post('/', protect, upload.single('featuredImage'), handleMulterError, createArticle);
router.put('/:id', protect, upload.single('featuredImage'), handleMulterError, updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;