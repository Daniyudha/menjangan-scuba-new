// src/api/routes/testimonial.routes.ts
import { Router } from 'express';
import { upload } from '../../config/multer.config';
import { protect } from '../middleware/auth.middleware';
import { 
    getTestimonials, 
    deleteTestimonial, 
    updateTestimonialFeaturedStatus,
    createTestimonial 
} from '../controllers/testimonial.controller';

const router = Router();

// GET bisa publik
router.get('/', getTestimonials);

// POST untuk testimonial publik (tanpa authentication)
router.post('/', upload.single('avatar'), createTestimonial);

// Modifikasi harus dilindungi (hanya admin)
router.delete('/:id', protect, deleteTestimonial);
router.patch('/:id/featured', protect, updateTestimonialFeaturedStatus);

export default router;