// src/api/routes/submission.routes.ts
import { Router } from 'express';
import { createSubmission, getSubmissions, deleteSubmission, markSubmissionAsRead } from '../controllers/submission.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Membuat kiriman baru harus publik
router.post('/', createSubmission);

// Melihat dan mengelola kiriman harus dilindungi
router.get('/', protect, getSubmissions);
router.delete('/:id', protect, deleteSubmission);
router.patch('/:id/read', protect, markSubmissionAsRead);

export default router;