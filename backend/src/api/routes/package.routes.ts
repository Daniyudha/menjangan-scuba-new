// src/api/routes/package.routes.ts
import { Router } from 'express';
import {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} from '../controllers/package.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../../config/multer.config'; // 1. Impor multer

const router = Router();

// Endpoint GET
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Endpoint CREATE - sekarang menggunakan multer
router.post('/', protect, upload.single('featuredImage'), createPackage);

// Endpoint UPDATE - sekarang menggunakan multer
router.put('/:id', protect, upload.single('featuredImage'), updatePackage);

// Endpoint DELETE
router.delete('/:id', protect, deletePackage);

export default router;